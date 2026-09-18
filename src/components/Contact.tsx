import memojiHeart from "../assets/memoji-heart.webp";
import type { ContactLink } from "../content/types";
import { Reveal } from "./Reveal";

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
    <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,42rem)_auto]">
      <div className="max-w-2xl">
        <p className="text-lg leading-relaxed text-ink-dim">{intro}</p>

        {/* A description list, because each row really is a term and its value. */}
        <dl className="mt-10 space-y-4">
          {links.map((link) => (
            <div
              key={link.label}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-hairline pt-4"
            >
              <dt className="w-28 shrink-0 text-sm text-ink-dim">
                {link.label}
              </dt>
              <dd className="text-lg text-ink">
                {link.href ? (
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="underline decoration-ink-dim/40 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {link.value}
                  </a>
                ) : (
                  link.value
                )}
              </dd>
            </div>
          ))}
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
