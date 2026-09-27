import type { ReactNode } from 'react'
import { Container } from './Container'
import { Reveal } from './Reveal'

/*
 * The section vocabulary, in one file: the frame every section sits in, the
 * eyebrow over every title, and the two kinds of title the page uses. Kitchen,
 * Dignify and DGT Studio Pro lay out their own grids, so they take the pieces
 * rather than the whole Section, but they are the same pieces. Before this
 * file held them, the frame's classes were typed out four times and the
 * eyebrow's five, and a change to one copy was a change to remember four more.
 */

/**
 * The frame: a hairline on top, the page's vertical rhythm, and the gutter.
 *
 * overflow-hidden is load-bearing. A Reveal that travels sideways starts
 * outside its own box, and an element sitting past the right edge still counts
 * toward the document's scroll width. That adds a horizontal scrollbar nobody
 * sees on a wide monitor. Contact's memoji comes in from the right and starts
 * 6rem past the container edge, which is 32px past the viewport at 1440:
 * measured scrollWidth 1472 against clientWidth 1440 before the clipping
 * existed. It lives on the frame, so every section gets it whether or not it
 * has a sideways Reveal today.
 */
export function SectionFrame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="overflow-hidden border-t border-separator py-20 sm:py-28 lg:py-40"
    >
      <Container>{children}</Container>
    </section>
  )
}

/**
 * The small spaced capitals over a title: a date range, or what the section is.
 * `eyebrow` is a hook for the print stylesheet, which sets body text in points
 * and needs to keep this line smaller than the rest.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
      {children}
    </p>
  )
}

/**
 * Which of the page's gradients a feature title is set in, as the complete
 * class list the title needs. M5 is .gradient-text's own default ramp, so it
 * adds no variant class.
 */
const FEATURE_GRADIENT = {
  m5: 'gradient-text',
  pro: 'gradient-text gradient-pro',
  max: 'gradient-text gradient-max',
} as const

export type FeatureGradient = keyof typeof FEATURE_GRADIENT

type FeatureHeaderProps = {
  eyebrow: string
  title: string
  tagline: string
  gradient: FeatureGradient
  /**
   * The tagline's language, when it is not the page's. Kitchen's is the
   * restaurant's own English line on both pages, and a screen reader on the
   * Dutch page should read it with English pronunciation.
   */
  taglineLang?: string
}

/**
 * The heading block of the job and project sections: eyebrow, a gradient title
 * in capitals that rises with the scroll (.scrub-rise), and an italic tagline.
 * A fragment, so the caller decides what wraps it; all three sections put it
 * in one Reveal.
 *
 * The title is uppercased by CSS, not in the copy: the case is styling, and a
 * screen reader reads the words as words rather than letters.
 */
export function FeatureHeader({ eyebrow, title, tagline, gradient, taglineLang }: FeatureHeaderProps) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={`scrub-rise trim-cap ${FEATURE_GRADIENT[gradient]} mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl`}
      >
        {title}
      </h2>
      <p lang={taglineLang} className="mt-3 text-lg italic text-secondary">
        {tagline}
      </p>
    </>
  )
}

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  /** Set the title in capitals, as the feature sections' headlines are. */
  uppercase?: boolean
  children: ReactNode
}

/** A section whose body is a single block under a plain white title. */
export function Section({
  id,
  eyebrow,
  title,
  uppercase = false,
  children,
}: SectionProps) {
  return (
    <SectionFrame id={id}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        {/*
          Two complete class strings rather than a fragment spliced in:
          Tailwind finds classes by scanning the source, so a class built
          at runtime would never make it into the stylesheet.
        */}
        <h2
          className={
            uppercase
              ? "mt-4 text-4xl font-semibold uppercase tracking-[-0.02em] text-primary sm:text-5xl"
              : "mt-4 text-4xl font-semibold tracking-[-0.02em] text-primary sm:text-5xl"
          }
        >
          {title}
        </h2>
      </Reveal>

      {/*
        Container sets the page measure. The reading measure belongs to whatever
        is inside, because a section of prose and a section of lists want
        different widths, so children are not wrapped in one here.
      */}
      <div className="mt-6">{children}</div>
    </SectionFrame>
  )
}
