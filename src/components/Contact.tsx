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
     * The measure stays on the text column rather than moving to the grid: the
     * memoji should be able to sit wherever the column ends up, but a line of
     * prose still has a width past which it stops being readable.
     */
    /*
     * From lg up the memoji's bottom pixel sits on the baseline of the last
     * row, "Hasselt, Belgium". Two pieces make that exact without measuring:
     *
     * - Every row's value is trimmed to cap line and baseline (.trim-text),
     *   so the last row, and with it the text column, ends exactly on the
     *   baseline, for any font.
     * - The memoji is taken out of the grid's flow and pinned to the grid's
     *   bottom edge, which is now that baseline. Its image has figure right
     *   down to its last row of pixels, so box bottom and ink bottom agree.
     *
     * Pinned rather than bottom-aligned in the grid, because the memoji is
     * taller than the text. As a grid item it would set the row's height, and
     * either the text would sink away from the heading (the 108px gap this
     * section used to have) or the memoji's feet would float above the line.
     * Out of the flow it simply rises beside the heading from the baseline,
     * and the text keeps its place.
     *
     * The comma in "Hasselt, Belgium" dips a hair below the baseline, as
     * commas do; the letters are what the feet stand on.
     */
    <div className="grid gap-12 lg:relative lg:grid-cols-[minmax(0,42rem)_auto]">
      <div className="max-w-2xl self-start">
        <p className="text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
          {intro}
        </p>

        {/* A description list, because each row really is a term and its value. */}
        {/*
          The rows' spacing is pt-6 and space-y-6 now that each value is
          trimmed to its capitals: the line box used to add about 8px of
          half-leading above the caps and some below the baseline, and the
          larger padding puts that space back, so the rhythm is unchanged.
        */}
        <dl className="mt-10 space-y-6">
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
      </div>

      <Reveal
        from="right"
        delay={120}
        className="justify-self-start lg:absolute lg:right-0 lg:bottom-0"
      >
        <img
          src={memojiHeart}
          alt={memojiAlt}
          width={309}
          height={420}
          loading="lazy"
          className="w-40 sm:w-48 lg:w-56"
        />
      </Reveal>
    </div>
  );
}
