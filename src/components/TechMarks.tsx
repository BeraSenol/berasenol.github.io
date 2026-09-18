import stockfishIcon from "../assets/stockfish-mark.webp";
import swiftTestingIcon from "../assets/swift-testing.webp";
import xcodeIcon from "../assets/xcode.webp";
import swiftDataIcon from "../assets/swiftdata.webp";
import swiftUiIcon from "../assets/swiftui.webp";

/**
 * The five marks under the DGT Studio Pro headline.
 *
 * Three kinds, because that is what the sources are: one path that takes its
 * colour from the page, one issued colour badge drawn as a path, and three app
 * icons that are raster art and cannot be anything but images.
 *
 * macOS is currentColor rather than its issued fill. Apple's wordmark ships as
 * near-black, which on this canvas would be invisible; white on dark is the
 * usual treatment for it.
 */

const MACOS_GRADIENT_ID = "macos-mark";

/**
 * Apple's macOS mark, carrying the headline's gradient.
 *
 * Its issued fill is #1d1d1f, which would be invisible here anyway. The stops
 * are .gradient-max's, written out because background-clip: text cannot reach an
 * SVG fill: the heading and this mark need the same two colours expressed twice,
 * so if one moves the other has to move with it.
 *
 * The ramp runs top to bottom, which is .gradient-text's default angle of 180deg
 * and so the same direction the headline above it runs. It used to run left to
 * right, which on a round badge put the pale end on one side rather than over the
 * top of it and read as a different treatment from the heading it belongs with.
 * The default gradientUnits is objectBoundingBox, so 0 to 1 is the mark's own box.
 */
export function MacOsMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 34 34"
      className={className}
      role="img"
      aria-label="macOS"
    >
      <defs>
        <linearGradient id={MACOS_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="7%" stopColor="#ffe1fc" />
          <stop offset="79%" stopColor="#c683ef" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${MACOS_GRADIENT_ID})`}
        d="m 15.8,20.64 c 0,2.86 -1.49,4.66 -3.87,4.66 -2.38,0 -3.87,-1.81 -3.87,-4.66 0,-2.87 1.49,-4.67 3.87,-4.67 2.38,0 3.87,1.8 3.87,4.67 z m 3.32,-10.09 -1.04,0.07 c -0.59,0.04 -0.85,0.25 -0.85,0.63 0,0.4 0.33,0.62 0.79,0.62 0.63,0 1.1,-0.41 1.1,-0.96 z M 34,17 C 34,26.49 26.49,34 17,34 7.51,34 0,26.49 0,17 0,7.51 7.51,0 17,0 26.49,0 34,7.51 34,17 Z M 20.94,10.34 c 0,1.38 0.76,2.22 2,2.22 1.05,0 1.71,-0.59 1.82,-1.43 h -0.82 c -0.11,0.46 -0.47,0.71 -1,0.71 -0.7,0 -1.13,-0.57 -1.13,-1.5 0,-0.92 0.43,-1.47 1.13,-1.47 0.56,0 0.91,0.32 1,0.73 h 0.82 C 24.65,8.78 24.01,8.16 22.94,8.16 c -1.24,-0.01 -2,0.83 -2,2.18 z M 9.51,8.24 v 4.24 h 0.84 v -2.6 c 0,-0.55 0.39,-0.99 0.9,-0.99 0.5,0 0.82,0.3 0.82,0.78 v 2.81 h 0.82 V 9.8 c 0,-0.51 0.35,-0.91 0.9,-0.91 0.55,0 0.82,0.28 0.82,0.87 v 2.72 h 0.84 V 9.55 c 0,-0.88 -0.5,-1.4 -1.36,-1.4 -0.59,0 -1.08,0.3 -1.29,0.76 H 12.73 C 12.54,8.45 12.14,8.15 11.56,8.15 c -0.57,0 -1,0.28 -1.18,0.76 H 10.32 V 8.23 Z m 7.78,12.4 c 0,-3.69 -2.06,-6.01 -5.36,-6.01 -3.3,0 -5.36,2.32 -5.36,6.01 0,3.69 2.06,6 5.36,6 3.3,0 5.36,-2.32 5.36,-6 z m 0.52,-8.09 c 0.56,0 1.02,-0.24 1.28,-0.67 h 0.07 v 0.6 h 0.81 v -2.9 c 0,-0.89 -0.6,-1.42 -1.67,-1.42 -0.97,0 -1.65,0.47 -1.74,1.18 h 0.81 c 0.09,-0.31 0.42,-0.48 0.89,-0.48 0.57,0 0.87,0.26 0.87,0.73 v 0.37 l -1.15,0.07 c -1.01,0.06 -1.58,0.5 -1.58,1.27 -0.01,0.76 0.59,1.25 1.41,1.25 z m 9.17,10.59 c 0,-1.65 -0.96,-2.61 -3.38,-3.14 l -1.29,-0.28 c -1.59,-0.35 -2.21,-0.98 -2.21,-1.89 0,-1.18 1.12,-1.89 2.57,-1.89 1.52,0 2.52,0.78 2.65,2.06 h 1.45 c -0.07,-1.97 -1.74,-3.36 -4.06,-3.36 -2.41,0 -4.1,1.35 -4.1,3.26 0,1.65 1.01,2.71 3.34,3.22 l 1.29,0.28 c 1.61,0.35 2.26,1 2.26,1.97 0,1.14 -1.15,1.97 -2.72,1.97 -1.67,0 -2.83,-0.76 -3,-2.01 h -1.45 c 0.14,2.01 1.83,3.31 4.37,3.31 2.59,0 4.28,-1.35 4.28,-3.5 z"
      />
    </svg>
  );
}

/** Swift's issued mark: white bird on the orange field. */
export function SwiftMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-252 343.9 106.1 106.1"
      className={className}
      role="img"
      aria-label="Swift"
    >
      <path
        fill="#f05138"
        d="M-145.9,373.3c0-1.1,0-2.1,0-3.2c-0.1-2.3-0.2-4.7-0.6-7c-0.4-2.3-1.1-4.5-2.2-6.6c-1.1-2.1-2.4-4-4.1-5.6c-1.7-1.7-3.6-3-5.6-4.1c-2.1-1.1-4.3-1.8-6.6-2.2c-2.3-0.4-4.6-0.6-7-0.6c-1.1,0-2.1,0-3.2,0c-1.3,0-2.5,0-3.8,0h-28.1h-11.6c-1.3,0-2.5,0-3.8,0c-1.1,0-2.1,0-3.2,0c-0.6,0-1.2,0-1.7,0.1c-1.7,0.1-3.5,0.2-5.2,0.5c-1.7,0.3-3.4,0.8-5,1.4c-0.5,0.2-1.1,0.5-1.6,0.7c-1.6,0.8-3,1.8-4.4,2.9c-0.4,0.4-0.9,0.8-1.3,1.2c-1.7,1.7-3,3.6-4.1,5.6c-1.1,2.1-1.8,4.3-2.2,6.6c-0.4,2.3-0.5,4.6-0.6,7c0,1.1,0,2.1,0,3.2c0,1.3,0,2.5,0,3.8v17.3v22.4c0,1.3,0,2.5,0,3.8c0,1.1,0,2.1,0,3.2c0.1,2.3,0.2,4.7,0.6,7c0.4,2.3,1.1,4.5,2.2,6.6c1.1,2.1,2.4,4,4.1,5.6c1.7,1.7,3.6,3,5.6,4.1c2.1,1.1,4.3,1.8,6.6,2.2c2.3,0.4,4.6,0.6,7,0.6c1.1,0,2.1,0,3.2,0c1.3,0,2.5,0,3.8,0h39.7c1.3,0,2.5,0,3.8,0c1.1,0,2.1,0,3.2,0c2.3-0.1,4.7-0.2,7-0.6c2.3-0.4,4.5-1.1,6.6-2.2c2.1-1.1,4-2.4,5.6-4.1c1.7-1.7,3-3.6,4.1-5.6c1.1-2.1,1.8-4.3,2.2-6.6c0.4-2.3,0.6-4.6,0.6-7c0-1.1,0-2.1,0-3.2c0-1.3,0-2.5,0-3.8v-39.7C-145.9,375.8-145.9,374.6-145.9,373.3z"
      />
      <path
        fill="#ffffff"
        d="M-168,409.4c0.1-0.4,0.2-0.8,0.3-1.2c4.4-17.5-6.3-38.3-24.5-49.2c8,10.8,11.5,23.9,8.4,35.3c-0.3,1-0.6,2-1,3c-0.4-0.3-0.9-0.6-1.6-0.9c0,0-18.1-11.2-37.7-30.9c-0.5-0.5,10.5,15.7,22.9,28.8c-5.9-3.3-22.2-15.2-32.6-24.6c1.3,2.1,2.8,4.2,4.4,6.1c8.6,11,19.9,24.5,33.4,34.9c-9.5,5.8-22.9,6.3-36.2,0c-3.3-1.5-6.4-3.4-9.3-5.5c5.6,9,14.3,16.8,24.9,21.4c12.6,5.4,25.2,5.1,34.5,0.1l0,0c0,0,0.1,0,0.1-0.1c0.4-0.2,0.8-0.5,1.2-0.7c4.5-2.3,13.3-4.6,18.1,4.6C-161.3,432.6-158.8,420.6-168,409.4C-168,409.4-168,409.4-168,409.4z"
      />
    </svg>
  );
}

export function SwiftUiMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={swiftUiIcon}
      alt="SwiftUI"
      width={128}
      height={128}
      className={className}
    />
  );
}

export function SwiftDataMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={swiftDataIcon}
      alt="SwiftData"
      width={128}
      height={128}
      className={className}
    />
  );
}

export function StockfishMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={stockfishIcon}
      alt="Stockfish"
      width={128}
      height={128}
      className={className}
    />
  );
}

export function SwiftTestingMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={swiftTestingIcon}
      alt="Swift Testing"
      width={128}
      height={128}
      className={className}
    />
  );
}

export function XcodeMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={xcodeIcon}
      alt="Xcode"
      width={128}
      height={128}
      className={className}
    />
  );
}

const DGT_RED = "#E1251B";

/**
 * The DGT wordmark, off the brand SVG.
 *
 * Two colours in the original: #54565A for the D and the T and the three squares
 * inside the D, and #E1251B for the G. The grey is a near-black meant for white
 * paper and disappears on this canvas, so it becomes currentColor and the row's
 * text-ink carries it, the same treatment the macOS wordmark gets above. The red
 * G is the half anyone recognises, so it keeps its issued value.
 *
 * The viewBox is the artwork's own ink box, measured with getBBox rather than
 * taken from the export, which was a 1024 square with the mark clipped into a
 * corner of it. An svg sized by height renders smaller than its neighbours by
 * exactly however much empty space its viewBox carries.
 */
export function DgtMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="112.368 314 799.265 395.142"
      className={className}
      role="img"
      aria-label="DGT"
    >
      <g fill="currentColor">
        <path d="M377.36 521.685C377.36 474.607 389.244 432.555 411.296 397.736C380.423 344.405 322.352 314 243.332 314C164.312 314 150.346 322.459 112.368 337.785V503.908H185.997V387.193C200.698 382.656 216.625 380.327 234.757 380.327C312.429 380.327 356.655 428.019 356.655 509.058C356.655 590.097 298.095 646.493 222.75 646.493L222.383 708.038C302.505 708.038 364.129 676.775 400.27 625.406C385.323 596.104 377.482 561.285 377.482 521.563L377.36 521.685Z" />
        <path d="M643.087 314.613V376.894H741.587V685.235C764.864 694.307 791.081 700.437 818.034 703.38V376.894H911.633V314.613H642.965H643.087Z" />
        <path d="M146.181 509.793H112.368V543.631H146.181V509.793Z" />
        <path d="M185.997 509.793H152.184V543.631H185.997V509.793Z" />
        <path d="M185.997 549.638H152.184V583.476H185.997V549.638Z" />
      </g>
      <path
        fill={DGT_RED}
        d="M642.475 635.949C627.773 640.485 611.847 642.815 593.715 642.815C516.043 642.815 471.816 595.123 471.816 514.084C471.816 433.045 530.377 376.649 605.721 376.649L606.089 314.981C473.531 314.981 391.816 400.679 391.816 520.827C391.816 640.976 463.853 709.142 585.017 709.142C706.181 709.142 678.003 700.682 715.982 685.357V503.908H642.352V635.949H642.475Z"
      />
    </svg>
  );
}
