import type { LanguageSkill } from "../content/types";
import { useReveal } from "../hooks/useReveal";

type LanguagesProps = {
  naturalLabel: string;
  programmingLabel: string;
  nativeNote: string;
  natural: readonly LanguageSkill[];
  programming: readonly LanguageSkill[];
};

/**
 * The CV's two language columns, as bars.
 *
 * Rendered inside Section, so the eyebrow and the h2 come from there and this
 * is only the body. One reveal for the whole grid, and each bar staggers off
 * its row index, so the columns fill top to bottom together rather than one
 * after the other.
 */
export function Languages({
  naturalLabel,
  programmingLabel,
  nativeNote,
  natural,
  programming,
}: LanguagesProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Column
          label={naturalLabel}
          skills={natural}
          nativeNote={nativeNote}
          active={isVisible}
        />
        <Column
          label={programmingLabel}
          skills={programming}
          nativeNote={nativeNote}
          active={isVisible}
        />
      </div>
      {/*
        The key's asterisk is the same blue as the ones it explains, so the
        eye matches them up; the note itself stays tertiary grey.
      */}
      <p className="mt-10 text-xs text-tertiary">
        <span className="text-[#83a0ef]">*</span>
        {nativeNote}
      </p>
    </div>
  );
}

function Column({
  label,
  skills,
  nativeNote,
  active,
}: {
  label: string;
  skills: readonly LanguageSkill[];
  nativeNote: string;
  active: boolean;
}) {
  return (
    <div>
      {/*
        An h3 under the section's h2, sized as a label: it names the column,
        it is not a headline.
      */}
      <h3 className="text-sm font-semibold text-primary">{label}</h3>

      {/*
        Each row is a two-column grid with a fixed name column, so every bar
        starts on the same line whatever the name's length: "JavaScript" and
        "C#" line their bars up, the way the CV's table does.
      */}
      <ul className="mt-5 space-y-3.5">
        {skills.map((skill, index) => (
          // Keyed by name: unique within a column, and stable if the
          // order ever changes.
          <li
            key={skill.name}
            className="grid grid-cols-[7.5rem_1fr] items-center gap-4"
          >
            <span className="text-[0.9375rem] text-primary">
              {skill.name}
              {/*
                The blue is the deep end of the bar's gradient, #83a0ef, so
                the mark reads as part of the meter beside it rather than as
                punctuation in the name.
              */}
              {skill.native ? (
                <span className="text-[#83a0ef]" aria-hidden="true">
                  *
                </span>
              ) : null}
            </span>

            {/*
              role="meter" gives the bar a value a screen reader can announce;
              a div with a width has none. The asterisk above is hidden from
              assistive tech because the meter's own label says it in words,
              in the page's language: "Dutch, mother tongue" here, "Nederlands,
              moedertaal" on the Dutch page.
            */}
            <div
              role="meter"
              aria-label={
                skill.native ? `${skill.name}, ${nativeNote}` : skill.name
              }
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skill.level}
              className="h-2 overflow-hidden rounded-full bg-fill-tertiary"
            >
              {/*
                The fill grows from the left by animating scaleX against a
                left origin: a transform, so nothing reflows while it runs.
                Same gradient as the dashboard's bars, turned on its side,
                deeper at the root and paler at the tip.
              */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#83a0ef] to-[#e1e5ff] transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                style={{
                  width: `${skill.level}%`,
                  transformOrigin: "left",
                  transform: active ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: `${index * 70}ms`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
