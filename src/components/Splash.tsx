import memoji from '../assets/memoji.png'

export function Splash() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(94,158,255,0.13),rgba(94,158,255,0.04)_45%,transparent_70%)]"
      />

      <img
        src={memoji}
        alt="Memoji of Bera Senol waving"
        width={436}
        height={449}
        className="animate-rise relative w-40 drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)] sm:w-52"
      />

      <h1 className="animate-rise relative mt-8 text-5xl font-semibold tracking-[-0.03em] text-ink sm:text-7xl [animation-delay:140ms]">
        Bera Senol
      </h1>

      <p className="animate-rise relative mt-5 text-lg text-ink-dim sm:text-xl [animation-delay:280ms]">
        Software engineer &middot; Belgium
      </p>

      <a
        href="#statement"
        aria-label="Scroll to content"
        className="animate-rise absolute bottom-10 flex flex-col items-center gap-2 text-ink-dim transition-colors hover:text-ink [animation-delay:600ms]"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.2em]">Scroll</span>
        <svg
          className="animate-nudge h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
