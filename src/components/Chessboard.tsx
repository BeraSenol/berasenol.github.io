import { useEffect, useRef } from "react";
import board from "../assets/chessboard.webp";
import bB from "../assets/pieces/bB.svg";
import bK from "../assets/pieces/bK.svg";
import bN from "../assets/pieces/bN.svg";
import bP from "../assets/pieces/bP.svg";
import bQ from "../assets/pieces/bQ.svg";
import bR from "../assets/pieces/bR.svg";
import wB from "../assets/pieces/wB.svg";
import wK from "../assets/pieces/wK.svg";
import wN from "../assets/pieces/wN.svg";
import wP from "../assets/pieces/wP.svg";
import wQ from "../assets/pieces/wQ.svg";
import wR from "../assets/pieces/wR.svg";
import { prefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useReveal } from "../hooks/useReveal";

/**
 * A board that sets itself up and then plays Fool's Mate.
 *
 * The board is one photograph and the pieces are twelve small SVGs laid over it.
 * Each SVG is under Vite's 4KB inline threshold, so they are emitted as data
 * URIs inside the bundle rather than as twelve separate requests.
 *
 * FEN letters are the keys: uppercase is white, lowercase is black, which is the
 * notation's own convention and saves carrying a colour flag alongside.
 */
const PIECE: Record<string, string> = {
  K: wK,
  Q: wQ,
  R: wR,
  B: wB,
  N: wN,
  P: wP,
  k: bK,
  q: bQ,
  r: bR,
  b: bB,
  n: bN,
  p: bP,
};

/**
 * The start position, and the shortest checkmate there is: 1.f3 e5 2.g4 Qh4#.
 *
 * Position and moves live together here rather than in the content files. They
 * are one unit, not copy: a FEN edited in one locale and not the other, or
 * edited without the moves, would silently produce a game that does not happen.
 */
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const MOVES = [
  { from: "f2", to: "f3" },
  { from: "e7", to: "e5" },
  { from: "g2", to: "g4" },
  { from: "d8", to: "h4" },
] as const;

/**
 * Who gets mated. The queen lands on h4 and the diagonal h4-g3-f2-e1 is open,
 * because f2 walked to f3 on the first move: nothing blocks, nothing captures
 * her, and the king has no square. White's king never moves.
 */
const MATED_KING = "e1";

const fileOf = (square: string) => square.charCodeAt(0) - 97;
const rankOf = (square: string) => 8 - Number(square[1]);

/** A square, as a transform on a box that is exactly one square wide. */
const squareTransform = (square: string) =>
  `translate(${fileOf(square) * 100}%, ${rankOf(square) * 100}%)`;

/* The last piece lands at 420 + 14 x 45, so the first move is a second after that. */
const APPEAR_BASE = 420;
const APPEAR_STEP = 45;

/*
 * A move is a hand, and a hand does three things: it picks the piece up, carries
 * it, and sets it down. The pick-up and the set-down cost the same whatever the
 * distance, and only the carry grows with it, so a move's duration is a fixed
 * base plus a per-square rate.
 *
 * This is the fix for the click. Every move used to share one 450ms duration, so
 * the queen's four-square swing travelled four times faster than the pawn's
 * one-square push, and on an ease-out curve, whose initial slope is three times
 * the average speed, she left d8 at 24 pixels in the first frame. That is 43% of
 * a square in 16ms, and then a long crawl into the corner: measured per frame,
 * 24.25, 22.45, 20.52 down to 0.24, 0.09, 0.01. The eye reads the launch as a
 * jump and the arrival as a snap, which is the whole complaint.
 */
const MOVE_BASE_MS = 210;
const MOVE_PER_SQUARE_MS = 52;
const THINK_MS = 320;
const FIRST_MOVE_MS = 2050;
const MATE_DELAY_MS = 140;
const MATE_MS = 700;

/*
 * Zero slope at both ends. A cubic-bezier's initial slope is y1/x1 and its
 * terminal slope is (1 - y2)/(1 - x2), so y1 = 0 and y2 = 1 make both of them
 * zero: the piece leaves from rest and arrives at rest instead of being flung.
 */
const MOVE_EASE = "cubic-bezier(0.34, 0, 0.2, 1)";

/**
 * The squares a piece leaves from, so those four wrappers can be promoted to
 * their own compositor layer for the whole life of the page rather than only
 * while they are moving.
 *
 * This is the second half of the fix for the click that survived the rewrite.
 * The geometry was already clean: the queen lands exactly on h4, her last
 * frames move 0.49, 0.20 and 0.008 pixels, and every presented frame after
 * that is byte identical. So what was left was not movement. A transform
 * animation runs on the compositor, which rasterizes the element once and moves
 * the texture; when the animation ends, that layer is thrown away and the
 * element repaints into its parent. Same position, different rasterization, one
 * frame apart, which the eye reads as the piece settling.
 *
 * will-change keeps the layer alive across that boundary, and the animation
 * below is now a bare translate with no scale in it, so the compositor never
 * has to choose a raster scale and the texture is identical before, during and
 * after. That cost the lift, which is a fair trade for an arrival that does not
 * snap; it can come back as a separate element if you want it.
 */
const MOVERS: ReadonlySet<string> = new Set(MOVES.map((move) => move.from));

type Scheduled = { from: string; to: string; start: number; duration: number };

/*
 * When each move starts and how long it takes, accumulated rather than laid on a
 * fixed interval: the next piece lifts a beat after the previous one lands, so
 * retuning a duration can never make two moves overlap.
 *
 * Every piece in this game moves at most once, which is what lets one animation
 * per piece be the entire game. A game with a piece that moved twice would need
 * these chained, and a game with a capture would need something removed.
 */
const SCHEDULE: Scheduled[] = [];

for (const move of MOVES) {
  const distance = Math.hypot(
    fileOf(move.to) - fileOf(move.from),
    rankOf(move.to) - rankOf(move.from),
  );
  const previous = SCHEDULE.at(-1);

  SCHEDULE.push({
    from: move.from,
    to: move.to,
    start: previous
      ? previous.start + previous.duration + THINK_MS
      : FIRST_MOVE_MS,
    duration: Math.round(MOVE_BASE_MS + distance * MOVE_PER_SQUARE_MS),
  });
}

const LAST_MOVE = SCHEDULE.at(-1);
const MATE_AT = LAST_MOVE
  ? LAST_MOVE.start + LAST_MOVE.duration + MATE_DELAY_MS
  : 0;

type Piece = { square: string; code: string };

/**
 * Builds the pieces from a FEN placement field, or null if it is malformed.
 *
 * Content is authored by hand, so a bad FEN is a typo, not an exception worth
 * throwing during render; the section draws nothing rather than crashing the
 * page around it. Read once at module scope, because START never changes.
 */
function startingPieces(placement: string): Piece[] | null {
  const ranks = placement.split("/");
  if (ranks.length !== 8) return null;

  const pieces: Piece[] = [];

  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    let fileIndex = 0;

    for (const char of ranks[rankIndex] ?? "") {
      if (char >= "1" && char <= "8") {
        fileIndex += Number(char);
        continue;
      }
      if (!PIECE[char] || fileIndex > 7) return null;

      pieces.push({
        square: `${"abcdefgh"[fileIndex]}${8 - rankIndex}`,
        code: char,
      });
      fileIndex += 1;
    }

    if (fileIndex !== 8) return null;
  }

  return pieces;
}

const PIECES = startingPieces(START);

/*
 * Where the playing field sits inside the photograph, as a fraction of the
 * image. Measured off the source at 2000px: the light/dark boundaries fall at
 * 209, 407, 605, 802, 1000, 1198, 1395 and 1593, which is a square of 197.7px
 * starting at 209, so the field runs 209 to 1790.6.
 */
const FIELD_INSET = "10.45%";
const FIELD_SIZE = "79.09%";

export function Chessboard({ label }: { label: string }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  /*
   * The board has no state. It used to keep a ply counter and re-derive the
   * position from it, which meant four re-renders of thirty-two nodes and a
   * transition fired by React changing an inline style. Nothing here changes
   * after the reveal: the start position is rendered once and four animations
   * own the rest, so the browser runs the game and React watches.
   */
  const squares = useRef(new Map<string, HTMLDivElement>());
  const glow = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    /*
     * Reduced motion gets the same end state with no travel: duration and delay
     * collapse to zero, so the board is simply already mated. The blanket CSS
     * override in index.css cannot do this for us, because a script-driven
     * animation is not a CSS animation and that rule never reaches it. One code
     * path either way, which is the point of folding it into the timing.
     */
    const instant = prefersReducedMotion();
    const running: Animation[] = [];

    for (const move of SCHEDULE) {
      const node = squares.current.get(move.from);
      if (!node) continue;

      running.push(
        node.animate(
          [
            { transform: squareTransform(move.from) },
            { transform: squareTransform(move.to) },
          ],
          {
            duration: instant ? 0 : move.duration,
            delay: instant ? 0 : move.start,
            easing: MOVE_EASE,
            /*
             * forwards, not both: during the delay the animation contributes
             * nothing, so the piece sits on the square the inline transform put
             * it on, and after it ends the animation holds the destination.
             */
            fill: "forwards",
          },
        ),
      );
    }

    if (glow.current) {
      running.push(
        glow.current.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: instant ? 0 : MATE_MS,
          delay: instant ? 0 : MATE_AT,
          easing: "ease-out",
          fill: "forwards",
        }),
      );
    }

    return () => running.forEach((animation) => animation.cancel());
  }, [isVisible]);

  if (!PIECES) return null;

  return (
    <figure className="w-full">
      <div
        ref={ref}
        role="img"
        aria-label={label}
        className="relative aspect-square w-full"
      >
        <img
          src={board}
          alt=""
          width={1200}
          height={1200}
          loading="lazy"
          className="absolute inset-0 h-full w-full rounded-sm"
        />

        <div
          className="absolute"
          style={{
            left: FIELD_INSET,
            top: FIELD_INSET,
            width: FIELD_SIZE,
            height: FIELD_SIZE,
          }}
        >
          {PIECES.map((piece) => {
            /*
             * Pieces arrive in a diagonal sweep from a1, the way you set a board
             * up: the delay grows with the distance from that corner.
             */
            const step = 7 - rankOf(piece.square) + fileOf(piece.square);

            return (
              /*
               * Two nested elements because they animate different things at
               * different times. The wrapper is the square, and the animation
               * owns its transform once a move starts; the image is the arrival,
               * a transition on its own opacity and scale. One element would
               * make the appearing stagger delay apply to every later move.
               */
              <div
                key={piece.square}
                ref={(node) => {
                  if (node) squares.current.set(piece.square, node);
                  else squares.current.delete(piece.square);
                }}
                className="absolute left-0 top-0 flex h-[12.5%] w-[12.5%] items-center justify-center"
                style={{
                  transform: squareTransform(piece.square),
                  ...(MOVERS.has(piece.square)
                    ? { willChange: "transform" }
                    : {}),
                }}
              >
                {piece.square === MATED_KING ? (
                  /*
                   * Mounted from the start at zero opacity rather than added on
                   * mate: an element that appears already opaque has nothing to
                   * animate from. Its delay lets the queen finish her slide
                   * before the board lights up.
                   */
                  <span
                    ref={glow}
                    aria-hidden="true"
                    className="absolute inset-[-12%] rounded-full opacity-0"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,59,48,0.65) 0%, rgba(255,59,48,0.3) 42%, rgba(255,59,48,0) 70%)",
                    }}
                  />
                ) : null}

                <img
                  src={PIECE[piece.code]}
                  alt=""
                  aria-hidden="true"
                  /*
                   * position: relative so the glow paints behind it. A positioned
                   * element outranks an unpositioned one whatever the DOM order,
                   * so without this the absolutely positioned glow would sit on
                   * top of the king rather than behind him.
                   */
                  className="relative w-[88%] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transitionDelay: `${APPEAR_BASE + step * APPEAR_STEP}ms`,
                    opacity: isVisible ? 1 : 0,
                    /*
                     * Written as a whole transform rather than a Tailwind scale
                     * utility, for the reason in Reveal.tsx: those write to a
                     * custom property registered with syntax "*", which is not
                     * animatable, so the browser swaps it discretely.
                     */
                    transform: isVisible ? "scale(1)" : "scale(0.55)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
