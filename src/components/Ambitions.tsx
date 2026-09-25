import type { ComponentType } from "react";
import type { Ambition, AmbitionKind } from "../content/types";
import { LogicProMark } from "./LogicProMark";
import { Reveal } from "./Reveal";
import { UnrealMark } from "./UnrealMark";

type AmbitionsProps = {
  intro: string;
  items: readonly Ambition[];
};

/**
 * Complete class strings per kind, looked up rather than built, for the same
 * reason as Reveal's offsets: Tailwind only ships classes it can find written
 * out in the source. The two gradients are the ones the page already uses,
 * Max for music (as on DGT Studio) and Pro for the game (as on Dignify), so
 * the cards read as part of the same family rather than a new palette.
 *
 * Keyed by `kind`, not by position, so the styling follows the card if the
 * content ever reorders them.
 */
const TITLE_GRADIENT: Record<AmbitionKind, string> = {
  music: "gradient-max",
  game: "gradient-pro",
};

/**
 * The mark beside each card's title, and where it links. Typed by the props
 * the card hands the mark, not as `typeof UnrealMark`, because the two marks
 * are different kinds of component (an inline svg and an <img>) that only
 * agree on taking a className. Partial, so a card without a mark is allowed:
 * it falls back to the plain title. The URLs live here beside the marks
 * rather than in the locale files, the same as Dignify's and DGT Studio's
 * brand links: they are the same on every page.
 */
const TITLE_MARK: Partial<
  Record<
    AmbitionKind,
    { Mark: ComponentType<{ className?: string }>; href: string }
  >
> = {
  music: { Mark: LogicProMark, href: "https://www.apple.com/logic-pro/" },
  game: { Mark: UnrealMark, href: "https://www.unrealengine.com" },
};

/**
 * Two cards, side by side from lg up, stacked on a phone.
 *
 * Rendered inside Section, like Languages, so the eyebrow and the h2 come from
 * there and this is only the body.
 *
 * One Reveal around the whole grid rather than one per card. A Reveal is two
 * nested divs, and the grid would stretch only the outer one, so each card
 * would size to its own copy and the two would end at different heights.
 * With the grid inside the Reveal, the cards are the grid items and stretch to
 * the taller one.
 */
export function Ambitions({ intro, items }: AmbitionsProps) {
  return (
    <Reveal delay={120}>
      <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
        {intro}
      </p>

      <ul className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {items.map((item) => {
          // Capitalised so JSX treats it as a component, not an HTML tag.
          const mark = TITLE_MARK[item.kind];

          return (
            // `kind` is unique by type: there is one music card and one game card.
            <li
              key={item.kind}
              className="flex flex-col rounded-3xl border border-separator bg-surface p-8 sm:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                {item.goal}
              </p>

              {/*
              An h3 under the section's h2. Same treatment as the page's other
              gradient titles, a size down because it sits in a card. The
              default vertical ramp, not the sweep, in case a longer tool name
              wraps on a phone.

              With a mark, the title and the mark sit in a flex row. The row is
              a div, not the h3: the mark is now a link, and a link inside a
              heading adds its name to the heading's, so a screen reader would
              announce the heading as "Logic Pro Logic Pro". Out here the h3 is
              just the name, and the link is its own thing beside it. The row
              carries the font size, so the h3 and the strut below both inherit
              it and the em-based sizes still agree. The mark comes after the name and ml-auto
              pushes it to the card's far edge: an auto margin in a flex row
              takes all the free space on that side. gap-3 is the minimum
              between them when the name is long enough to reach it.

              The mark centres on the capitals of the FIRST line, so it stays
              level with the top line when the name wraps. Plain
              items-center would centre it on the whole two-line block and
              leave it floating between the lines. So the mark sits in a strut:
              a span holding one zero-width space, trimmed to cap line and
              baseline by .trim-text exactly like the name beside it. Same font,
              same size, so the strut is precisely one line's cap height tall,
              and both start at the cap line under items-start. The svg is
              centred inside the strut, which puts it on the middle of the
              first line's capitals for any font, with nothing measured.

              mb-2 puts back the space the trim takes away. The plain title's
              box ends below the descenders; this one ends on the baseline, so
              the body text came up 8px closer, with the mark overhanging into
              the gap. No collapse to worry about: the card is a flex column,
              and margins between flex items add rather than collapse.

              -mt-[0.06em] cancels .gradient-text's top padding, which would
              otherwise push the name's cap line 0.06em below the strut's.

              The mark is 1.1em, the h3's own font size, so it scales with the
              heading at both breakpoints. A round mark reads smaller than
              square capitals at the same height, so it gets a little more than
              the cap height, and overhangs the strut evenly above and below.
            */}
              {mark ? (
                <div className="mt-4 mb-2 flex items-start gap-3 text-3xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-4xl">
                  <h3
                    className={`trim-text gradient-text ${TITLE_GRADIENT[item.kind]} -mt-[0.06em]`}
                  >
                    {item.tool}
                  </h3>
                  <span className="trim-text relative ml-auto w-[1.1em] shrink-0">
                    {/* The strut's one character, hidden: it is spacing, not text. */}
                    <span aria-hidden="true">{"\u200b"}</span>
                    {/*
                      The link is the positioned box and the mark fills it, so
                      the whole mark is the hit target. The mark itself stays
                      decorative; the link's aria-label names it, the same
                      pattern as DGT Studio's stack. New tab with noreferrer,
                      like every other outbound link on the page.
                    */}
                    <a
                      href={mark.href}
                      target="_blank"
                      rel="noreferrer"
                      title={item.tool}
                      aria-label={item.tool}
                      className="absolute top-1/2 left-0 block h-[1.1em] w-[1.1em] -translate-y-1/2 rounded-[22%] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      <mark.Mark className="block h-full w-full" />
                    </a>
                  </span>
                </div>
              ) : (
                <h3
                  className={`trim-cap gradient-text ${TITLE_GRADIENT[item.kind]} mt-4 text-3xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-4xl`}
                >
                  {item.tool}
                </h3>
              )}

              <p className="mt-5 text-[0.9375rem] leading-relaxed text-secondary sm:text-base">
                {item.body}
              </p>

              {/*
              mt-auto on the tag row pins it to the bottom of the card, so when
              one card's copy is longer the two rows of tags still line up.
              pt-8 is the minimum gap above it when the card is not stretched.
            */}
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-fill-tertiary px-3 py-1 text-xs font-medium text-secondary"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
