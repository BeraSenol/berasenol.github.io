import type { ReactNode } from 'react'
import { Container } from './Container'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  /** Set the title in capitals, as the feature sections' headlines are. */
  uppercase?: boolean
  children: ReactNode
}

export function Section({
  id,
  eyebrow,
  title,
  uppercase = false,
  children,
}: SectionProps) {
  return (
    /*
      overflow-hidden for the same reason Kitchen, Dignify and DgtStudio carry
      it: a Reveal that travels sideways starts outside its own box, and an
      element sitting past the right edge still counts toward the document's
      scroll width. That adds a horizontal scrollbar nobody sees on a wide
      monitor. Contact's memoji comes in from the right and starts 6rem past the
      container edge, which is 32px past the viewport at 1440 — measured
      scrollWidth 1472 against clientWidth 1440 before this line existed.

      It belongs here rather than on the one section, because every section this
      component renders is free to put a sideways Reveal in its children.
    */
    <section
      id={id}
      className="overflow-hidden border-t border-separator py-20 sm:py-28 lg:py-40"
    >
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            {eyebrow}
          </p>
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
      </Container>
    </section>
  )
}
