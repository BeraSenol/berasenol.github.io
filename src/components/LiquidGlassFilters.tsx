import { LIQUID_GLASS_MENU_MAP, LIQUID_GLASS_PILL_MAP } from "./liquidGlassMap";

/**
 * The SVG filters every liquid-glass surface refracts through, rendered once
 * for the whole page. CSS reaches them by id: .liquid-glass uses
 * url(#liquid-glass-menu), and .liquid-glass-pill swaps in
 * url(#liquid-glass-pill). They live here rather than inside one component so
 * that a pill on the splash does not depend on the language menu being
 * mounted.
 *
 * Sized to nothing and taken out of the flow: it exists only to hold the
 * <filter> definitions.
 */
export function LiquidGlassFilters() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0">
      <Lens id="liquid-glass-menu" map={LIQUID_GLASS_MENU_MAP} />
      <Lens id="liquid-glass-pill" map={LIQUID_GLASS_PILL_MAP} />
    </svg>
  );
}

/**
 * One lens: the freefrontend.com "Liquid Glass Distortion Card" chain with a
 * map of our own.
 *
 * - feImage lays the displacement map over the element's box.
 * - The backdrop is displaced three times, by slightly different amounts
 *   (-20, -24, -28), and each pass keeps only one colour channel. Red, green
 *   and blue therefore bend by different amounts at the rim, which is
 *   chromatic aberration: the faint colour fringing real glass gives an edge.
 * - Screen-blending the three single-channel images puts a full-colour
 *   picture back together, and a light blur softens it.
 *
 * A component rather than two copies of the markup: the two filters differ
 * only in id and map, and a chain this long is exactly what drifts apart
 * when it is duplicated by hand.
 */
function Lens({ id, map }: { id: string; map: string }) {
  return (
    <filter
      id={id}
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      colorInterpolationFilters="sRGB"
    >
      <feImage
        href={map}
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        result="map"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={-20}
        xChannelSelector="R"
        yChannelSelector="G"
        result="dispRed"
      />
      <feColorMatrix
        in="dispRed"
        type="matrix"
        values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
        result="red"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={-24}
        xChannelSelector="R"
        yChannelSelector="G"
        result="dispGreen"
      />
      <feColorMatrix
        in="dispGreen"
        type="matrix"
        values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
        result="green"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={-28}
        xChannelSelector="R"
        yChannelSelector="G"
        result="dispBlue"
      />
      <feColorMatrix
        in="dispBlue"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
        result="blue"
      />
      <feBlend in="red" in2="green" mode="screen" result="rg" />
      <feBlend in="rg" in2="blue" mode="screen" result="output" />
      <feGaussianBlur in="output" stdDeviation={3} />
    </filter>
  );
}
