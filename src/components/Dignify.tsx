import type { Content } from "../content/types";
import { AdobeLogo, SelligentLogo } from "./BrandMarks";
import { Container } from "./Container";
import { CampaignFlow } from "./CampaignFlow";
import { DashboardWindow } from "./DashboardWindow";
import { Reveal } from "./Reveal";

export function Dignify({ content }: { content: Content }) {
  const { dignify } = content;

  return (
    // overflow-hidden for the same reason as Kitchen: the right column travels in
    // from outside its own footprint, and an off-screen transform still counts
    // toward document scroll width.
    <section
      id="dignify"
      className="overflow-hidden border-t border-separator py-20 sm:py-28 lg:py-40"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                {dignify.eyebrow}
              </p>
              <h2 className="scrub-rise trim-cap gradient-text gradient-pro mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                {dignify.title}
              </h2>
              <p className="mt-3 text-lg italic text-secondary">
                {dignify.tagline}
              </p>
            </Reveal>

            <Reveal delay={120}>
              {/*
                The Selligent lockup defines the band's height and the Adobe mark
                is set to it: 33px, or 37px from sm up, which are the lockup's own
                measured heights at its two text sizes. Changing its text size
                moves the number the mark has to match.
              */}
              <ul className="mt-8 flex flex-wrap items-center gap-8 border-t border-separator pt-8">
                <li>
                  <SelligentLogo />
                </li>
                <li>
                  <AdobeLogo />
                </li>
              </ul>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 space-y-6 text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
                {dignify.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={160} from="right" distance="far" className="lg:mt-8">
            <CampaignFlow />
            <div className="mt-6">
              <DashboardWindow />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
