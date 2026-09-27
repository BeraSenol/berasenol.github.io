/**
 * Whether the visitor asked for less motion.
 *
 * A plain function, not a hook, which is why it lives in lib/ and its name has
 * no `use` prefix. React reads that prefix as a promise: a use-function may
 * call other hooks, so it has to follow the Rules of Hooks (top level of a
 * component, same order every render). This one only asks the browser a
 * question, so it can be called anywhere, including inside a useState
 * initializer or an effect body, which is where its callers use it.
 *
 * Reading it in a state initializer keeps the answer out of the render-effect-
 * render cycle: an effect that sets state synchronously schedules a second
 * render of everything below it, for a value that was knowable before the first
 * one. Nothing re-reads the query afterwards, because these animations run
 * once on reveal and a visitor changing the setting mid-scroll is not worth a
 * subscription.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
