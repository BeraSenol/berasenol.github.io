import type { Content } from '../content/types'
import { Container } from './Container'

/**
 * Apple's floating action bar: a dark translucent capsule holding an informational
 * label and, where there's something to do, a solid blue pill inside it.
 *
 * Both are a single <a>, not a link wrapping a link; nested anchors are invalid
 * HTML and browsers silently unnest them. The blue part is a <span> styled as a
 * button; the whole capsule is the hit target.
 */
const CAPSULE =
  'group inline-flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl transition-colors hover:bg-white/15'

function GitHubMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

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
            <span className="sr-only sm:hidden">{content.splash.githubLabel}</span>
          </a>

          <a
            href="mailto:berasenol@icloud.com"
            className={`${CAPSULE} px-1.5 text-sm sm:pl-5`}
          >
            <span className="hidden font-medium text-ink sm:inline">berasenol@icloud.com</span>
            <span className="inline-flex h-9 items-center rounded-full bg-[#0071e3] px-5 font-medium text-white transition-colors group-hover:bg-[#0077ed]">
              {content.splash.contactCta}
            </span>
          </a>
        </div>
      </Container>
    </div>
  )
}
