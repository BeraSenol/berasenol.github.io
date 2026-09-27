import { EMAIL, GITHUB_URL } from "../content/profile";
import type { Content } from "../content/types";
import { Container } from "./Container";
import { GitHubMark } from "./Glyphs";

/**
 * Apple's floating action bar: a dark translucent capsule holding an informational
 * label and, where there's something to do, a solid blue pill inside it.
 *
 * Both are a single <a>, not a link wrapping a link; nested anchors are invalid
 * HTML and browsers silently unnest them. The blue part is a <span> styled as a
 * button; the whole capsule is the hit target.
 */
/*
 * Liquid glass, the same as every pill on the page. No backdrop-blur utility
 * any more: that would write its own backdrop-filter and replace the lens.
 */
const CAPSULE =
  "liquid-glass liquid-glass-pill group relative inline-flex h-12 items-center gap-3 rounded-full transition-colors hover:bg-surface-elevated/60";

export function SplashActions({ content }: { content: Content }) {
  return (
    // splash-actions is the hook for index.css: on a screen too short to hold
    // the splash (a phone on its side), the pills leave the bottom edge and
    // follow the role in the normal flow instead of landing on the name.
    <div className="splash-actions absolute inset-x-0 bottom-16 z-10">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`${CAPSULE} px-4 text-sm text-primary sm:px-5`}
          >
            <GitHubMark className="h-[18px] w-[18px] shrink-0" />
            <span className="hidden font-medium sm:inline">GitHub</span>
            <span className="sr-only sm:hidden">
              {content.splash.githubLabel}
            </span>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className={`${CAPSULE} px-1.5 text-sm sm:pl-5`}
          >
            <span className="hidden font-medium text-primary sm:inline">
              {EMAIL}
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-action px-5 font-medium text-primary transition-colors group-hover:bg-action-hover">
              {content.splash.contactCta}
            </span>
          </a>
        </div>
      </Container>
    </div>
  );
}
