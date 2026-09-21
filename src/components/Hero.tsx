import type { CSSProperties } from 'react'
import type { Content } from '../content/types'
import { Reveal } from './Reveal'

/**
 * The turn in the story. The page reads chef, then marketing automation, then
 * this, then the Mac app: "Now" is the word that makes the two jobs above
 * into a road that leads here, and the eyebrow says the same thing quietly.
 *
 * No buttons. "See my work" jumped to the very next section and "Get in
 * touch" repeated Contact and the splash; without them this is a statement,
 * not a second landing page.
 */
export function Hero({ content }: { content: Content }) {
  /*
   * The headline, one span per word, so each word can light up on its own as
   * the line scrolls in (.scrub-words in index.css). Derived from the string
   * on every render rather than stored: it is a pure function of content, so
   * there is nothing to keep in sync.
   */
  const words = content.hero.headline.split(' ')

  return (
    <section
      id="statement"
      className="flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">
          {content.hero.eyebrow}
        </p>
      </Reveal>

      <Reveal delay={120}>
        {/*
          aria-label carries the sentence whole, because a screen reader may
          otherwise read a word-per-span heading with pauses between words.
          The spans are hidden from it for the same reason.
        */}
        <h2
          aria-label={content.hero.headline}
          className="scrub-rise scrub-words mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-primary sm:text-6xl lg:text-7xl"
        >
          {words.map((word, index) => (
            /*
              Keyed by position: the list is rebuilt from the same string
              every time and never reorders, and a word can appear twice, so
              the index is the one stable, unique identity here.

              --i and --n tell the CSS where this word sits in the line, which
              is what staggers its turn to light up. A trailing space after
              every word but the last, inside the span, so the line still
              wraps between words.
            */
            <span
              key={index}
              aria-hidden="true"
              className="word"
              style={{ '--i': index, '--n': words.length } as CSSProperties}
            >
              {index < words.length - 1 ? `${word} ` : word}
            </span>
          ))}
        </h2>
      </Reveal>

      <Reveal delay={240}>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-secondary sm:text-xl">
          {content.hero.body}
        </p>
      </Reveal>
    </section>
  )
}
