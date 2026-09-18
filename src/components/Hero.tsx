import type { Content } from '../content/types'
import { Reveal } from './Reveal'

export function Hero({ content }: { content: Content }) {
  return (
    <section
      id="statement"
      className="flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink-dim">
          {content.hero.eyebrow}
        </p>
      </Reveal>

      <Reveal delay={120}>
        <h2 className="scrub-rise mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
          {content.hero.headline}
        </h2>
      </Reveal>

      <Reveal delay={240}>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-dim sm:text-xl">
          {content.hero.body}
        </p>
      </Reveal>

      <Reveal delay={360}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {/* Was #work, which no longer exists. DGT Studio Pro is the work now. */}
          <a
            href="#dgt"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-transform hover:scale-[1.03]"
          >
            {content.hero.primaryCta}
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-white/40"
          >
            {content.hero.secondaryCta}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
