import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section
      id="statement"
      className="flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink-dim">
          What I do
        </p>
      </Reveal>

      <Reveal delay={120}>
        <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
          I build software for Apple platforms.
        </h2>
      </Reveal>

      <Reveal delay={240}>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-dim sm:text-xl">
          macOS apps in Swift and SwiftUI, chess engines that have to be exactly right, and the
          occasional thing for the web.
        </p>
      </Reveal>

      <Reveal delay={360}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#work"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-transform hover:scale-[1.03]"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-white/40"
          >
            Get in touch
          </a>
        </div>
      </Reveal>
    </section>
  )
}
