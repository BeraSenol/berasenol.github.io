/**
 * Whether the visitor asked for less motion, read once when a component first
 * renders rather than inside an effect.
 *
 * Reading it in a state initializer keeps the answer out of the render-effect-
 * render cycle: an effect that sets state synchronously schedules a second
 * render of everything below it, for a value that was knowable before the first
 * one. Nothing here re-reads the query afterwards, because these animations run
 * once on reveal and a visitor changing the setting mid-scroll is not worth a
 * subscription.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
