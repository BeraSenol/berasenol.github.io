import { mix, rgba, type Scene, type SceneFrame } from "./scene";

/**
 * A wavetable, drawn the way a synth shows one in 3D: every frame is one cycle
 * of a waveform, and the frames stand one behind the other, back and up to
 * the right. One frame is lit, and the light travels through the table the
 * way the wavetable position does when an LFO sweeps it: from the sine at the
 * front to the saw at the back, and back again.
 *
 * Behind the Logic Pro card, in the Max colours that card's title uses.
 */

const TAU = Math.PI * 2;

/** How many frames the table is drawn with, and points per cycle. */
const FRAMES = 40;
const SAMPLES = 128;

/** One sweep of the lit frame from front to back and front again. */
const SWEEP_SECONDS = 14;

/*
 * A basic sine at the front of the table and a basic saw at the back, with
 * every frame between them a crossfade of the two, the way a synth fills in
 * the frames between two in a table. Both go up through zero at the start of
 * the cycle and come down at the middle, where the saw drops straight down,
 * so the crossfade reads as one wave changing shape rather than two stacked.
 */
const sine = (x: number) => Math.sin(TAU * x);
const saw = (x: number) => 2 * ((x + 0.5) % 1) - 1;

/** The table itself: x is the phase through one cycle, t the position through the table, both 0 to 1. */
function wave(x: number, t: number): number {
  return sine(x) * (1 - t) + saw(x) * t;
}

function draw(ctx: CanvasRenderingContext2D, { width, height, time, palette }: SceneFrame) {
  /*
   * Everything is sized off one length, so the table keeps its proportions
   * on a wide short card and a narrow tall one alike: 62% of the card's
   * width or 1.35 times its height, whichever is smaller.
   */
  const unit = Math.min(width * 0.62, height * 1.35);
  const cycle = 0.95 * unit;
  const amplitude = 0.13 * unit;
  const depthX = 0.1 * unit;
  const depthY = -0.3 * unit;

  /*
   * The table runs off the card's bottom right corner, the way the Unreal
   * card's grid does, so it reads as part of something larger rather than an
   * object placed on the card: the front frame ends a tenth of a cycle past
   * the right edge, and its troughs dip below the bottom one. The frames
   * behind are shifted right, so they run off the edge too.
   */
  const left = width - 0.9 * cycle;
  const base = height - 0.7 * amplitude;

  /*
   * The lit frame starts on the sine, eases to the saw and eases back, so the
   * loop has no jump. The time only runs while the card is on screen, so the
   * first thing a visitor sees is the sine.
   */
  const lit = 0.5 - 0.5 * Math.cos((TAU * time) / SWEEP_SECONDS);

  /*
   * Back to front, so each frame hides what is behind it: the painter's
   * algorithm. The lit frame is sorted in among the others by its own
   * depth, so the frames in front of it can cover it too.
   */
  const layers: { t: number; lit: boolean }[] = [];
  for (let k = 0; k < FRAMES; k++) layers.push({ t: k / (FRAMES - 1), lit: false });
  layers.push({ t: lit, lit: true });
  layers.sort((a, b) => b.t - a.t);

  ctx.lineWidth = 1;
  ctx.lineJoin = "round";

  for (const layer of layers) {
    // A little perspective: frames narrow as they go back, about their own centre.
    const scale = 1 - 0.18 * layer.t;
    const span = cycle * scale;
    const swing = amplitude * scale;
    const originX = left + depthX * layer.t + (cycle - span) / 2;
    const originY = base + depthY * layer.t;

    const curve = new Path2D();
    for (let j = 0; j <= SAMPLES; j++) {
      const x = j / SAMPLES;
      const px = originX + span * x;
      const py = originY - swing * wave(x, layer.t);
      if (j === 0) curve.moveTo(px, py);
      else curve.lineTo(px, py);
    }

    /*
     * The frame is a sheet from its curve down to its lowest point, filled
     * with the card's own colour. The fill is invisible on the card, and it
     * is what hides the lines behind: hidden-line removal with no maths.
     */
    const sheet = new Path2D(curve);
    sheet.lineTo(originX + span, originY + swing);
    sheet.lineTo(originX, originY + swing);
    sheet.closePath();
    ctx.fillStyle = rgba(palette.surface, 1);
    ctx.fill(sheet);

    if (layer.lit) {
      // Light to deep across the frame, the Max gradient turned on its side.
      const ramp = ctx.createLinearGradient(originX, 0, originX + span, 0);
      ramp.addColorStop(0, rgba(palette.maxLight, 0.55));
      ramp.addColorStop(1, rgba(palette.maxDeep, 0.55));
      ctx.strokeStyle = ramp;
    } else {
      /*
       * Nearer frames lighter and brighter, farther ones deeper and fainter,
       * and the frames either side of the lit one pick up some of its light,
       * so the sweep reads as a glow moving through the table.
       */
      const near = 1 - layer.t;
      const glow = Math.exp(-(((layer.t - lit) / 0.09) ** 2));
      ctx.strokeStyle = rgba(
        mix(palette.maxDeep, palette.maxLight, near * 0.35 + glow * 0.55),
        0.045 + 0.12 * near + 0.24 * glow,
      );
    }
    ctx.stroke(curve);
  }

  /*
   * The table fades in from its left end, the way the Unreal card's grid
   * fades out towards the text, so its only hard edges are the card's own.
   * destination-out rubs the canvas away in proportion to the fill's alpha:
   * fully at the table's left end, not at all 40% of a cycle in.
   */
  const fadeEnd = left + 0.4 * cycle;
  const fade = ctx.createLinearGradient(left, 0, fadeEnd, 0);
  fade.addColorStop(0, "rgb(0 0 0)");
  fade.addColorStop(1, "rgb(0 0 0 / 0)");
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, fadeEnd, height);
  ctx.restore();
}

export const wavetable: Scene = { draw, stillTime: SWEEP_SECONDS * 0.3 };
