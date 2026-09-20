import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/**
 * The page's one horizontal measure. Full-bleed: there is no max width, so a
 * section spans whatever the viewport gives it. What the container still owns
 * is the gutter — the distance from the viewport edge — and every section uses
 * the same one, so their left edges line up down the page.
 *
 * The gutter grows with the viewport rather than staying at 24px: on a wide
 * display a fixed small gutter reads as content pinned to the bezel, and on a
 * phone anything larger eats the line length. Four steps, from 390px up.
 *
 * Reading width is a separate, narrower constraint applied to prose inside.
 * The container decides where sections align; the measure decides how far a
 * line of text may run. Removing the max width here did not change that.
 */
export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`w-full px-6 sm:px-8 lg:px-12 xl:px-16 ${className}`}>{children}</div>
  )
}
