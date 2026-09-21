import macbook from "../assets/macbook-dgt.webp";
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
  {
    label: "macOS",
    href: "https://www.apple.com/os/macos/",
    node: <MacOsMark className="h-10 w-auto" />,
  },
  {
    label: "Swift",
    href: "https://developer.apple.com/swift/",
    node: <SwiftMark className="h-10 w-auto rounded-[22%]" />,
  },
  {
    label: "SwiftUI",
    href: "https://developer.apple.com/swiftui/",
    node: <SwiftUiMark className="h-10 w-auto" />,
  },
  {
    label: "SwiftData",
    href: "https://developer.apple.com/documentation/swiftdata",
    node: <SwiftDataMark className="h-10 w-auto" />,
  },
  {
    label: "Swift Testing",
    href: "https://developer.apple.com/xcode/swift-testing/",
    node: <SwiftTestingMark className="h-10 w-auto" />,
  },
  {
    label: "Xcode",
    href: "https://developer.apple.com/xcode/",
    node: <XcodeMark className="h-10 w-auto" />,
  },
  {
    label: "Stockfish",
    href: "https://stockfishchess.org",
    node: <StockfishMark className="h-11 w-auto" />,
  },
  {
    label: "Digital Game Technology",
    href: "https://www.digitalgametechnology.com",
    node: <DgtMark className="h-7 w-auto" />,
  },
];

export function DgtStudio({ content }: { content: Content }) {
  const { dgt } = content;

  return (
    <section
      id="dgt"
      className="overflow-hidden border-t border-separator py-20 sm:py-28 lg:py-40"
    >
      <Container>
        {/*
          Three rows at desktop width. The text spans the first two; the board
          sits in row one, and the Mac gets row three to itself across both
          columns. That is what lets the Mac be wider than the board's column
          without a negative margin: it is on its own row, so it can grow under
          the text and never collide with it, whatever length the paragraphs
          are. Row two is a spacer that absorbs whatever height the text has
          beyond the board.
        */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_1fr_auto] lg:gap-x-16">
          {/*
            lg:pb-12 keeps the Mac off the GitHub button. The Mac now sits
            under the text, so where the text is taller than the board (around
            1024) the lid would otherwise start on the button's bottom edge.
            The padding goes into the spacer row.
          */}
          <div className="lg:row-span-2 lg:pb-12">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                {dgt.eyebrow}
              </p>
              <h2 className="scrub-rise trim-cap gradient-text gradient-max mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                {dgt.title}
              </h2>
              <p className="mt-3 text-lg italic text-secondary">{dgt.tagline}</p>
            </Reveal>

            <Reveal delay={120}>
              {/*
                One array, so a mark's name is written once and serves as the
                tooltip, the link's accessible name, and the key. title on the
                link rather than the mark, so the tooltip appears wherever the
                pointer lands in the link box, not only over the artwork's pixels.
              */}
              <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-separator pt-8 text-primary">
                {MARKS.map(({ label, href, node }) => (
                  <li key={label}>
                    {/*
                      aria-label names the link, which matters because its
                      content is only artwork. It overrides any label the mark
                      carries itself, so a screen reader hears "Xcode, link"
                      once rather than the name twice.
                    */}
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      title={label}
                      aria-label={label}
                      className="block transition-opacity hover:opacity-75"
                    >
                      {node}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 space-y-6 text-[1.0625rem] leading-relaxed text-secondary sm:text-lg">
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
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-separator px-5 py-3 text-sm font-medium text-primary transition-colors hover:border-tertiary"
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
            className="@container mt-12 lg:mt-8"
          >
            <Chessboard label={dgt.boardLabel} />
            <p className="mt-3 text-right text-xs text-secondary">
              {dgt.boardCaption}
            </p>
          </Reveal>

          <div aria-hidden="true" className="h-16 lg:col-start-2 lg:h-auto lg:min-h-16" />

          {/*
            Row three is its own two-column grid: the Mac on the left at 56% of
            the row, about 1.2 times the board's column, and the feature list
            in what is left. A nested grid rather than more columns on the
            outer one, because these two columns have nothing to do with the
            text/board split above: the Mac is meant to be wider than the board.
            On a phone it is one column, the Mac and then the list under it.

            From lg up the title's cap top sits on the same line as the top of
            the lid. The title's box already starts at its cap top (.trim-cap),
            and the lid is not at the top of the image: the first lit row is 7
            of the photo's 853, with black above it. So the list is aligned to
            the start of the row and pushed down by exactly that much. 7 rows of
            853 is 7/1400 of the image's width, the image is 56% of this grid,
            and the grid is a size container, so 56cqw * 7 / 1400 is that
            distance at every width with no measuring and no font involved.
          */}
          <div className="@container grid items-start gap-12 lg:col-span-2 lg:grid-cols-[56%_1fr] lg:gap-16">
            <Reveal delay={160} from="left" distance="far">
              {/*
                The screen carries the app itself now, composited into the glass
                from a real screenshot, so this is no longer decorative and gets a
                described alt. The notch comes from the supplied mask: the glass
                is masked to that shape, so the screenshot stops at the notch and
                the lid's own black shows through it.

                The screenshot's own top strip was black, because macOS blacks out
                the menu bar for a full-screen app on a notched display. Accurate,
                and it hid the notch: a black tab on a black strip is nothing, and
                it read as a second bezel above the real one. That strip now
                carries the first row of the app's chrome smeared upward, so the
                notch has something to be seen against.
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

            <Reveal delay={260} from="right" className="lg:mt-[calc(56cqw*7/1400)]">
              {/*
                An h3, because it sits under the section's h2. Same max
                gradient as the section title so the two read as one family,
                but sentence case and a size down, so it reads as a subhead
                rather than a second headline. The default vertical ramp, not
                the sweep, because at phone width this can wrap.

                lg:-mt-[0.06em] cancels .gradient-text's own 0.06em top
                padding, which is there so round letters get background above
                the cap line but also pushes the cap line down by 2px at this
                size. In em, so it is the h3's own font size and cancels
                exactly; the offset that lines the cap up with the lid is on
                the wrapper.
              */}
              <h3 className="trim-cap gradient-text gradient-max mb-8 text-3xl lg:-mt-[0.06em] font-bold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
                {dgt.featuresTitle}
              </h3>
              {/*
                A description list, because each row is a term and what it means,
                the same reasoning as Contact. The key is the title: titles are
                unique within the list, and the index would tie each row's
                identity to its position, so reordering the content would make
                React reuse the wrong row.
              */}
              <dl className="space-y-6">
                {dgt.features.map((feature) => (
                  <div key={feature.title}>
                    <dt className="text-base font-semibold text-primary">
                      {feature.title}
                    </dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-secondary">
                      {feature.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
