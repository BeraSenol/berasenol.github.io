import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type Direction = "bottom" | "left" | "right";
type Distance = "near" | "far";

type RevealProps = {
  children: ReactNode;
  /** Milliseconds to stagger this element behind the ones around it. */
  delay?: number;
  /** Where the element travels in from. Defaults to below. */
  from?: Direction;
  /**
   * How far it travels. `near` is a nudge; `far` is a full element-width, so the
   * element starts completely outside its own footprint and sweeps in.
   */
  distance?: Distance;
  className?: string;
};

/**
 * Complete class strings, looked up, never built by concatenation. Tailwind scans
 * source text for class names, so a string assembled at runtime is invisible to it
 * and gets stripped from the production stylesheet.
 *
 * These set `transform` directly rather than using `translate-x-*`. Tailwind v4's
 * translate utilities write to the `--tw-translate-x` custom property, which is
 * registered with `syntax: "*"`, and a custom property with that syntax is not
 * animatable, so the browser swaps it discretely. The result is an element that
 * snaps to its final position while only the opacity fades. Measured: the exterior
 * image sat at left 1250 for three frames, then appeared at 738.
 *
 * Writing the whole transform value keeps it a real animatable property.
 *
 * Anything travelling sideways also needs a clipping ancestor: an off-screen
 * transform still counts toward document scroll width.
 *
 * The observer sits on an outer wrapper that is never transformed, and only the
 * inner element moves. Observing the moving element itself looked fine on a
 * desktop and failed completely on a phone: a `far` sideways start is 32rem, so
 * at a 390px viewport the element begins at x 536 to 878, entirely outside the
 * viewport horizontally. IntersectionObserver intersects rectangles, so that box
 * never reached a 0.1 ratio no matter how far the page scrolled, isVisible never
 * flipped, and both Dignify windows plus the Kitchen photographs stayed at
 * opacity 0 forever. The wrapper stays in the layout position, so it intersects
 * on vertical scroll alone.
 *
 * The easing is easeOutCubic, not the harder easeOutExpo-ish curve this used to
 * carry. Measured on the board, which travels 32rem: with the old curve the last
 * half pixel took 212ms and the final 100ms of the transition covered 0.05px, so
 * the element visibly parked a fraction short and then completed one sub-pixel
 * step, which reads as a click into place. Same curve as the chess pieces use for
 * their moves, so the page now eases one way.
 */
const REST = "[transform:translate(0,0)]";

const OFFSET: Record<Direction, Record<Distance, string>> = {
  bottom: {
    near: "[transform:translateY(2.5rem)]",
    far: "[transform:translateY(8rem)]",
  },
  left: {
    near: "[transform:translateX(-6rem)]",
    far: "[transform:translateX(-32rem)]",
  },
  right: {
    near: "[transform:translateX(6rem)]",
    far: "[transform:translateX(32rem)]",
  },
};

export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  distance = "near",
  className = "",
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    // The wrapper carries the caller's layout classes, because it is the box the
    // surrounding grid or flex row sizes. The child carries the motion.
    <div ref={ref} className={className}>
      <div
        style={{ transitionDelay: `${delay}ms` }}
        className={`transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isVisible
            ? `${REST} opacity-100`
            : `${OFFSET[from][distance]} opacity-0`
        }`}
      >
        {children}
      </div>
    </div>
  );
}
