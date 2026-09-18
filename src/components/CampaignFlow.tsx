import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useReveal } from "../hooks/useReveal";
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

const TIMELINE: [number, number][] = [
  [STEPS.api, 250],
  [STEPS.firstArrow, 700],
  [STEPS.script, 1100],
  [STEPS.split, 1550],
  [STEPS.audiences, 2050],
  [STEPS.mailArrows, 2500],
  [STEPS.mails, 3000],
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

/** A right-pointing head. Every connector arrives horizontally, so none of these rotate. */
function arrowHead(x: number, y: number, size = 9): string {
  return `M${x} ${y - size * 0.62}L${x + size} ${y}L${x} ${y + size * 0.62}Z`;
}

/** Scales a glyph drawn in its own coordinates onto a node's centre. */
function place(
  width: number,
  height: number,
  cx: number,
  cy: number,
  target: number,
): string {
  const scale = target / height;
  return `translate(${(cx - (width * scale) / 2).toFixed(2)} ${(cy - target / 2).toFixed(2)}) scale(${scale.toFixed(4)})`;
}

const API_ART = { w: 26.4258, h: 23.2549 };
const SCRIPT_ART = { w: 21.8773, h: 31.0254 };
const AUDIENCE_ART = { w: 47.7832, h: 25.8105 };
const MAIL_ART = { w: 30.498, h: 21.4551 };

const API_PATHS = [
  "M0 8.76125C0 11.9839 1.19141 14.9527 3.28125 17.1792C3.69141 17.6284 4.28711 17.6284 4.63867 17.228C4.9707 16.8374 4.86328 16.3296 4.48242 15.8999C2.74414 14.0054 1.74805 11.5152 1.74805 8.76125C1.74805 5.99758 2.74414 3.50734 4.48242 1.62258C4.86328 1.18312 4.9707 0.675312 4.63867 0.294453C4.28711-0.105938 3.69141-0.105938 3.28125 0.343281C1.19141 2.56008 0 5.52883 0 8.76125ZM21.4355 17.228C21.7773 17.6284 22.3828 17.6284 22.793 17.1792C24.873 14.9527 26.0645 11.9839 26.0645 8.76125C26.0645 5.52883 24.873 2.56008 22.793 0.343281C22.3828-0.105938 21.7773-0.105938 21.4355 0.294453C21.0938 0.675312 21.2012 1.18312 21.582 1.62258C23.3301 3.50734 24.3164 5.99758 24.3164 8.76125C24.3164 11.5152 23.3301 14.0054 21.582 15.8999C21.2012 16.3296 21.0938 16.8374 21.4355 17.228Z",
  "M5.19531 8.76125C5.19531 10.5874 5.83008 12.2866 6.94336 13.605C7.32422 14.0835 7.96875 14.0737 8.32031 13.6734C8.66211 13.2827 8.51562 12.8042 8.17383 12.3452C7.35352 11.398 6.94336 10.1284 6.94336 8.76125C6.94336 7.39406 7.40234 6.16359 8.17383 5.17727C8.51562 4.70852 8.66211 4.23 8.32031 3.84914C7.96875 3.44875 7.32422 3.43898 6.94336 3.9175C5.83008 5.23586 5.19531 6.93508 5.19531 8.76125ZM17.7441 13.6734C18.1055 14.0737 18.7402 14.0835 19.1309 13.605C20.2344 12.2866 20.8789 10.5874 20.8789 8.76125C20.8789 6.93508 20.2344 5.23586 19.1309 3.9175C18.7402 3.43898 18.1055 3.44875 17.7441 3.84914C17.4121 4.23 17.5586 4.70852 17.8906 5.17727C18.6719 6.16359 19.1211 7.39406 19.1211 8.76125C19.1211 10.1284 18.7207 11.398 17.8906 12.3452C17.5488 12.8042 17.4121 13.2827 17.7441 13.6734Z",
  "M10.9375 8.76125C10.9375 9.63039 11.4551 10.3628 12.207 10.6753L12.207 22.189C12.207 22.7359 12.5488 23.1167 13.0371 23.1167C13.5449 23.1167 13.8574 22.7456 13.8574 22.189L13.8574 10.6753C14.6094 10.3628 15.1367 9.62062 15.1367 8.76125C15.1367 7.58937 14.209 6.65187 13.0371 6.65187C11.8652 6.65187 10.9375 7.58937 10.9375 8.76125Z",
];

const SCRIPT_PATH =
  "M0.0011577 13.3398C-0.0281392 14.6289 0.499205 15.8008 1.51483 16.7969L7.0617 22.373C4.79608 23.9453 3.966 25.2441 3.966 26.9434C3.966 29.3848 5.92889 30.9473 8.0871 30.9766C9.3371 31.0059 10.4504 30.5273 11.2023 29.7559L20.1086 20.8301C22.1203 18.8184 21.964 16.4453 19.6984 14.1797L14.5715 9.05273L16.4074 7.20703C17.2375 6.38672 17.716 5.3125 17.7062 4.25781C17.7551 1.86523 15.9094 0.00976562 13.4973 0C12.1398 0 11.0949 0.488281 9.91327 1.67969L1.24139 10.3418C0.450376 11.1328 0.020689 12.1875 0.0011577 13.3398ZM4.70819 9.32617L11.134 2.89062C11.9836 2.04102 12.5988 1.73828 13.4973 1.73828C14.9523 1.73828 15.9973 2.7832 15.9973 4.22852C15.9973 4.83398 15.7043 5.47852 15.1965 5.99609L8.26288 12.9102C8.22381 10.8984 6.81756 9.46289 4.70819 9.32617ZM1.81756 13.5059C1.81756 11.9629 2.7746 10.9277 4.18085 10.9277C5.65545 10.9277 6.67108 12.002 6.67108 13.6035C6.67108 13.7793 6.67108 14.3066 6.48553 14.8438C6.1828 15.7812 7.32538 16.3184 7.96991 15.6543L13.3508 10.2734L18.4875 15.4004C20.0988 17.002 20.1965 18.3008 18.8879 19.6191L12.1691 26.3379C12.0422 25.1172 11.4367 24.3262 10.1086 22.9883L3.18475 16.0254C2.1496 14.9805 1.81756 14.3457 1.81756 13.5059ZM5.69452 27.041C5.69452 25.7715 6.44647 24.8438 8.33124 23.6328L8.89764 24.1992C10.1867 25.498 10.5676 26.1133 10.5676 27.041C10.5773 28.252 9.47381 29.248 8.0871 29.248C6.82733 29.248 5.69452 28.3203 5.69452 27.041Z";

const AUDIENCE_PATHS = [
  "M14.8237 16.5375C12.7673 18.3237 11.6113 20.6022 11.6113 22.6367C11.6113 23.2306 11.764 23.7854 12.0574 24.2578L2.09961 24.2578C0.615234 24.2578 0 23.6719 0 22.5391C0 19.0332 3.53516 14.8828 9.19922 14.8828C11.4379 14.8828 13.3439 15.5311 14.8237 16.5375ZM13.5645 8.125C13.5645 10.8496 11.5723 12.9492 9.20898 12.9492C6.8457 12.9492 4.85352 10.8496 4.85352 8.14453C4.85352 5.49805 6.86523 3.42773 9.20898 3.42773C11.5527 3.42773 13.5645 5.45898 13.5645 8.125Z",
  "M47.4219 22.5391C47.4219 23.6719 46.8066 24.2578 45.332 24.2578L35.4111 24.2578C35.7056 23.7854 35.8594 23.2306 35.8594 22.6367C35.8594 20.5952 34.6954 18.308 32.6254 16.5185C34.1016 15.5231 35.9979 14.8828 38.2227 14.8828C43.8867 14.8828 47.4219 19.0332 47.4219 22.5391ZM42.5879 8.125C42.5879 10.8496 40.6055 12.9492 38.2422 12.9492C35.8789 12.9492 33.877 10.8496 33.877 8.14453C33.877 5.49805 35.8887 3.42773 38.2422 3.42773C40.5859 3.42773 42.5879 5.45898 42.5879 8.125Z",
  "M23.7402 12.666C26.4648 12.666 28.75 10.2539 28.75 7.11914C28.75 4.0625 26.4453 1.72852 23.7402 1.72852C21.0449 1.72852 18.7402 4.10156 18.7402 7.13867C18.7402 10.2539 21.0254 12.666 23.7402 12.666ZM15.2246 24.2578L32.2461 24.2578C33.5156 24.2578 34.2969 23.6426 34.2969 22.6367C34.2969 19.3945 30.2441 14.9219 23.7305 14.9219C17.2168 14.9219 13.1641 19.3945 13.1641 22.6367C13.1641 23.6426 13.9453 24.2578 15.2246 24.2578Z",
];

const MAIL_PATH =
  "M3.79883 21.4551L26.6309 21.4551C28.8477 21.4551 30.1367 20.1758 30.1367 17.6855L30.1367 3.76953C30.1367 1.2793 28.8379 0.00976562 26.3281 0.00976562L3.50586 0.00976562C1.28906 0.00976562 0 1.2793 0 3.76953L0 17.6855C0 20.1758 1.29883 21.4551 3.79883 21.4551ZM3.75977 19.8047C2.41211 19.8047 1.65039 19.0625 1.65039 17.6758L1.65039 3.76953C1.65039 2.40234 2.41211 1.66016 3.75977 1.66016L26.377 1.66016C27.7246 1.66016 28.4766 2.40234 28.4766 3.7793L28.4766 17.6855C28.4766 19.0625 27.7246 19.8047 26.377 19.8047ZM15.0586 13.9062C15.8398 13.9062 16.5723 13.6133 17.2754 12.9785L29.1602 2.28516L28.0273 1.15234L16.3086 11.6992C15.8984 12.0703 15.4883 12.2461 15.0586 12.2461C14.6289 12.2461 14.2285 12.0703 13.8184 11.6992L2.08984 1.15234L0.957031 2.28516L12.8516 12.9785C13.5547 13.6133 14.2773 13.9062 15.0586 13.9062ZM2.28516 19.9902L11.377 10.8984L10.2441 9.77539L1.15234 18.8477ZM27.8613 20L28.9844 18.8574L19.8926 9.77539L18.7598 10.8984Z";

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
  const [value, setValue] = useState(() => (prefersReducedMotion() ? total : 0));
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
 * to zero walks the visible part along the line, which is the only way to draw
 * an SVG stroke over time without JavaScript per frame.
 */
export function CampaignFlow() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const [step, setStep] = useState(() => (prefersReducedMotion() ? STEPS.mails : 0));
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

  const lineStyle = (at: number, length: number) => ({
    strokeDasharray: length,
    strokeDashoffset: step >= at ? 0 : length,
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
            <g
              fill="none"
              stroke={`url(#${FLOW_GRADIENT_ID})`}
              strokeWidth="3"
              className="transition-[stroke-dashoffset] duration-[420ms] ease-out"
            >
              <path
                d="M86 160H131"
                style={lineStyle(STEPS.firstArrow, LEN_STRAIGHT)}
              />
              <path
                d="M216 160C250 160 240 74 261 74"
                style={lineStyle(STEPS.split, LEN_SPLIT)}
              />
              <path
                d="M216 160C250 160 240 246 261 246"
                style={lineStyle(STEPS.split, LEN_SPLIT)}
              />
              <path
                d="M346 74H391"
                style={lineStyle(STEPS.mailArrows, LEN_STRAIGHT)}
              />
              <path
                d="M346 246H391"
                style={lineStyle(STEPS.mailArrows, LEN_STRAIGHT)}
              />
            </g>

            <g
              fill={`url(#${FLOW_GRADIENT_ID})`}
              className="transition-opacity duration-300 ease-out"
            >
              <path
                d={arrowHead(131, 160)}
                style={{ opacity: step >= STEPS.firstArrow ? 1 : 0 }}
              />
              <path
                d={arrowHead(261, 74)}
                style={{ opacity: step >= STEPS.split ? 1 : 0 }}
              />
              <path
                d={arrowHead(261, 246)}
                style={{ opacity: step >= STEPS.split ? 1 : 0 }}
              />
              <path
                d={arrowHead(391, 74)}
                style={{ opacity: step >= STEPS.mailArrows ? 1 : 0 }}
              />
              <path
                d={arrowHead(391, 246)}
                style={{ opacity: step >= STEPS.mailArrows ? 1 : 0 }}
              />
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
                label: null,
              },
              {
                node: MAIL_EN,
                art: MAIL_ART,
                paths: [MAIL_PATH],
                size: 22,
                at: STEPS.mails,
                label: null,
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
                    art.w,
                    art.h,
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
