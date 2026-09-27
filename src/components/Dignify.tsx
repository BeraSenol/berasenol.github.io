import type { Content } from "../content/types";
import { AdobeLogo, SelligentLogo } from "./BrandMarks";
import { CampaignFlow } from "./CampaignFlow";
import { DashboardWindow } from "./DashboardWindow";
import { Reveal } from "./Reveal";
import { FeatureHeader, SectionFrame } from "./Section";

/** The two campaign platforms, each linked to its product page. */
const BRAND_LINKS = [
  { href: "https://www.zetaglobal.com/selligent/", Logo: SelligentLogo },
  { href: "https://business.adobe.com/products/campaign.html", Logo: AdobeLogo },
];

export function Dignify({ content }: { content: Content }) {
  const { dignify } = content;

  return (
    // SectionFrame clips for the same reason as Kitchen: the right column
    // travels in from outside its own footprint, and an off-screen transform
    // still counts toward document scroll width.
    <SectionFrame id="dignify">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
        <div>
          <Reveal>
            <FeatureHeader
              eyebrow={dignify.eyebrow}
              title={dignify.title}
              tagline={dignify.tagline}
              gradient="pro"
            />
          </Reveal>

          <Reveal delay={120}>
            {/*
              The Selligent lockup defines the band's height and the Adobe mark
              is set to it: 33px, or 37px from sm up, which are the lockup's own
              measured heights at its two text sizes. Changing its text size
              moves the number the mark has to match.
            */}
            {/*
              Each lockup links to its product page. The link's accessible
              name comes from what is inside it: Selligent's lockup is real
              text, and the Adobe wordmark is an svg labelled "Adobe
              Campaign", so neither needs an aria-label of its own. New tab,
              because it is someone else's site and this page is a CV the
              reader should not lose. noreferrer also implies noopener, so
              the new tab gets no handle back to this one.
            */}
            <ul className="mt-8 flex flex-wrap items-center gap-8 border-t border-separator pt-8 print:hidden">
              {BRAND_LINKS.map(({ href, Logo }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <Logo />
                  </a>
                </li>
              ))}
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

        <Reveal delay={160} from="right" distance="far" className="lg:mt-8 print:hidden">
          <CampaignFlow locale={content.lang} profilesLabel={dignify.mock.profiles} />
          <div className="mt-6">
            <DashboardWindow locale={content.lang} labels={dignify.mock} />
          </div>
          {/*
            The rates in the dashboard are invented. On a CV an unlabelled
            54.2% open rate reads as a result someone achieved, so the caption
            says plainly what the two windows are. Right-aligned under them,
            the way Kitchen captions its photographs.
          */}
          <p className="mt-3 text-right text-xs text-secondary">{dignify.mockCaption}</p>
        </Reveal>
      </div>
    </SectionFrame>
  );
}
