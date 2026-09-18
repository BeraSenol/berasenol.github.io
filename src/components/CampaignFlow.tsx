import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useReveal } from "../hooks/useReveal";
import { MAIL_GLYPH } from "./glyph-data";
import { WindowFrame } from "./WindowFrame";

const FLOW_GRADIENT_ID = "campaign-flow";

/** Made up, but fixed: a value drawn at render time would change under React and flicker. */
const AUDIENCE_TOTAL = 1247913;

/**
 * Every node is the same size, so the flow reads as one kind of thing happening
 * five times rather than a hierarchy.
 */
const NODE = 76;
const ROW = 160;
const TOP = 74;
const BOTTOM = 246;

const API = { cx: 48, cy: ROW };
const SCRIPT = { cx: 178, cy: ROW };
const AUDIENCE_NL = { cx: 308, cy: TOP };
const AUDIENCE_EN = { cx: 308, cy: BOTTOM };
const MAIL_NL = { cx: 438, cy: TOP };
const MAIL_EN = { cx: 438, cy: BOTTOM };

/*
 * Path lengths, for the draw-on. Measured by integrating each curve rather than
 * read off the DOM with getTotalLength: these are fixed geometry, so computing
 * them at runtime would mean a ref and a layout effect for a number that cannot
 * change. The straight ones are just their own length.
 */
const LEN_STRAIGHT = 45;
const LEN_SPLIT = 104.01;

/**
 * One pen speed for every connector, in svg units per millisecond, so the short
 * straight hops and the long split curves draw at the same rate instead of all
 * taking the same time and making the curves look hurried. 45 units takes 310ms,
 * the 104-unit curves take 717ms.
 */
const DRAW_SPEED = 0.145;
const drawMs = (length: number) => Math.round(length / DRAW_SPEED);

/** The steps the flow builds itself in. Each is the previous plus one thing. */
const STEPS = {
  api: 1,
  firstArrow: 2,
  script: 3,
  split: 4,
  audiences: 5,
  mailArrows: 6,
  mails: 7,
} as const;

/*
 * Retimed around the draw durations: a step that follows a connector starts
 * after that connector has finished drawing, so the script never lands while the
 * arrow pointing at it is still halfway there.
 */
const TIMELINE: [number, number][] = [
  [STEPS.api, 200],
  [STEPS.firstArrow, 620],
  [STEPS.script, 1000],
  [STEPS.split, 1450],
  [STEPS.audiences, 2250],
  [STEPS.mailArrows, 2700],
  [STEPS.mails, 3100],
];

function squircle(
  cx: number,
  cy: number,
  size: number,
  n = 5,
  steps = 64,
): string {
  const r = size / 2;
  const points: string[] = [];

  for (let i = 0; i < steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const x = cx + Math.sign(cos) * Math.abs(cos) ** (2 / n) * r;
    const y = cy + Math.sign(sin) * Math.abs(sin) ** (2 / n) * r;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return `${points.join("")}Z`;
}

/**
 * Every connector, with the head it arrives under. Keeping the line and its head
 * in one record is what lets the head wait for its own line: the delay is that
 * line's own draw duration, not a number guessed once for all five.
 */
const CONNECTORS = [
  {
    d: "M86 160H131",
    length: LEN_STRAIGHT,
    at: STEPS.firstArrow,
    head: { x: 131, y: 160 },
  },
  {
    d: "M216 160C250 160 240 74 261 74",
    length: LEN_SPLIT,
    at: STEPS.split,
    head: { x: 261, y: 74 },
  },
  {
    d: "M216 160C250 160 240 246 261 246",
    length: LEN_SPLIT,
    at: STEPS.split,
    head: { x: 261, y: 246 },
  },
  {
    d: "M346 74H391",
    length: LEN_STRAIGHT,
    at: STEPS.mailArrows,
    head: { x: 391, y: 74 },
  },
  {
    d: "M346 246H391",
    length: LEN_STRAIGHT,
    at: STEPS.mailArrows,
    head: { x: 391, y: 246 },
  },
];

/** A right-pointing head. Every connector arrives horizontally, so none of these rotate. */
function arrowHead(x: number, y: number, size = 9): string {
  return `M${x} ${y - size * 0.62}L${x + size} ${y}L${x} ${y + size * 0.62}Z`;
}

type Art = { x: number; y: number; w: number; h: number };

/**
 * Scales a glyph drawn in its own coordinates onto a node's centre.
 *
 * The box is the artwork's ink box, measured with getBBox, and the origin is
 * subtracted rather than assumed to be zero. Exports pad differently: this one
 * set starts flush at the top left and another starts a couple of units down
 * its canvas, and without the subtraction that second one renders low and its
 * `target` means box height instead of ink height. Which is to say the glyphs
 * are now all the size they say they are.
 */
function place(art: Art, cx: number, cy: number, target: number): string {
  const scale = target / art.h;
  const x = cx - (art.w * scale) / 2 - art.x * scale;
  const y = cy - target / 2 - art.y * scale;
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})`;
}

const API_ART: Art = { x: 0, y: 0, w: 26.0645, h: 23.1167 };
const SCRIPT_ART: Art = { x: 0, y: 0, w: 21.5145, h: 30.9779 };
const AUDIENCE_ART: Art = { x: 0, y: 1.543, w: 48.0078, h: 23.125 };
const MAIL_ART: Art = {
  x: 0,
  y: 0.0098,
  w: MAIL_GLYPH.width,
  h: MAIL_GLYPH.height,
};

const API_PATHS = [
  "M0 8.76125C0 11.9839 1.19141 14.9527 3.28125 17.1792C3.69141 17.6284 4.28711 17.6284 4.63867 17.228C4.9707 16.8374 4.86328 16.3296 4.48242 15.8999C2.74414 14.0054 1.74805 11.5152 1.74805 8.76125C1.74805 5.99758 2.74414 3.50734 4.48242 1.62258C4.86328 1.18312 4.9707 0.675312 4.63867 0.294453C4.28711-0.105938 3.69141-0.105938 3.28125 0.343281C1.19141 2.56008 0 5.52883 0 8.76125ZM21.4355 17.228C21.7773 17.6284 22.3828 17.6284 22.793 17.1792C24.873 14.9527 26.0645 11.9839 26.0645 8.76125C26.0645 5.52883 24.873 2.56008 22.793 0.343281C22.3828-0.105938 21.7773-0.105938 21.4355 0.294453C21.0938 0.675312 21.2012 1.18312 21.582 1.62258C23.3301 3.50734 24.3164 5.99758 24.3164 8.76125C24.3164 11.5152 23.3301 14.0054 21.582 15.8999C21.2012 16.3296 21.0938 16.8374 21.4355 17.228Z",
  "M5.19531 8.76125C5.19531 10.5874 5.83008 12.2866 6.94336 13.605C7.32422 14.0835 7.96875 14.0737 8.32031 13.6734C8.66211 13.2827 8.51562 12.8042 8.17383 12.3452C7.35352 11.398 6.94336 10.1284 6.94336 8.76125C6.94336 7.39406 7.40234 6.16359 8.17383 5.17727C8.51562 4.70852 8.66211 4.23 8.32031 3.84914C7.96875 3.44875 7.32422 3.43898 6.94336 3.9175C5.83008 5.23586 5.19531 6.93508 5.19531 8.76125ZM17.7441 13.6734C18.1055 14.0737 18.7402 14.0835 19.1309 13.605C20.2344 12.2866 20.8789 10.5874 20.8789 8.76125C20.8789 6.93508 20.2344 5.23586 19.1309 3.9175C18.7402 3.43898 18.1055 3.44875 17.7441 3.84914C17.4121 4.23 17.5586 4.70852 17.8906 5.17727C18.6719 6.16359 19.1211 7.39406 19.1211 8.76125C19.1211 10.1284 18.7207 11.398 17.8906 12.3452C17.5488 12.8042 17.4121 13.2827 17.7441 13.6734Z",
  "M10.9375 8.76125C10.9375 9.63039 11.4551 10.3628 12.207 10.6753L12.207 22.189C12.207 22.7359 12.5488 23.1167 13.0371 23.1167C13.5449 23.1167 13.8574 22.7456 13.8574 22.189L13.8574 10.6753C14.6094 10.3628 15.1367 9.62062 15.1367 8.76125C15.1367 7.58937 14.209 6.65187 13.0371 6.65187C11.8652 6.65187 10.9375 7.58937 10.9375 8.76125Z",
];

const SCRIPT_PATH =
  "M0.0011577 13.3398C-0.0281392 14.6289 0.499205 15.8008 1.51483 16.7969L7.0617 22.373C4.79608 23.9453 3.966 25.2441 3.966 26.9434C3.966 29.3848 5.92889 30.9473 8.0871 30.9766C9.3371 31.0059 10.4504 30.5273 11.2023 29.7559L20.1086 20.8301C22.1203 18.8184 21.964 16.4453 19.6984 14.1797L14.5715 9.05273L16.4074 7.20703C17.2375 6.38672 17.716 5.3125 17.7062 4.25781C17.7551 1.86523 15.9094 0.00976562 13.4973 0C12.1398 0 11.0949 0.488281 9.91327 1.67969L1.24139 10.3418C0.450376 11.1328 0.020689 12.1875 0.0011577 13.3398ZM4.70819 9.32617L11.134 2.89062C11.9836 2.04102 12.5988 1.73828 13.4973 1.73828C14.9523 1.73828 15.9973 2.7832 15.9973 4.22852C15.9973 4.83398 15.7043 5.47852 15.1965 5.99609L8.26288 12.9102C8.22381 10.8984 6.81756 9.46289 4.70819 9.32617ZM1.81756 13.5059C1.81756 11.9629 2.7746 10.9277 4.18085 10.9277C5.65545 10.9277 6.67108 12.002 6.67108 13.6035C6.67108 13.7793 6.67108 14.3066 6.48553 14.8438C6.1828 15.7812 7.32538 16.3184 7.96991 15.6543L13.3508 10.2734L18.4875 15.4004C20.0988 17.002 20.1965 18.3008 18.8879 19.6191L12.1691 26.3379C12.0422 25.1172 11.4367 24.3262 10.1086 22.9883L3.18475 16.0254C2.1496 14.9805 1.81756 14.3457 1.81756 13.5059ZM5.69452 27.041C5.69452 25.7715 6.44647 24.8438 8.33124 23.6328L8.89764 24.1992C10.1867 25.498 10.5676 26.1133 10.5676 27.041C10.5773 28.252 9.47381 29.248 8.0871 29.248C6.82733 29.248 5.69452 28.3203 5.69452 27.041Z";

const AUDIENCE_PATHS = [
  "M48.0078 22.666C48.0078 24.0039 47.2168 24.668 45.6152 24.668L35.9261 24.668C36.2447 24.2086 36.4189 23.6651 36.4612 23.0664L45.8594 23.0664C46.2402 23.0664 46.3965 22.9297 46.3965 22.5781C46.3965 19.2969 42.7637 16.3086 38.5254 16.3086C36.9249 16.3086 35.4094 16.7347 34.1437 17.4428C33.7965 17.0389 33.3993 16.6539 32.9595 16.2933C34.503 15.3151 36.418 14.7168 38.5254 14.7168C43.8867 14.7168 48.0078 18.6035 48.0078 22.666ZM43.1836 8.0957C43.1836 10.9473 41.1133 13.2227 38.5352 13.2227C35.9668 13.2227 33.8867 10.957 33.8867 8.11523C33.8867 5.38086 35.9863 3.10547 38.5352 3.10547C41.1133 3.10547 43.1836 5.3418 43.1836 8.0957ZM35.498 8.11523C35.498 10.0684 36.875 11.6113 38.5352 11.6113C40.2051 11.6113 41.582 10.0684 41.582 8.0957C41.582 6.2207 40.2246 4.7168 38.5352 4.7168C36.875 4.7168 35.498 6.25 35.498 8.11523Z",
  "M15.0483 16.2933C14.6092 16.6534 14.2124 17.0378 13.8656 17.4411C12.6008 16.7341 11.0854 16.3086 9.48242 16.3086C5.24414 16.3086 1.61133 19.2969 1.61133 22.5781C1.61133 22.9297 1.76758 23.0664 2.14844 23.0664L11.5466 23.0664C11.5889 23.6651 11.7631 24.2086 12.0817 24.668L2.39258 24.668C0.800781 24.668 0 24.0039 0 22.666C0 18.6035 4.12109 14.7168 9.48242 14.7168C11.5898 14.7168 13.5048 15.3151 15.0483 16.2933ZM14.1504 8.0957C14.1504 10.9473 12.0703 13.2227 9.50195 13.2227C6.93359 13.2227 4.85352 10.957 4.85352 8.11523C4.85352 5.38086 6.94336 3.10547 9.50195 3.10547C12.0703 3.10547 14.1504 5.3418 14.1504 8.0957ZM6.46484 8.11523C6.46484 10.0684 7.83203 11.6113 9.50195 11.6113C11.1719 11.6113 12.5488 10.0684 12.5488 8.0957C12.5488 6.2207 11.1816 4.7168 9.50195 4.7168C7.83203 4.7168 6.46484 6.25 6.46484 8.11523Z",
  "M24.0137 13.0762C26.9727 13.0762 29.3652 10.4688 29.3652 7.23633C29.3652 4.0625 26.9727 1.54297 24.0137 1.54297C21.0742 1.54297 18.6719 4.10156 18.6719 7.25586C18.6719 10.4785 21.0547 13.0762 24.0137 13.0762ZM24.0137 11.4453C22.041 11.4453 20.4004 9.60938 20.4004 7.25586C20.4004 4.9707 22.0312 3.17383 24.0137 3.17383C26.0059 3.17383 27.6367 4.94141 27.6367 7.23633C27.6367 9.58984 26.0059 11.4453 24.0137 11.4453ZM15.9473 24.668L32.0605 24.668C33.9941 24.668 34.9219 24.0625 34.9219 22.7539C34.9219 19.4629 30.7715 14.7363 24.0039 14.7363C17.2363 14.7363 13.0957 19.4629 13.0957 22.7539C13.0957 24.0625 14.0137 24.668 15.9473 24.668ZM15.4785 23.0371C14.9902 23.0371 14.8242 22.9102 14.8242 22.5586C14.8242 20.2832 18.1348 16.377 24.0039 16.377C29.873 16.377 33.1836 20.2832 33.1836 22.5586C33.1836 22.9102 33.0176 23.0371 32.5293 23.0371Z",
];

const MAIL_PATH = MAIL_GLYPH.d;

/** Dutch grouping, which is what the page's other locale uses. */
const groupThousands = (value: number) =>
  String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Counts up to the total, fast, once the panel is on screen.
 *
 * rAF rather than a CSS transition because the thing being animated is text
 * content, which CSS cannot interpolate. The effect cancels its own frame on
 * unmount, and reduced motion gets the final number with no count at all.
 */
function useCountUp(active: boolean, total: number, duration = 850) {
  const [value, setValue] = useState(() =>
    prefersReducedMotion() ? total : 0,
  );
  const frame = useRef(0);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic, so it sprints and settles rather than crawling to the end
      setValue(total * (1 - (1 - t) ** 3));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame.current);
  }, [active, total, duration]);

  return value;
}

/**
 * A campaign flow that builds itself: the API lands, an arrow reaches out, the
 * script appears, the split draws, both audiences arrive together, and each one
 * sends a mail.
 *
 * Connectors draw with stroke-dashoffset. A dash pattern as long as the path
 * hides it completely at an offset of its own length, and animating the offset
 * to zero walks the visible part along the line from its start point to its end
 * point, which is the only way to draw an SVG stroke over time without running
 * JavaScript every frame. The dash lengths are the paths' real lengths, so the
 * gap covers the whole line and nothing is visible before the draw starts.
 */
export function CampaignFlow() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const [step, setStep] = useState(() =>
    prefersReducedMotion() ? STEPS.mails : 0,
  );
  const count = useCountUp(isVisible, AUDIENCE_TOTAL);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const timers = TIMELINE.map(([value, at]) =>
      window.setTimeout(() => setStep(value), at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [isVisible]);

  const nodeStyle = (at: number) => ({
    opacity: step >= at ? 1 : 0,
    transform: step >= at ? "scale(1)" : "scale(0.82)",
  });

  return (
    <div ref={ref}>
      <WindowFrame address="campaign-builder">
        <p className="flex items-baseline gap-2 text-ink">
          <span className="text-lg font-semibold tabular-nums tracking-tight">
            {groupThousands(count)}
          </span>
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-dim">
            Profiles
          </span>
        </p>

        <svg
          viewBox="0 0 486 296"
          className="mt-5 block w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={FLOW_GRADIENT_ID}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="486"
              y2="0"
            >
              <stop offset="7%" stopColor="#83a0ef" />
              <stop offset="80%" stopColor="#e1e5ff" />
            </linearGradient>
          </defs>

          <g transform="translate(0 -22)">
            {/*
             * Butt caps, the default, and deliberately not round ones. A cap is
             * drawn beyond the path's endpoint, half the stroke width of it, so a
             * round cap on a 3-unit stroke put a 1.5-unit nub past the start of
             * every connector, which is exactly on the squircle's edge. The nodes
             * are painted after the connectors and so are on top of them, but
             * their fill is white at 5%, so the bright nub read straight through
             * it and looked like the arrow was in front. A round cap also draws a
             * full dot for a zero-length segment, which is what the dash-offset
             * draw starts from, so each line popped a dot before it grew.
             */}
            <g fill="none" stroke={`url(#${FLOW_GRADIENT_ID})`} strokeWidth="3">
              {CONNECTORS.map((line) => (
                <path
                  key={line.d}
                  d={line.d}
                  style={{
                    strokeDasharray: line.length,
                    strokeDashoffset: step >= line.at ? 0 : line.length,
                    transitionProperty: "stroke-dashoffset",
                    transitionDuration: `${drawMs(line.length)}ms`,
                    // Linear, because a pen moving at a constant speed is the
                    // whole illusion. Any easing makes the tip lurch.
                    transitionTimingFunction: "linear",
                  }}
                />
              ))}
            </g>

            <g fill={`url(#${FLOW_GRADIENT_ID})`}>
              {CONNECTORS.map((line) => (
                <path
                  key={line.d}
                  d={arrowHead(line.head.x, line.head.y)}
                  className="transition-opacity duration-200 ease-out"
                  style={{
                    opacity: step >= line.at ? 1 : 0,
                    // Starts 90ms before the line lands, so the head grows out of
                    // the arriving tip instead of popping on after a pause.
                    transitionDelay:
                      step >= line.at ? `${drawMs(line.length) - 90}ms` : "0ms",
                  }}
                />
              ))}
            </g>

            {[
              {
                node: API,
                art: API_ART,
                paths: API_PATHS,
                size: 30,
                at: STEPS.api,
                label: null,
              },
              {
                node: SCRIPT,
                art: SCRIPT_ART,
                paths: [SCRIPT_PATH],
                size: 34,
                at: STEPS.script,
                label: null,
              },
              {
                node: AUDIENCE_NL,
                art: AUDIENCE_ART,
                paths: AUDIENCE_PATHS,
                size: 21,
                at: STEPS.audiences,
                label: "NL",
              },
              {
                node: AUDIENCE_EN,
                art: AUDIENCE_ART,
                paths: AUDIENCE_PATHS,
                size: 21,
                at: STEPS.audiences,
                label: "EN",
              },
              {
                node: MAIL_NL,
                art: MAIL_ART,
                paths: [MAIL_PATH],
                size: 22,
                at: STEPS.mails,
                label: "NL",
              },
              {
                node: MAIL_EN,
                art: MAIL_ART,
                paths: [MAIL_PATH],
                size: 22,
                at: STEPS.mails,
                label: "EN",
              },
            ].map(({ node, art, paths, size, at, label }) => (
              <g
                key={`${node.cx}-${node.cy}`}
                className="transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
                style={{
                  ...nodeStyle(at),
                  transformOrigin: `${node.cx}px ${node.cy}px`,
                }}
              >
                <path
                  d={squircle(node.cx, node.cy, NODE)}
                  className="fill-ink/5 stroke-hairline"
                  strokeWidth="2"
                />
                <g
                  className="fill-ink/80"
                  transform={place(
                    art,
                    node.cx,
                    label ? node.cy - 9 : node.cy,
                    size,
                  )}
                >
                  {paths.map((d) => (
                    <path key={d.slice(0, 24)} d={d} />
                  ))}
                </g>
                {label ? (
                  <text
                    x={node.cx}
                    y={node.cy + 24}
                    className="fill-ink-dim"
                    fontSize="15"
                    fontWeight="600"
                    textAnchor="middle"
                    letterSpacing="1.5"
                  >
                    {label}
                  </text>
                ) : null}
              </g>
            ))}
          </g>
        </svg>
      </WindowFrame>
    </div>
  );
}
