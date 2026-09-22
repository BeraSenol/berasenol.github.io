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

/**
 * The replay arrow under the chessboard: a circle open at the top right, with
 * the arrowhead at its end pointing clockwise.
 *
 * The export's viewBox was 22.4219 by 30.0098, padded on the right and below by
 * an invisible rect; this one is the path's own ink box, the same rule as every
 * glyph above. Filled with currentColor rather than the export's white at 85%,
 * so the button's text colour decides it.
 */
export function ReplayMark({ className = "", label }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 22.0605 26.9434"
      className={className}
      fill="currentColor"
      {...role(label)}
    >
      <path d="M11.0254 26.9434C17.1191 26.9434 22.0605 22.002 22.0605 15.8984C22.0605 15.4297 21.6699 15.0391 21.1914 15.0391C20.7227 15.0391 20.332 15.4297 20.332 15.8984C20.332 21.0352 16.1621 25.2051 11.0254 25.2051C5.88867 25.2051 1.72852 21.0352 1.72852 15.8984C1.72852 10.7617 5.88867 6.60156 11.0254 6.60156C12.2266 6.60156 13.3691 6.82617 14.4141 7.24609C14.9707 7.46094 15.6055 7.14844 15.625 6.50391C15.6445 5.9668 15.2637 5.74219 14.9512 5.625C13.7695 5.15625 12.4316 4.88281 11.0254 4.88281C4.93164 4.88281 0 9.81445 0 15.9082C0 22.002 4.93164 26.9434 11.0254 26.9434ZM14.6484 6.34766L9.82422 11.1621C9.64844 11.3281 9.58008 11.543 9.58008 11.7773C9.58008 12.2656 9.94141 12.6465 10.4297 12.6465C10.6934 12.6465 10.8887 12.5488 11.0547 12.3926L16.3574 7.04102C16.5723 6.80664 16.6602 6.5918 16.6602 6.34766C16.6602 6.11328 16.5527 5.86914 16.3574 5.66406L11.0547 0.273438C10.8887 0.107422 10.6934 0 10.4199 0C9.94141 0 9.58008 0.400391 9.58008 0.888672C9.58008 1.11328 9.64844 1.34766 9.81445 1.51367Z" />
    </svg>
  );
}
