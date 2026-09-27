import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/prefersReducedMotion";
import { readPalette, type Scene } from "../scenes/scene";

/*
 * Frames painted per second. Everything in the scenes moves slowly, a few
 * pixels a second, so thirty frames look the same as sixty and cost half.
 * Thirty divides 60 and 120 exactly, so on either kind of screen every paint
 * is the same number of refreshes apart and the motion stays even.
 */
const FRAME_MS = 1000 / 30;

/**
 * A canvas that fills its parent and plays a Scene behind the parent's
 * content.
 *
 * The component renders one element and never re-renders on its own: there is
 * no state here. The animation is not React's business. React draws the
 * canvas once; everything after that happens inside one effect, which talks
 * to four browser APIs and cleans all four up when the canvas leaves the
 * page:
 *
 * - ResizeObserver, to keep the canvas's pixel size equal to its displayed
 *   size times the device pixel ratio. A canvas has two sizes, the box CSS
 *   lays out and the bitmap it draws into; if they differ, the bitmap is
 *   stretched and a one-pixel line comes out blurred or two pixels wide.
 * - IntersectionObserver, so the animation only runs while the card is on
 *   screen. Off screen it costs nothing.
 * - requestAnimationFrame, which calls back once per screen refresh while it
 *   runs; every second or fourth of those paints (see FRAME_MS).
 * - matchMedia, through prefersReducedMotion: with reduced motion the scene
 *   is drawn once, at its still moment, and never animated.
 *
 * That is the case useEffect exists for: keeping something outside React in
 * step with a component while it is mounted. The alternative, a time value in
 * state updated every frame, would re-render the component sixty times a
 * second to change nothing React draws.
 *
 * The parent must be positioned and must isolate a stacking context (the
 * card does both): the canvas sits at z-index -10, which puts it behind the
 * parent's content but, thanks to the isolation, in front of the parent's
 * own background rather than behind it.
 *
 * Text the drawing must stay clear of is marked in the parent with a
 * data-scene-clear attribute. After every frame the canvas rubs itself out
 * behind each line of that text, with a soft edge, so a hairline can pass
 * beside a line of text but never behind a letter. A scene cannot know where
 * the text wraps; the browser can, through a Range over the text, which gives
 * one rectangle per rendered line.
 */
export function SceneCanvas({ scene, className = "" }: { scene: Scene; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  // Runs once per scene. The scenes are module constants, so in practice once.
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const palette = readPalette(canvas);
    const still = prefersReducedMotion();

    let width = 0;
    let height = 0;
    let dpr = 1;
    // The lines of text to keep clear, in canvas pixels. Measured on resize.
    let clear: { x: number; y: number; w: number; h: number }[] = [];
    let time = still ? scene.stillTime : 0;
    let visible = false;
    let frame = 0; // the pending animation frame, 0 when there is none
    let lastPaint = 0;

    const measure = () => {
      const origin = canvas.getBoundingClientRect();
      const range = document.createRange();
      clear = [];
      for (const element of canvas.parentElement?.querySelectorAll("[data-scene-clear]") ?? []) {
        range.selectNodeContents(element);
        for (const line of range.getClientRects()) {
          // Out to whole device pixels and one more, so the edge rows of the
          // line are erased completely rather than blended by anti-aliasing.
          const left = Math.floor((line.left - origin.left) * dpr) - 1;
          const top = Math.floor((line.top - origin.top) * dpr) - 1;
          const right = Math.ceil((line.right - origin.left) * dpr) + 1;
          const bottom = Math.ceil((line.bottom - origin.top) * dpr) + 1;
          clear.push({ x: left, y: top, w: right - left, h: bottom - top });
        }
      }
    };

    const paint = () => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      scene.draw(ctx, { width, height, dpr, time, palette });

      /*
       * Rub out behind the text. destination-out keeps the canvas only where
       * the new shape is not, in proportion to the shape's alpha. The line
       * itself is erased completely; then five passes at 30%, each a little
       * larger than the last, thin the drawing out towards a 10px edge, which
       * reads as a soft fade rather than a cut.
       */
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      for (const line of clear) {
        ctx.fillStyle = "rgb(0 0 0)";
        ctx.fillRect(line.x, line.y, line.w, line.h);
        ctx.fillStyle = "rgb(0 0 0 / 0.3)";
        for (let pass = 1; pass <= 5; pass++) {
          const grow = pass * 2 * dpr;
          ctx.fillRect(line.x - grow, line.y - grow / 2, line.w + grow * 2, line.h + grow);
        }
      }
      ctx.restore();
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // A few milliseconds of slack, so a 60Hz refresh (every 16.7ms) paints
      // on every second call rather than drifting to every third.
      if (now - lastPaint < FRAME_MS - 4) return;
      // Capped, so a paint that comes late (a busy main thread) nudges the
      // animation on rather than jumping it.
      time += Math.min(now - lastPaint, 100) / 1000;
      lastPaint = now;
      paint();
    };

    const play = () => {
      if (still || frame || !visible) return;
      // As if the last paint was a frame ago, so the first call paints.
      lastPaint = performance.now() - FRAME_MS;
      frame = requestAnimationFrame(tick);
    };

    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resizer = new ResizeObserver(([entry]) => {
      /*
       * The exact number of screen pixels the box covers, where the browser
       * reports it (Chrome, Firefox). The card rarely sits on a whole pixel,
       * and a bitmap one pixel off its box is resampled to fit, which smears
       * every hairline across two pixels. Elsewhere (Safari), the box size
       * times the pixel ratio, rounded.
       */
      const exact = entry.devicePixelContentBoxSize?.[0];
      const { width: cssWidth, height: cssHeight } = entry.contentRect;
      width = exact ? exact.inlineSize : Math.round(cssWidth * window.devicePixelRatio);
      height = exact ? exact.blockSize : Math.round(cssHeight * window.devicePixelRatio);
      dpr = cssWidth ? width / cssWidth : window.devicePixelRatio;
      // Setting a canvas's size clears it, so it is painted again straight away.
      canvas.width = width;
      canvas.height = height;
      // The card changed size, so its text may have wrapped differently.
      measure();
      paint();
    });

    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });

    try {
      resizer.observe(canvas, { box: "device-pixel-content-box" });
    } catch {
      // A browser that does not know that box throws; the plain box will do.
      resizer.observe(canvas);
    }
    watcher.observe(canvas);

    return () => {
      pause();
      resizer.disconnect();
      watcher.disconnect();
    };
  }, [scene]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 size-full ${className}`}
    />
  );
}
