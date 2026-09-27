/**
 * What a canvas scene is, and the few helpers the scenes share.
 *
 * A scene is plain drawing code, no React in it: SceneCanvas owns the canvas,
 * its size and the animation loop, and calls `draw` once per frame with
 * everything the scene needs to paint that frame from nothing. Nothing is
 * carried from one frame to the next, so a frame depends only on its
 * arguments, which is what lets the reduced-motion case draw a single frame
 * and stop.
 */

/** A colour as three 0 to 255 channels, so a scene can mix two tokens and add its own alpha. */
export type RGB = readonly [number, number, number];

/** The design tokens the scenes draw with, read from the page's CSS. */
export type Palette = {
  /** The card's own background. Filling with it hides whatever is behind. */
  surface: RGB;
  /** The page's white, for lines that carry no colour of their own. */
  ink: RGB;
  maxLight: RGB;
  maxDeep: RGB;
  proLight: RGB;
  proDeep: RGB;
};

export type SceneFrame = {
  /** Canvas size in device pixels. */
  width: number;
  height: number;
  /**
   * Device pixels per CSS pixel. The canvas is drawn at device resolution, so
   * a line 1 unit wide is one physical pixel: the thinnest line the screen
   * can show, half a CSS pixel on a Retina display.
   */
  dpr: number;
  /** Seconds of animation so far. Stands still while the canvas is off screen. */
  time: number;
  palette: Palette;
};

export type Scene = {
  draw: (ctx: CanvasRenderingContext2D, frame: SceneFrame) => void;
  /** The moment drawn, once, for a visitor who asked for reduced motion. */
  stillTime: number;
};

/*
 * Keyed by Palette's own keys, so adding a colour to the type without saying
 * which token it comes from is a type error.
 */
const TOKENS: Record<keyof Palette, string> = {
  surface: "--color-surface",
  ink: "--color-primary",
  maxLight: "--color-max-light",
  maxDeep: "--color-max-deep",
  proLight: "--color-pro-light",
  proDeep: "--color-pro-deep",
};

/**
 * Reads the tokens off an element, so the scenes use the same colours as the
 * gradient headings instead of a second copy of the hex values.
 *
 * The built CSS writes a token however it likes (#fff, #1c1c1e, #ebebf599),
 * so rather than parse those forms here, each value goes through a canvas
 * fillStyle, which hands any colour it accepts back as "#rrggbb".
 */
export function readPalette(element: Element): Palette {
  const style = getComputedStyle(element);
  const probe = document.createElement("canvas").getContext("2d");

  const read = (token: string): RGB => {
    if (!probe) return [255, 255, 255];
    probe.fillStyle = "#ffffff";
    probe.fillStyle = style.getPropertyValue(token).trim();
    const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(probe.fillStyle));
    if (!hex) return [255, 255, 255];
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  };

  return {
    surface: read(TOKENS.surface),
    ink: read(TOKENS.ink),
    maxLight: read(TOKENS.maxLight),
    maxDeep: read(TOKENS.maxDeep),
    proLight: read(TOKENS.proLight),
    proDeep: read(TOKENS.proDeep),
  };
}

/** A CSS colour string for a canvas style. */
export function rgba([r, g, b]: RGB, alpha: number): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${alpha.toFixed(3)})`;
}

/** From a at t = 0 to b at t = 1. */
export function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** 0 below edge0, 1 above edge1, a smooth S between. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
