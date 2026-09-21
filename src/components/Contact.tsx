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
     * items-end is for the memoji, so its feet sit on the last row's line. The
     * text column opts out with self-start: bottom-aligned, it was pushed down
     * by however much taller the memoji is than the text, which at desktop
     * widths opened a 108px gap under the heading instead of the intended one.
     */
    <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,42rem)_auto]">
      <div className="max-w-2xl self-start">
        <p className="text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
          {intro}
        </p>

        {/* A description list, because each row really is a term and its value. */}
        <dl className="mt-10 space-y-4">
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
                className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-separator pt-4"
              >
                {/*
                  A fixed column, because the three glyphs are different widths
                  and the values have to start on the same line whichever row
                  you are looking at. The label is still the row's name, it just
                  reaches a screen reader now instead of the page.
                */}
                <dt className="w-8 shrink-0 text-secondary">
                  <Mark className="h-[1.125rem] w-auto" label={link.label} />
                </dt>
                <dd className="text-lg text-primary">
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
        className="justify-self-start lg:justify-self-end"
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
