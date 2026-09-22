import { Fragment } from "react";
import type { Content } from "../content/types";
import { SOURCE_HREF, STACK } from "../content/stack";
import { Container } from "./Container";

/*
 * One class string for every link in the footer, so the credits and "View
 * source" read as the same kind of thing.
 *
 * The links are the same grey as the words around them, which is what keeps
 * the line quiet; white names were the loud part of the first version. What
 * marks them as links instead is a faint underline, tertiary grey, always
 * there. Colour alone is not allowed to be the only difference between a
 * link and its sentence, and with no colour difference at all the underline
 * is the whole signal. On hover and focus the word and its line go white.
 */
const LINK =
  "underline decoration-tertiary underline-offset-2 transition-colors hover:text-primary hover:decoration-current focus-visible:text-primary focus-visible:decoration-current";

/**
 * Fine print, kept to one row from sm up: the credits on the left, the
 * copyright and the way to the source on the right. On a phone the credits
 * wrap, so the two halves stack instead.
 *
 * 11px in the secondary grey. Secondary is the faintest token that still
 * clears 4.5:1 on black, the contrast small text needs; tertiary would look
 * subtler still but lands near 2.3:1, which is quiet enough to be unreadable.
 * The subtlety comes from size, spacing and losing the white links instead.
 */
export function Footer({ content }: { content: Content }) {
  const { footer } = content;

  return (
    <footer className="border-t border-separator py-6">
      <Container className="flex flex-col gap-2 text-[0.6875rem] leading-4 text-secondary sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        {/*
          The credits come from the content file as a list of runs: plain text,
          or the name of a tool, which becomes a link. A sentence with links in
          it cannot be one translated string, and splitting it into "Made
          with" / "and" / "hosted on" fragments would bake English word order
          into the component. As runs, each language writes its own sentence
          in its own order, and the Dutch one does put the two GitHub names
          the other way round.

          Keyed by index, which is usually the wrong key but is the right one
          here: the list is fixed content that never reorders, and runs like
          ", " repeat, so there is no other identity to use.
        */}
        <p>
          {footer.credits.map((run, index) =>
            typeof run === "string" ? (
              <Fragment key={index}>{run}</Fragment>
            ) : (
              <a
                key={index}
                href={STACK[run.tool].href}
                target="_blank"
                rel="noreferrer"
                className={LINK}
              >
                {STACK[run.tool].name}
              </a>
            ),
          )}
        </p>

        <div className="flex shrink-0 gap-4">
          {/*
            The year is read when the page renders in the visitor's browser,
            not when it was built, so the footer does not go stale between
            deploys.
          */}
          <p>
            &copy; {new Date().getFullYear()} {footer.owner}
          </p>
          <a
            href={SOURCE_HREF}
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            {footer.sourceLabel}
          </a>
        </div>
      </Container>
    </footer>
  );
}
