import memoji from '../assets/memoji-wave.png'
import type { Content } from '../content/types'
import { NuggetOrbit } from './NuggetOrbit'
import { SplashActions } from './SplashActions'

export function Splash({ content }: { content: Content }) {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(94,158,255,0.13),rgba(94,158,255,0.04)_45%,transparent_70%)]"
      />

      <NuggetOrbit nuggets={content.nuggets} />

      <img
        src={memoji}
        alt={content.memojiAlt}
        width={385}
        height={409}
        className="animate-rise relative w-40 drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)] sm:w-52"
      />

      <h1 className="animate-rise gradient-text gradient-pro gradient-sweep relative mt-8 text-5xl font-semibold tracking-[-0.03em] sm:text-7xl [animation-delay:140ms]">
        Bera Senol
      </h1>

      <p className="animate-rise relative mt-1 text-lg text-ink-dim sm:text-xl [animation-delay:280ms]">
        {content.splash.role}
      </p>

      <SplashActions content={content} />
    </section>
  )
}
