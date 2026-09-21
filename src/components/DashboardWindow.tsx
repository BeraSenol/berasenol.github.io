import { useReveal } from "../hooks/useReveal";
import { WindowFrame } from "./WindowFrame";

/**
 * The reporting dashboards, as a mock-up.
 *
 * The three rates are invented, which the section caption says. Everything else
 * is a skeleton: this stands for the shape of what was built, not a screenshot
 * of a real report, and a panel of invented sentences would be claiming more
 * than a rectangle does.
 *
 * The bars grow from the baseline on reveal by animating scaleY against a
 * transform-origin at the bottom, which costs no layout: animating a height
 * would reflow the row on every frame.
 */
const STATS = [
  { label: "Open rate", value: "42.8%" },
  { label: "Click rate", value: "11.3%" },
  { label: "Buy rate", value: "3.6%" },
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

function PanelTitle({ children }: { children: string }) {
  return (
    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-secondary sm:tracking-[0.16em]">
      {children}
    </p>
  );
}

export function DashboardWindow() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <WindowFrame address="reporting">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-separator bg-fill-quaternary p-3 sm:p-4"
            >
              <PanelTitle>{label}</PanelTitle>
              <p className="mt-2 text-base font-semibold tabular-nums tracking-tight text-primary sm:text-xl">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-separator bg-fill-quaternary p-3 sm:p-4">
            <PanelTitle>Sends per day</PanelTitle>
            <div className="mt-4 flex h-28 items-end gap-2">
              {BARS.map((height, index) => (
                <span
                  key={height * 100 + index}
                  className="flex-1 rounded-sm bg-gradient-to-t from-[#83a0ef] to-[#e1e5ff] transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
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
              <PanelTitle>Conflicts</PanelTitle>
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
