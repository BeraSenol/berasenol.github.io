import macbook from "../assets/macbook-app.webp";
import { Chessboard } from "./Chessboard";
import {
  DgtMark,
  MacOsMark,
  StockfishMark,
  SwiftDataMark,
  SwiftMark,
  SwiftTestingMark,
  SwiftUiMark,
  XcodeMark,
} from "./TechMarks";
import { Container } from "./Container";
import { GitHubMark } from "./Glyphs";
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
  {
    label: "Swift Testing",
    node: <SwiftTestingMark className="h-10 w-auto" />,
  },
  { label: "Xcode", node: <XcodeMark className="h-10 w-auto" /> },
  { label: "Stockfish", node: <StockfishMark className="h-11 w-auto" /> },
  {
    label: "Digital Game Technology",
    node: <DgtMark className="h-7 w-auto" />,
  },
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
                <GitHubMark className="h-[18px] w-[18px] shrink-0" />
                {dgt.ctaLabel}
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

            {/*
              The run between the two, which is the whole point of the project:
              a board on a table with a cable going to a Mac.

              preserveAspectRatio="none" so the svg fills whatever width the
              column has, with vector-effect="non-scaling-stroke" so the cable
              keeps one thickness while it does. The viewBox is about the
              proportions of the box at a desktop width, so the curve is only
              mildly stretched away from it rather than designed for a square
              and squashed.

              The negative top margin pulls the svg back up to the board's
              bottom edge, past the caption it would otherwise start below. It
              runs down the left because the caption is set right, so the two
              never meet. Both ends of the stroke fade out, so the cable emerges
              from the dark under the board and disappears behind the lid rather
              than stopping at a hard edge.
            */}
            <svg
              viewBox="0 0 560 96"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none -mt-7 block h-24 w-full"
            >
              <defs>
                <linearGradient
                  id="dgt-cable"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="96"
                >
                  <stop offset="0%" stopColor="#4a4a52" stopOpacity="0" />
                  <stop offset="22%" stopColor="#4a4a52" stopOpacity="1" />
                  <stop offset="80%" stopColor="#3c3c44" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3c3c44" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M120 0C120 34 126 52 150 64C176 77 206 82 232 96"
                fill="none"
                stroke="url(#dgt-cable)"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/*
              The screen carries the app itself now, composited into the glass
              from a real screenshot, so this is no longer decorative and gets a
              described alt. The notch comes from the supplied mask: the glass
              is masked to that shape, so the screenshot stops at the notch and
              the lid's own black shows through it.
            */}
            <img
              src={macbook}
              alt={dgt.screenAlt}
              width={1400}
              height={853}
              loading="lazy"
              className="block w-full"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
