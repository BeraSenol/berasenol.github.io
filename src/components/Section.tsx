import type { ReactNode } from 'react'
import { Container } from './Container'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
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
      className="overflow-hidden border-t border-hairline py-28 sm:py-40"
    >
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
            {title}
          </h2>
        </Reveal>

        {/*
          Container sets the page measure. The reading measure belongs to whatever
          is inside, because a section of prose and a section of lists want
          different widths, so children are not wrapped in one here.
        */}
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  )
}
