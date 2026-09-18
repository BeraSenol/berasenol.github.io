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
    <section id={id} className="border-t border-hairline py-28 sm:py-40">
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
