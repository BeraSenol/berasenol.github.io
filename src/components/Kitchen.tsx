import exterior from '../assets/entrepot-exterior.jpg'
import truffles from '../assets/entrepot-truffles.jpg'
import memojiThinking from '../assets/memoji-thinking.png'
import type { Content } from '../content/types'
import { Container } from './Container'
import { GaultMillauScore } from './GaultMillauScore'
import { Reveal } from './Reveal'

export function Kitchen({ content }: { content: Content }) {
  const k = content.kitchen

  return (
    // overflow-hidden clips the sideways travel: an off-screen transform still
    // counts toward document scroll width and would add a horizontal scrollbar.
    <section id="kitchen" className="overflow-hidden border-t border-hairline py-28 sm:py-40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
          {/* Left column, the slide's title block */}
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
                {k.eyebrow}
              </p>
              <h2 className="scrub-rise trim-cap gradient-text gradient-sweep mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                {k.title}
              </h2>
              <p className="mt-3 text-lg italic text-ink-dim">{k.tagline}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 border-t border-hairline pt-8 text-ink">
                <GaultMillauScore label={k.scoreLabel} />
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-dim">
                {k.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right column, the exterior shot */}
          <Reveal delay={160} from="right" distance="far" className="lg:mt-8">
            <img
              src={exterior}
              alt={k.exteriorAlt}
              width={1000}
              height={1333}
              loading="lazy"
              className="w-full object-cover grayscale"
            />
            <p className="mt-3 text-right text-xs text-ink-dim">{k.exteriorCaption}</p>
          </Reveal>
        </div>

        {/* Caption lives outside the row so both images share one bottom edge. */}
        <div className="mt-12 lg:mt-20">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end">
            <Reveal delay={120} from="left" distance="far" className="w-full sm:w-[58%]">
              <img
                src={truffles}
                alt={k.trufflesAlt}
                width={1400}
                height={699}
                loading="lazy"
                className="block w-full object-cover grayscale"
              />
            </Reveal>

            <Reveal delay={260} from="right" className="shrink-0 sm:ml-auto">
              <img
                src={memojiThinking}
                alt={k.memojiAlt}
                width={402}
                height={455}
                loading="lazy"
                className="block w-32 sm:w-40 lg:w-48"
              />
            </Reveal>
          </div>

          <p className="mt-3 text-xs text-ink-dim sm:w-[58%]">{k.trufflesCaption}</p>
        </div>
      </Container>
    </section>
  )
}
