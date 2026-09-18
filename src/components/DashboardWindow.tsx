import { useReveal } from "../hooks/useReveal";
import { WindowFrame } from "./WindowFrame";

/**
 * The dashboards, as a skeleton.
 *
 * Bars, tiles and rows with no numbers on them: this stands for the shape of
 * what was built without claiming to be a screenshot of it. Everything is a
 * rectangle, so nothing here depends on font metrics.
 *
 * The bars grow from the baseline on reveal by animating scaleY against a
 * transform-origin at the bottom, which costs no layout: scaling a rect's
 * height directly would.
 */
const BARS = [38, 62, 47, 71, 55, 83, 66, 92, 74, 58];

const ROWS = [72, 54, 88, 41];

export function DashboardWindow() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <WindowFrame address="reporting">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Three stat tiles. */}
          {[0, 1, 2].map((tile) => (
            <div
              key={tile}
              className="rounded-lg border border-hairline bg-white/[0.02] p-4"
            >
              <span className="block h-2 w-10 rounded-full bg-ink/15" />
              <span className="mt-3 block h-4 w-20 rounded bg-ink/30" />
              <span className="mt-2 block h-1.5 w-14 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-hairline bg-white/[0.02] p-4">
            <span className="block h-2 w-16 rounded-full bg-ink/15" />
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
            <span className="block h-2 w-14 rounded-full bg-ink/15" />
            <ul className="mt-4 space-y-3">
              {ROWS.map((width, index) => (
                <li key={width} className="flex items-center gap-3">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-ink/10" />
                  <span className="h-2 flex-1 rounded-full bg-ink/10">
                    <span
                      className="block h-full rounded-full bg-ink/30 transition-[width] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                      style={{
                        width: isVisible ? `${width}%` : "0%",
                        transitionDelay: `${300 + index * 90}ms`,
                      }}
                    />
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
