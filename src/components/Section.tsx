import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-hairline px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-dim">{children}</div>
        </Reveal>
      </div>
    </section>
  )
}
