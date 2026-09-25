import memojiHeart from "../assets/memoji-heart.webp";
import type { ContactIcon, ContactLink } from "../content/types";
import { GitHubMark, LocationMark, MailMark } from "./Glyphs";
import { Reveal } from "./Reveal";

/*
 * A complete lookup rather than a switch, holding the components themselves so
 * each row can render its own with its own accessible label.
 */
const MARK: Record<ContactIcon, typeof MailMark> = {
  email: MailMark,
  github: GitHubMark,
  location: LocationMark,
};

/*
 * Each glyph's width. Not one shared number: at equal widths the envelope,
 * a wide flat shape, read small and the pin, tall and pointed, read large,
 * so these are set by eye to look the same size. Full class strings in a
 * lookup, never built at runtime, so Tailwind can see them.
 */
const MARK_WIDTH: Record<ContactIcon, string> = {
  email: "w-[22px]",
  github: "w-5",
  location: "w-[18px]",
};

export function Contact({
  intro,
  links,
  memojiAlt,
}: {
  intro: string;
  links: readonly ContactLink[];
  memojiAlt: string;
}) {
  return (
    /*
     * The measure stays on the text column: a line of prose still has a width
     * past which it stops being readable, and the memoji now lives inside that
     * column, beside the rows, rather than out at the grid's far edge.
     */
    <div className="max-w-2xl">
      <p className="text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
        {intro}
      </p>

      {/*
        The rows and the memoji share one flex row from sm up, top-aligned, and
        the memoji is exactly as tall as the three rows. So its top meets the
        first row's hairline and its feet stand on the baseline of "Hasselt,
        Belgium", with no absolute positioning.

        The rows' height is fixed by their markup, so it can be written down:
        three pt-6 (4.5rem), two space-y-6 gaps (3rem), three 1px top borders,
        and three values each trimmed to cap line and baseline by .trim-text,
        so each is exactly one cap height tall. calc(7.5rem + 3px + 3cap).
        The cap unit is the cap height of the element's own font, and the img
        carries text-lg so that font is the same size as the values. That
        makes the match hold for any font, SF Pro here or Arial elsewhere,
        with nothing measured in a screenshot. If the row spacing or the value
        size ever changes, this calc has to change with it.

        Below sm the memoji goes under the rows, right-aligned, at the same
        height. Side by side does not fit a phone: the email row alone needs
        about 245px, and beside a 116px memoji plus the gap that leaves the
        rows too narrow at 390, so the address would wrap under its icon.
      */}
      <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start">
        {/* A description list, because each row really is a term and its value. */}
        {/*
            The rows' spacing is pt-6 and space-y-6 now that each value is
            trimmed to its capitals: the line box used to add about 8px of
            half-leading above the caps and some below the baseline, and the
            larger padding puts that space back, so the rhythm is unchanged.
          */}
        <dl className="min-w-0 flex-1 space-y-6">
          {links.map((link) => {
            const Mark = MARK[link.icon];

            return (
              <div
                key={link.label}
                /*
                 * items-center, not items-baseline: an svg has no baseline of
                 * its own, so a baseline-aligned flex box lines its bottom edge
                 * up with the text baseline and the glyph reads low.
                 */
                className="flex flex-wrap items-center gap-x-[34px] gap-y-1 border-t border-separator pt-6"
              >
                {/*
                    A fixed column, because the three glyphs are different widths
                    and the values have to start on the same line whichever row
                    you are looking at. The label is still the row's name, it just
                    reaches a screen reader now instead of the page.
                  */}
                {/*
                    Each glyph is sized by width (MARK_WIDTH), and centred in a
                    column as wide as the widest, 22px, so all three share one
                    vertical centre line down the column. Their viewBoxes are
                    their ink boxes, so the widths are the ink's, not a box's.
                    22px plus the 34px gap puts the values at the same x as
                    before (the old 32px column plus 24px gap). The dt is a flex box so the svg is laid out
                    as a block, not sat on a text baseline with a gap under it.

                    h-0 so the icons never set a row's height: the text alone
                    does, and the icon overflows its zero-height box evenly
                    above and below, centred on the same line. Without it the
                    20px-tall location pin, taller than the trimmed text, made
                    the last row end below the baseline, and the memoji, which
                    stands on the bottom of that row, sank with it.
                  */}
                <dt className="flex h-0 w-[22px] shrink-0 items-center justify-center text-secondary">
                  <Mark
                    className={`h-auto ${MARK_WIDTH[link.icon]}`}
                    label={link.label}
                  />
                </dt>
                <dd className="trim-text text-lg text-primary">
                  {link.href ? (
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="-my-2 inline-block py-2 underline decoration-tertiary underline-offset-4 transition-colors hover:decoration-primary"
                    >
                      {link.value}
                    </a>
                  ) : (
                    link.value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>

        <Reveal from="right" delay={120} className="self-end sm:self-start">
          <img
            src={memojiHeart}
            alt={memojiAlt}
            width={309}
            height={420}
            loading="lazy"
            className="block h-[calc(7.5rem+3px+3cap)] w-auto text-lg"
          />
        </Reveal>
      </div>
    </div>
  );
}
