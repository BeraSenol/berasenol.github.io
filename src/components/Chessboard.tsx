import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
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
import { ReplayMark } from "./Glyphs";

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

/**
 * A square, as a layout position rather than a transform.
 *
 * This is the last percentage to leave the moving parts, and it is the one that
 * was still causing the click. The travel became pixels two attempts ago, but
 * the wrapper's resting position was still transform: translate(700%, 400%),
 * and a transform percentage is resolved by whoever is drawing the element. A
 * compositor working in whole layout units resolves it against a rounded box
 * and lands a couple of pixels from where paint puts it, so the moment the
 * animation finished and the layer went away, the piece moved.
 *
 * left and top are resolved by layout instead, once, to a LayoutUnit both
 * paths then agree on. The arithmetic is identical: 87.5% of the 450.625px
 * field is 394.296875, and so was 700% of the 56.328125px wrapper. The
 * difference is only who does the resolving, and that turns out to be the
 * whole bug. At rest a piece now carries no transform at all, which is a thing
 * worth asserting against: 32 of 32 should report transform: none.
 */
const squareStyle = (square: string) => ({
  left: `${fileOf(square) * 12.5}%`,
  top: `${rankOf(square) * 12.5}%`,
});

/*
 * A second of stillness after the board has slid in, before the first piece
 * appears. The last piece lands at 1420 + 14 x 45, so the first move is a
 * second after that.
 */
const APPEAR_BASE = 1420;
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
const FIRST_MOVE_MS = 3050;
const MATE_DELAY_MS = 140;
const MATE_MS = 700;

/*
 * Zero slope at both ends. A cubic-bezier's initial slope is y1/x1 and its
 * terminal slope is (1 - y2)/(1 - x2), so y1 = 0 and y2 = 1 make both of them
 * zero: the piece leaves from rest and arrives at rest instead of being flung.
 */
const MOVE_EASE = "cubic-bezier(0.34, 0, 0.2, 1)";

/**
 * Where each piece ends up, keyed by where it started.
 *
 * Every wrapper is positioned on its FINAL square, from the first paint, in the
 * same percentage form as the twenty-eight pieces that never move. That is the
 * hardcoded end point, and it is the piece's ordinary resting style rather than
 * something an animation has to hold in place.
 *
 * This is what the last two attempts were missing, and the pair of symptoms is
 * what gave it away. Promoting the movers to their own layer stopped the click
 * but left those four sitting visibly off centre; taking the promotion away put
 * them back on centre and brought the click back. Both readings are the same
 * fact: the composited position and the painted position were not the same
 * place. The offset came from animating a percentage. The wrapper is 56.328125
 * pixels wide, so translate(700%) is 394.296875, but a compositor working in
 * whole layout units resolves that against a rounded box and lands a couple of
 * pixels away. With the promotion the piece stayed at the composited position
 * forever, which reads as off centre. Without it, the piece sat at the
 * composited position for the whole animation and jumped to the painted one at
 * the end, which reads as a click. Multiply a rounding error by seven hundred
 * percent and that is your few pixels.
 *
 * So nothing that moves is written as a percentage any more. The travel is an
 * offset in pixels, measured from the board itself, and the resting place is
 * the destination square. See the effect below for how the two meet.
 */
const DESTINATION: ReadonlyMap<string, string> = new Map(
  MOVES.map((move) => [move.from, move.to]),
);

/** Where a piece spends most of its life: its last square, or its only one. */
const restSquare = (start: string) => DESTINATION.get(start) ?? start;

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

/*
 * The replay. Taking a move back is the same hand in reverse, so it costs what
 * the move cost. The four go back together rather than one at a time, last move
 * first and a beat apart, the way you sweep a finished game back to the start,
 * and they begin while the red square is still fading.
 */
const GLOW_OUT_MS = 280;
const TAKEBACK_START_MS = 140;
const TAKEBACK_STEP_MS = 70;
const REPLAY_REST_MS = 520;

/** When each move is taken back on a replay, keyed by where it started. */
const TAKEBACK_AT: ReadonlyMap<string, number> = new Map(
  SCHEDULE.map((move, index) => [
    move.from,
    TAKEBACK_START_MS + (SCHEDULE.length - 1 - index) * TAKEBACK_STEP_MS,
  ]),
);

/*
 * The latest landing, not the last to start: the queen goes back first but has
 * the longest trip, so which piece gets home last depends on the durations.
 */
const TAKEBACK_END = Math.max(
  ...SCHEDULE.map((move) => (TAKEBACK_AT.get(move.from) ?? 0) + move.duration),
);

/*
 * How much sooner everything happens on a replay. The first game waits for the
 * set-up sweep before 1.f3; a replay only waits for the last piece to get home
 * and a rest after it. One offset for every move and for the mate, so the game
 * keeps exactly the rhythm it had the first time.
 */
const REPLAY_SOONER = FIRST_MOVE_MS - (TAKEBACK_END + REPLAY_REST_MS);

type Travel = { keyframes: Keyframe[]; delay: number; duration: number };

const HOME = "0px 0px";

/**
 * A piece's whole part in one run, as a single animation.
 *
 * On reveal: wait on the start square, then travel home. On a replay: travel
 * back to the start square, wait there, then travel home again. The easing
 * sits on each keyframe rather than on the animation as a whole, because a
 * replay has two journeys with a wait between them and each needs the curve to
 * itself. The overall timing stays linear, so an offset is simply a fraction
 * of the time.
 *
 * `away` is the start square as an offset from home, in pixels.
 */
function travel(move: Scheduled, away: string, replay: boolean): Travel {
  if (!replay) {
    return {
      delay: move.start,
      duration: move.duration,
      keyframes: [{ translate: away, easing: MOVE_EASE }, { translate: HOME }],
    };
  }

  const back = TAKEBACK_AT.get(move.from) ?? 0;
  const start = move.start - REPLAY_SOONER;
  const total = start + move.duration - back;

  return {
    delay: back,
    duration: total,
    keyframes: [
      { translate: HOME, easing: MOVE_EASE },
      { translate: away, offset: move.duration / total },
      { translate: away, offset: (start - back) / total, easing: MOVE_EASE },
      { translate: HOME },
    ],
  };
}

/*
 * The replay button's two states, as whole style objects for the same reason
 * the pieces write a whole transform: a Tailwind scale utility would go through
 * a custom property the browser cannot interpolate.
 *
 * visibility is what takes the hidden button out of the tab order and the
 * accessibility tree, not just out of sight. It flips to visible at once and
 * back to hidden only after the fade, via the delay, so the fade is seen both
 * ways. Each state carries the transition used on the way INTO it.
 */
const REPLAY_SHOWN: CSSProperties = {
  opacity: 1,
  transform: "scale(1)",
  visibility: "visible",
  transition:
    "opacity 300ms ease-out, transform 520ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms",
};

const REPLAY_HIDDEN: CSSProperties = {
  opacity: 0,
  transform: "scale(0.6)",
  visibility: "hidden",
  transition:
    "opacity 240ms ease-in, transform 240ms ease-in, visibility 0s linear 240ms, background-color 150ms",
};

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

type ChessboardProps = {
  label: string;
  caption: string;
  /** The replay button's accessible name and tooltip. */
  replayLabel: string;
};

export function Chessboard({ label, caption, replayLabel }: ChessboardProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  /*
   * The board still has no position state. The start position is rendered once
   * and the animations own everything after it, so the browser runs the game
   * and React watches.
   *
   * What it does have now is two facts about the game rather than the board.
   * `run` counts how many times the game has been started: the effect below
   * depends on it, so bumping it is how a click says "play it again". `mated`
   * is whether the current run has reached its end, and it is the only thing
   * React renders differently, because it decides whether the replay button
   * shows. It cannot be derived from anything React has, since the moment the
   * mate lands is reported by the browser, so it has to be stored.
   */
  const [run, setRun] = useState(0);
  const [mated, setMated] = useState(false);
  const squares = useRef(new Map<string, HTMLDivElement>());
  const glow = useRef<HTMLSpanElement>(null);
  const spin = useRef<HTMLSpanElement>(null);

  /*
   * useLayoutEffect, not useEffect, because this positions elements and has to
   * do it before the browser paints. An effect runs after paint, which leaves
   * one frame where a piece about to move is drawn on its destination square.
   * The appearing delay hides that today; relying on it would be luck.
   *
   * On a replay it matters twice over. The cleanup cancels the last run's
   * animations, which drops the red square's held opacity and puts it back to
   * zero; the new run's fade-out starts it at full again. Both happen in the
   * same commit, before paint, so the square never blinks off in between.
   */
  useLayoutEffect(() => {
    if (!isVisible) return;

    /*
     * Reduced motion gets the same end state with no travel: duration and delay
     * collapse to zero, so the board is simply already mated. The blanket CSS
     * override in index.css cannot do this for us, because a script-driven
     * animation is not a CSS animation and that rule never reaches it. One code
     * path either way, which is the point of folding it into the timing.
     */
    const instant = prefersReducedMotion();
    /* Run 0 is the game as it plays on reveal. Anything after is a replay. */
    const isReplay = run > 0;
    const sooner = isReplay ? REPLAY_SOONER : 0;
    const running: Animation[] = [];
    /*
     * Cleared by the cleanup. A finish event is queued rather than delivered on
     * the spot, so one can still arrive after its run has been torn down, and
     * this is what stops it showing the button halfway through the next one.
     */
    let live = true;

    for (const move of SCHEDULE) {
      const node = squares.current.get(move.from);
      if (!node) continue;

      /*
       * One square, measured off the board rather than assumed: the wrapper is
       * exactly 12.5% of the field, so its own width is the unit the whole
       * board is drawn in. A board that has not been laid out yet has nothing
       * to travel across, so the piece simply stays where it rests.
       */
      const size = node.getBoundingClientRect().width;
      if (!size) continue;

      /*
       * The start point, as a pixel offset back from the destination. Pixels,
       * not percentages, because that is the whole fix: an absolute number
       * resolves to the same place for the compositor and for paint, so the
       * position the piece travels through and the position it is painted at
       * cannot disagree.
       */
      const dx = (fileOf(move.from) - fileOf(move.to)) * size;
      const dy = (rankOf(move.from) - rankOf(move.to)) * size;
      const { keyframes, delay, duration } = travel(
        move,
        `${dx}px ${dy}px`,
        isReplay,
      );

      running.push(
        node.animate(keyframes, {
          duration: instant ? 0 : duration,
          delay: instant ? 0 : delay,
          /*
           * backwards, and this is the part that matters. The animation moves
           * the `translate` property, which composes on top of the wrapper's
           * own `transform` instead of replacing it, so home is simply no
           * offset at all. A backwards fill applies the first keyframe during
           * the delay: on reveal that holds the piece on its starting square,
           * and on a replay the first keyframe is home, where it already is.
           * Once the animation is over it applies nothing, and the piece falls
           * back to its own style, which already puts it on the destination.
           * The last keyframe is home in both runs, so there is no held value
           * to hand back at the end.
           */
          fill: "backwards",
        }),
      );
    }

    if (glow.current) {
      if (isReplay) {
        running.push(
          glow.current.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: instant ? 0 : GLOW_OUT_MS,
            easing: "ease-out",
          }),
        );
      }

      /*
       * Made after the fade-out, so it sits above it in the composite order,
       * but with a forwards fill only: during its delay it contributes nothing,
       * and the fade-out underneath is what shows.
       */
      const mate = glow.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: instant ? 0 : MATE_MS,
        delay: instant ? 0 : MATE_AT - sooner,
        easing: "ease-out",
        fill: "forwards",
      });

      /*
       * The button appears when the mate has finished lighting up. With reduced
       * motion nothing plays, so there is nothing to replay and no listener: a
       * zero-length animation still finishes, and would otherwise offer a
       * button that does nothing you can see.
       */
      if (!instant) {
        mate.onfinish = () => {
          if (live) setMated(true);
        };
      }

      running.push(mate);
    }

    return () => {
      live = false;
      running.forEach((animation) => animation.cancel());
    };
  }, [isVisible, run]);

  /*
   * A click does two things. The spin is a one-off flourish on an element React
   * never renders differently, so it is started here, imperatively, in the
   * handler that caused it; an effect is for keeping in step with state, and
   * there is no state for "was just clicked". The replay itself is state: both
   * setters run in one event, so React batches them into a single render, and
   * that render's changed `run` is what re-runs the effect above.
   */
  function handleReplay() {
    spin.current?.animate([{ rotate: "0deg" }, { rotate: "360deg" }], {
      duration: 560,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
    setMated(false);
    setRun((count) => count + 1);
  }

  if (!PIECES) return null;

  return (
    /*
     * A grid, so the button and the caption can share the row under the board
     * while the figcaption stays the figure's last child, which is where HTML
     * wants it. The button's column is as wide as the button; the caption takes
     * the rest and keeps its right alignment. The row is the button's height
     * from the first paint, hidden or not, so nothing moves when it appears.
     */
    <figure className="grid w-full grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
      <div
        ref={ref}
        role="img"
        aria-label={label}
        className="relative col-span-2 aspect-square w-full"
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
                className="absolute flex h-[12.5%] w-[12.5%] items-center justify-center"
                style={squareStyle(restSquare(piece.square))}
              >
                {piece.square === MATED_KING ? (
                  /*
                   * Mounted from the start at zero opacity rather than added on
                   * mate: an element that appears already opaque has nothing to
                   * animate from. Its delay lets the queen finish her slide
                   * before the board lights up.
                   *
                   * inset-0 and square, so the red fills exactly the king's
                   * square: the wrapper it sits in is the square, 12.5% of the
                   * field. At 50% the wood grain shows through, so it reads
                   * as the square turning red rather than a red tile laid
                   * over the board.
                   */
                  <span
                    ref={glow}
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0"
                    style={{ background: "rgba(255, 59, 48, 0.5)" }}
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

      {/*
        Rendered from the first paint and hidden, rather than mounted on mate:
        like the red square, a button that arrives already visible has nothing
        to fade in from. relative for the glass rim, which is an absolutely
        positioned ::before.
      */}
      <button
        type="button"
        onClick={handleReplay}
        title={replayLabel}
        aria-label={replayLabel}
        className="liquid-glass liquid-glass-pill relative flex size-8 items-center justify-center rounded-full text-primary hover:bg-surface-elevated/60"
        style={mated ? REPLAY_SHOWN : REPLAY_HIDDEN}
      >
        {/*
          Centred on the circle, not on the glyph's box. The arrowhead pokes out
          above the ring, so the box's middle sits 2.44 units above the ring's
          centre (15.91 against 13.47, of 26.94). Lifting the glyph by that
          share of its own height, 9.04%, puts the ring in the middle of the
          button, and the origin at the ring's centre (59.04% down) makes the
          spin turn about the ring rather than wobble. Both in percentages of
          the glyph itself, so they hold at any size.
        */}
        <span
          ref={spin}
          className="block origin-[50%_59.04%] -translate-y-[9.04%]"
        >
          <ReplayMark className="block h-[15px] w-auto" />
        </span>
      </button>

      <figcaption className="text-right text-xs text-secondary">
        {caption}
      </figcaption>
    </figure>
  );
}
