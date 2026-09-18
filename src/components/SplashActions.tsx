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
const CAPSULE =
  "group inline-flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl transition-colors hover:bg-white/15";

export function SplashActions({ content }: { content: Content }) {
  return (
    <div className="absolute inset-x-0 bottom-16 z-10">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <a
            href="https://github.com/BeraSenol"
            target="_blank"
            rel="noreferrer"
            className={`${CAPSULE} px-4 text-sm text-ink sm:px-5`}
          >
            <GitHubMark className="h-[18px] w-[18px] shrink-0" />
            <span className="hidden font-medium sm:inline">GitHub</span>
            <span className="sr-only sm:hidden">
              {content.splash.githubLabel}
            </span>
          </a>

          <a
            href="mailto:berasenol@icloud.com"
            className={`${CAPSULE} px-1.5 text-sm sm:pl-5`}
          >
            <span className="hidden font-medium text-ink sm:inline">
              berasenol@icloud.com
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-[#0071e3] px-5 font-medium text-white transition-colors group-hover:bg-[#0077ed]">
              {content.splash.contactCta}
            </span>
          </a>
        </div>
      </Container>
    </div>
  );
}
