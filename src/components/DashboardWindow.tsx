import { useReveal } from "../hooks/useReveal";
import { WindowFrame } from "./WindowFrame";

/**
 * The reporting dashboards, as a mock-up.
 *
 * The numbers are invented and deliberately round-ish: this stands for the
 * shape of what was built, not a screenshot of a real report, which is what the
 * caption under it says.
 *
 * The bars grow from the baseline on reveal by animating scaleY against a
 * transform-origin at the bottom, which costs no layout: animating a height
 * would reflow the row on every frame.
 */
const STATS = [
  { label: "Open rate", value: "42.8%", delta: "+2.1 pts" },
  { label: "Click rate", value: "11.3%", delta: "+0.6 pts" },
  { label: "Buy rate", value: "3.6%", delta: "-0.2 pts" },
];

const BARS = [38, 62, 47, 71, 55, 83, 66, 92, 74, 58];

/**
 * What a contact-policy check turns up when two campaigns want the same people
 * on the same day. Severity drives the dot colour, and the order is worst first.
 */
const SEVERITY = {
  high: "bg-[#ff5f57]",
  medium: "bg-[#febc2e]",
  low: "bg-ink/25",
} as const;

const CONFLICTS: { name: string; level: keyof typeof SEVERITY }[] = [
  { name: "Audience overlap: NL and EN", level: "high" },
  { name: "Contact pressure cap exceeded", level: "high" },
  { name: "Send window collision", level: "medium" },
  { name: "Suppression list not applied", level: "medium" },
  { name: "Duplicate profiles in segment", level: "low" },
];

function PanelTitle({ children }: { children: string }) {
  return (
    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-dim">
      {children}
    </p>
  );
}

export function DashboardWindow() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <WindowFrame address="reporting">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map(({ label, value, delta }) => (
            <div
              key={label}
              className="rounded-lg border border-hairline bg-white/[0.02] p-4"
            >
              <PanelTitle>{label}</PanelTitle>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-ink">
                {value}
              </p>
              <p className="mt-1 text-xs tabular-nums text-ink-dim">
                {delta} vs last send
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-hairline bg-white/[0.02] p-4">
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

          <div className="rounded-lg border border-hairline bg-white/[0.02] p-4">
            <div className="flex items-baseline justify-between gap-3">
              <PanelTitle>Conflicts</PanelTitle>
              <span className="text-xs tabular-nums text-ink-dim">
                {CONFLICTS.length}
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {CONFLICTS.map(({ name, level }, index) => (
                <li
                  key={name}
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
                  <span className="text-xs leading-snug text-ink-dim">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}
