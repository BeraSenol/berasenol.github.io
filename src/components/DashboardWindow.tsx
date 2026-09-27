import { useId } from "react";
import type { LocaleCode } from "../content/locales";
import type { MockLabels } from "../content/types";
import { useReveal } from "../hooks/useReveal";
import { WindowFrame } from "./WindowFrame";

/**
 * The reporting dashboards, as a mock-up.
 *
 * The three rates are invented, and the caption Dignify sets under the two
 * windows says so in as many words. Everything else is a skeleton: this stands
 * for the shape of what was built, not a screenshot of a real report, and a
 * panel of invented sentences would be claiming more than a rectangle does.
 *
 * The bars grow from the baseline on reveal by animating scaleY against a
 * transform-origin at the bottom, which costs no layout: animating a height
 * would reflow the row on every frame.
 */

/**
 * Held as numbers, not strings: the gauge needs the number, and the label is
 * derived from it, so the two can never disagree. `label` is a key into the
 * page's MockLabels rather than the words themselves, so they follow the
 * page's language.
 */
const STATS: { label: keyof MockLabels; percent: number }[] = [
  { label: "openRate", percent: 54.2 },
  { label: "clickRate", percent: 17.8 },
  { label: "buyRate", percent: 5.4 },
];

const BARS = [38, 62, 47, 71, 55, 83, 66, 92, 74, 58];

/**
 * What a contact-policy check turns up when two campaigns want the same people
 * on the same day. The dot carries the severity, which is the one thing a
 * skeleton can still say, and the bar stands in for the message. Worst first,
 * and the widths differ so the column reads as five different sentences rather
 * than five copies of one.
 */
const SEVERITY = {
  high: "bg-[#ff5f57]",
  medium: "bg-[#febc2e]",
  low: "bg-tertiary",
} as const;

const CONFLICTS: { width: number; level: keyof typeof SEVERITY }[] = [
  { width: 92, level: "high" },
  { width: 90, level: "high" },
  { width: 88, level: "medium" },
  { width: 71, level: "medium" },
  { width: 74, level: "low" },
];

/**
 * A ring gauge for one rate, in the bars' gradient: the Pro tokens, deep at the
 * bottom to light at the top, so the rings and the chart below read as one
 * palette.
 *
 * The ring is open at the bottom, like a speedometer: a 270-degree arc with
 * a 90-degree gap centred on six o'clock. It starts at the gap's left end
 * (225 degrees clockwise from twelve) and runs clockwise over the top to the
 * gap's right end (135 degrees). The round caps each reach 2 units past the
 * ends, about 8 degrees at this radius, so the gap reads a little narrower
 * than 90. The two end points are cx + r sin(t),
 * cy - r cos(t) at those angles, and the arc flags are large-arc 1 (it is
 * more than half a circle) and sweep 1 (clockwise).
 *
 * A path rather than a rotated circle, because rotating the shape would also
 * rotate the gradient, which is mapped over the shape's own box, and the
 * bottom-to-top ramp would come out running sideways.
 *
 * pathLength="100" makes the arc exactly 100 units long whatever its real
 * length, so the percentage is the dash length directly: 54.2 of its 100
 * units drawn, the rest gap. The track is the same arc, so a full gauge
 * would close up to the gap and no further. The fill animates by transitioning stroke-dasharray from 0,
 * in step with the bars.
 *
 * The gradient needs an id, and there are three gauges in one document. useId
 * gives each instance its own, stable across renders, so each ring points at
 * its own gradient rather than all three at whichever was defined first.
 */
function Gauge({ percent, active }: { percent: number; active: boolean }) {
  const gradientId = useId();
  const ring = "M7.393 28.607A15 15 0 1 1 28.607 28.607";

  return (
    <svg
      viewBox="0 0 36 36"
      aria-hidden="true"
      className="h-8 w-8 shrink-0 sm:h-11 sm:w-11"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--color-pro-deep)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-pro-light)" }} />
        </linearGradient>
      </defs>
      {/* The track: the whole arc, faint, so the fill reads as a share of it. */}
      <path
        d={ring}
        fill="none"
        className="stroke-fill"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d={ring}
        fill="none"
        pathLength={100}
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          strokeDasharray: `${active ? percent : 0} 100`,
          // A round cap on a zero-length dash still draws a dot, so the ring
          // stays hidden until it starts to fill.
          opacity: active ? 1 : 0,
          transition:
            "stroke-dasharray 900ms cubic-bezier(0.33,1,0.68,1) 150ms, opacity 150ms linear",
        }}
      />
    </svg>
  );
}

function PanelTitle({ children }: { children: string }) {
  return (
    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-secondary">
      {children}
    </p>
  );
}

export function DashboardWindow({
  locale,
  labels,
}: {
  locale: LocaleCode;
  labels: MockLabels;
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  /*
   * 54.2% on the English page, 54,2% on the Dutch one. Intl takes a fraction,
   * so the percent is divided back down; one decimal either way, as designed.
   */
  const percentFormat = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div ref={ref}>
      <WindowFrame address="reporting">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {STATS.map(({ label, percent }) => (
            /*
              The card is a size container and lays itself out by its own
              width, not the viewport's. Gauge on the left and the figures
              pushed to the right edge needs about 7.5rem inside the card;
              narrower than that (a phone, and the two-column layout from
              1024 to about 1300) the row ran its label past the card's
              edge, so the gauge stacks above the figures instead.
            */
            <div
              key={label}
              className="@container rounded-lg border border-separator bg-fill-quaternary p-3 sm:p-4"
            >
              <div className="flex flex-col items-start gap-2 @min-[7.5rem]:flex-row @min-[7.5rem]:items-center @min-[7.5rem]:justify-between sm:gap-3">
                <Gauge percent={percent} active={isVisible} />
                <div className="@min-[7.5rem]:text-right">
                  <PanelTitle>{labels[label]}</PanelTitle>
                  <p className="mt-2 text-base font-semibold tabular-nums tracking-tight text-primary sm:text-xl">
                    {percentFormat.format(percent / 100)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-separator bg-fill-quaternary p-3 sm:p-4">
            <PanelTitle>{labels.sendsPerDay}</PanelTitle>
            <div className="mt-4 flex h-28 items-end gap-2">
              {BARS.map((height, index) => (
                <span
                  key={height * 100 + index}
                  className="flex-1 rounded-sm bg-gradient-to-t from-pro-deep to-pro-light transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                  style={{
                    height: `${height}%`,
                    transformOrigin: "bottom",
                    transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                    transitionDelay: `${index * 60}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-separator bg-fill-quaternary p-3 sm:p-4">
            <div className="flex items-baseline justify-between gap-3">
              <PanelTitle>{labels.conflicts}</PanelTitle>
              <span className="text-xs tabular-nums text-secondary">
                {CONFLICTS.length}
              </span>
            </div>
            <ul className="mt-4 space-y-3.5">
              {CONFLICTS.map(({ width, level }, index) => (
                <li
                  key={`${level}-${width}`}
                  // Each row fades up behind the one above it. The transition is
                  // on opacity and transform only, so the list never reflows.
                  className="flex items-center gap-2.5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0)"
                      : "translateY(0.375rem)",
                    transitionDelay: `${300 + index * 90}ms`,
                  }}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${SEVERITY[level]}`}
                  />
                  <span
                    className="h-2 rounded-full bg-fill"
                    style={{ width: `${width}%` }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}
