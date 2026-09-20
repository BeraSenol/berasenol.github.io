/**
 * The interface glyphs, as opposed to the brand marks in TechMarks.
 *
 * Each viewBox is the artwork's own ink box, measured with getBBox rather than
 * taken from the export. An svg sized by height renders smaller than its
 * neighbours by exactly however much empty space its viewBox carries, and the
 * exports these came from all padded differently.
 *
 * They fill with currentColor, so the surrounding text colour carries them and
 * a hover that changes the text changes the glyph with it. None of them declare
 * a size: the caller does, through className.
 */

import { MAIL_GLYPH } from "./glyph-data";

type GlyphProps = { className?: string; label?: string };

/**
 * A glyph is decorative by default and gets aria-hidden, because it usually
 * sits beside a word that already says what it is. Pass a label where the glyph
 * has replaced that word, and it becomes an image with a name instead.
 */
const role = (label?: string) =>
  label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true };

export function MailMark({ className = "", label }: GlyphProps) {
  return (
    <svg
      viewBox={`0 0.0098 ${MAIL_GLYPH.width} ${MAIL_GLYPH.height}`}
      className={className}
      fill="currentColor"
      {...role(label)}
    >
      <path d={MAIL_GLYPH.d} />
    </svg>
  );
}

export function GitHubMark({ className = "", label }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      {...role(label)}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function LocationMark({ className = "", label }: GlyphProps) {
  return (
    <svg
      viewBox="0 0.0475 23.8383 23.7206"
      className={className}
      fill="currentColor"
      {...role(label)}
    >
      <path d="M0.938787 9.82841C-0.58465 10.5315-0.154963 12.5628 1.51496 12.5726L11.0657 12.6116C11.2025 12.6116 11.2415 12.6604 11.2415 12.7972L11.2708 22.2796C11.2806 24.0179 13.3607 24.3108 14.0931 22.7483L23.6146 2.33818C24.3763 0.678023 23.0775-0.474321 21.4564 0.287398ZM2.75519 10.9124C2.68683 10.9124 2.67707 10.8343 2.73566 10.8147L21.6517 2.09404C21.7591 2.04521 21.8275 2.09404 21.7689 2.21123L13.0091 21.0979C12.9798 21.1565 12.9212 21.1468 12.9212 21.0882L12.9603 11.7132C12.9603 11.2151 12.6282 10.8636 12.0911 10.8636Z" />
    </svg>
  );
}

/**
 * The disclosure chevron on the language button.
 *
 * Stroked rather than filled, unlike the marks above: those are traced artwork
 * with a real outline, this is two straight lines, and a stroke keeps its
 * weight even when the caller sizes it at 6px tall. Non-scaling stroke is not
 * wanted here — it should thicken with the glyph if it is ever used larger.
 */
export function ChevronMark({ className = "", label }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 10 6"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...role(label)}
    >
      <path d="M1 1 5 5 9 1" />
    </svg>
  );
}
