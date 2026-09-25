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
    <section id="kitchen" className="overflow-hidden border-t border-separator py-20 sm:py-28 lg:py-40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
          {/* Left column, the slide's title block */}
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                {k.eyebrow}
              </p>
              <h2 className="scrub-rise trim-cap gradient-text mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                {k.title}
              </h2>
              <p className="mt-3 text-lg italic text-secondary">{k.tagline}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 border-t border-separator pt-8 text-primary">
                <GaultMillauScore label={k.scoreLabel} />
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 space-y-6 text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
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
              className="max-h-[70svh] w-full object-cover grayscale lg:max-h-none"
            />
            <p className="mt-3 text-right text-xs text-secondary">{k.exteriorCaption}</p>
          </Reveal>
        </div>

        {/*
          A grid rather than a flex row with the caption outside it. The caption
          used to sit after the whole row so that, side by side, the photo and
          the memoji could share one bottom edge. On a phone the row stacks,
          and that put the memoji between the photo and its own caption.

          Now the DOM order is the reading order: photo, its caption, memoji.
          On a phone that is simply the stacking order. From sm up the grid has
          two columns, and sm:order-last sends the caption after the memoji,
          so auto-placement puts photo and memoji on row one and the caption
          under the photo on row two. The memoji is self-end, so its feet
          still meet the photo's bottom edge. `order` only moves the boxes;
          a screen reader still reads photo, caption, memoji.
        */}
        <div className="mt-12 grid sm:grid-cols-[58%_1fr] sm:gap-x-8 lg:mt-20">
          <Reveal delay={120} from="left" distance="far">
            <img
              src={truffles}
              alt={k.trufflesAlt}
              width={1400}
              height={699}
              loading="lazy"
              className="block w-full object-cover grayscale"
            />
          </Reveal>

          <p className="mt-3 text-xs text-secondary sm:order-last">{k.trufflesCaption}</p>

          <Reveal
            delay={260}
            from="right"
            className="mt-8 justify-self-center sm:mt-0 sm:self-end sm:justify-self-end"
          >
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
      </Container>
    </section>
  )
}
