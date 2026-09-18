import { useCallback, useEffect, useRef } from 'react'

const RAMP_MS = 620

/** Standard ease-in-out cubic: slow at both ends, quick through the middle. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function isOrbitAnimation(a: Animation): a is CSSAnimation {
  return 'animationName' in a && (a as CSSAnimation).animationName.startsWith('orbit-')
}

/**
 * Eases a CSS animation to a halt and back up to speed.
 *
 * `animation-play-state: paused` is binary; it can only snap. The Web Animations
 * API exposes the same CSS animations as Animation objects, and their playbackRate
 * is a plain number, so ramping it 1 → 0 over time is a real deceleration. Changing
 * playbackRate preserves currentTime, so nothing jumps.
 *
 * Every animation under the ring is set in the same frame. The ring and the labels'
 * counter-rotation only cancel out while their rates match exactly; ramping one
 * ahead of the other would make the text tumble as it slowed.
 *
 * This is refs and rAF rather than state on purpose: the rate changes ~60 times a
 * second and nothing renders from it, so putting it in state would re-render the
 * whole orbit every frame to produce identical JSX.
 */
export function useSpinRamp<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const rate = useRef(1)

  const rampTo = useCallback((target: number) => {
    const root = ref.current
    if (!root) return

    cancelAnimationFrame(frame.current)
    const from = rate.current
    const started = performance.now()

    const step = (now: number) => {
      const t = Math.min(1, (now - started) / RAMP_MS)
      const next = from + (target - from) * easeInOutCubic(t)
      rate.current = next

      for (const animation of root.getAnimations({ subtree: true })) {
        if (isOrbitAnimation(animation)) animation.playbackRate = next
      }

      if (t < 1) frame.current = requestAnimationFrame(step)
    }

    frame.current = requestAnimationFrame(step)
  }, [])

  // One of the few correct uses of an effect: releasing a browser resource we hold.
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return { ref, slow: () => rampTo(0), resume: () => rampTo(1) }
}
