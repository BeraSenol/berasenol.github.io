import { Chessboard } from "./Chessboard";
import {
  MacOsMark,
  StockfishMark,
  SwiftDataMark,
  SwiftMark,
  SwiftTestingMark,
  SwiftUiMark,
  XcodeMark,
} from "./TechMarks";
import { Container } from "./Container";
import type { Content } from "../content/types";
import { Reveal } from "./Reveal";

/**
 * The stack, as marks. Sized by eye against each other rather than to one height:
 * an app icon is a filled square and the macOS wordmark is a thin outline, so
 * equal boxes read as very different weights.
 */
const MARKS = [
  { label: "macOS", node: <MacOsMark className="h-10 w-auto" /> },
  { label: "Swift", node: <SwiftMark className="h-10 w-auto rounded-[22%]" /> },
  { label: "SwiftUI", node: <SwiftUiMark className="h-10 w-auto" /> },
  { label: "SwiftData", node: <SwiftDataMark className="h-10 w-auto" /> },
  { label: "Swift Testing", node: <SwiftTestingMark className="h-10 w-auto" /> },
  { label: "Xcode", node: <XcodeMark className="h-10 w-auto" /> },
  { label: "Stockfish", node: <StockfishMark className="h-11 w-auto" /> },
];

export function DgtStudio({ content }: { content: Content }) {
  const { dgt } = content;

  return (
    <section
      id="dgt"
      className="overflow-hidden border-t border-hairline py-28 sm:py-40"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
                {dgt.eyebrow}
              </p>
              <h2 className="scrub-rise trim-cap gradient-text gradient-max gradient-sweep mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                {dgt.title}
              </h2>
              <p className="mt-3 text-lg italic text-ink-dim">{dgt.tagline}</p>
            </Reveal>

            <Reveal delay={120}>
              {/*
                One array, so a mark's name is written once and serves as both the
                tooltip and the accessible label. title on the li rather than the
                mark, so the tooltip appears wherever the pointer lands in the
                item, not only over the artwork's own pixels.
              */}
              <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-hairline pt-8 text-ink">
                {MARKS.map(({ label, node }) => (
                  <li key={label} title={label}>
                    {node}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-dim">
                {dgt.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300}>
              <a
                href={dgt.href}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-white/40"
              >
                {dgt.ctaLabel}
                <span aria-hidden="true">&rarr;</span>
              </a>
            </Reveal>
          </div>

          {/* @container so the glyphs can size against the board, not the viewport */}
          <Reveal
            delay={160}
            from="right"
            distance="far"
            className="@container lg:mt-8"
          >
            <Chessboard label={dgt.boardLabel} />
            <p className="mt-3 text-right text-xs text-ink-dim">
              {dgt.boardCaption}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
