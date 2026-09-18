import { useEffect, useState } from 'react'
import board from '../assets/chessboard.webp'
import bB from '../assets/pieces/bB.svg'
import bK from '../assets/pieces/bK.svg'
import bN from '../assets/pieces/bN.svg'
import bP from '../assets/pieces/bP.svg'
import bQ from '../assets/pieces/bQ.svg'
import bR from '../assets/pieces/bR.svg'
import wB from '../assets/pieces/wB.svg'
import wK from '../assets/pieces/wK.svg'
import wN from '../assets/pieces/wN.svg'
import wP from '../assets/pieces/wP.svg'
import wQ from '../assets/pieces/wQ.svg'
import wR from '../assets/pieces/wR.svg'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useReveal } from '../hooks/useReveal'

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
  K: wK, Q: wQ, R: wR, B: wB, N: wN, P: wP,
  k: bK, q: bQ, r: bR, b: bB, n: bN, p: bP,
}

/**
 * The start position, and the shortest checkmate there is: 1.f3 e5 2.g4 Qh4#.
 *
 * Position and moves live together here rather than in the content files. They
 * are one unit, not copy: a FEN edited in one locale and not the other, or
 * edited without the moves, would silently produce a game that does not happen.
 */
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

const MOVES = [
  { from: 'f2', to: 'f3' },
  { from: 'e7', to: 'e5' },
  { from: 'g2', to: 'g4' },
  { from: 'd8', to: 'h4' },
] as const

/**
 * Who gets mated. The queen lands on h4 and the diagonal h4-g3-f2-e1 is open,
 * because f2 walked to f3 on the first move: nothing blocks, nothing captures
 * her, and the king has no square. White's king never moves, so its id is still
 * its starting square.
 */
const MATED_KING = 'e1'

/* The last piece lands at 420 + 14 x 45, so the first move is a second after that. */
const APPEAR_BASE = 420
const APPEAR_STEP = 45
const FIRST_MOVE = 2050
const MOVE_INTERVAL = 900

type Piece = { id: string; code: string; square: string }

/**
 * Builds the pieces from a FEN placement field, or null if it is malformed.
 *
 * Each piece is identified by the square it started on. That id is what React
 * tracks the piece by across renders, so it has to be stable for the whole
 * sequence; the square it currently stands on is not, since that is the thing
 * that changes.
 *
 * Content is authored by hand, so a bad FEN is a typo, not an exception worth
 * throwing during render; the section draws nothing rather than crashing the
 * page around it.
 */
function startingPieces(placement: string): Piece[] | null {
  const ranks = placement.split('/')
  if (ranks.length !== 8) return null

  const pieces: Piece[] = []

  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    let fileIndex = 0

    for (const char of ranks[rankIndex] ?? '') {
      if (char >= '1' && char <= '8') {
        fileIndex += Number(char)
        continue
      }
      if (!PIECE[char] || fileIndex > 7) return null

      const square = `${'abcdefgh'[fileIndex]}${8 - rankIndex}`
      pieces.push({ id: square, code: char, square })
      fileIndex += 1
    }

    if (fileIndex !== 8) return null
  }

  return pieces
}

/**
 * The position after n plies, derived from the start rather than stored.
 *
 * Storing a position and mutating it would mean two sources of truth for the
 * same thing, and replaying from a number keeps the timeline trivially
 * reversible: every value of `plies` maps to exactly one board.
 */
function positionAfter(pieces: Piece[], plies: number): Piece[] {
  let current = pieces

  for (let i = 0; i < plies; i += 1) {
    const move = MOVES[i]
    if (!move) break
    current = current
      .filter((piece) => piece.square !== move.to)
      .map((piece) => (piece.square === move.from ? { ...piece, square: move.to } : piece))
  }

  return current
}

const fileOf = (square: string) => square.charCodeAt(0) - 97
const rankOf = (square: string) => 8 - Number(square[1])

/*
 * Where the playing field sits inside the photograph, as a fraction of the
 * image. Measured off the source at 2000px: the light/dark boundaries fall at
 * 209, 407, 605, 802, 1000, 1198, 1395 and 1593, which is a square of 197.7px
 * starting at 209, so the field runs 209 to 1790.6.
 */
const FIELD_INSET = '10.45%'
const FIELD_SIZE = '79.09%'

export function Chessboard({ label }: { label: string }) {
  /*
   * Both hooks run before the early return below. React identifies a hook by its
   * call order, so a hook sitting behind a conditional return is called on some
   * renders and not others, and every later hook shifts position with it.
   */
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  /*
   * Reduced motion starts on the finished position rather than playing a fast
   * version of it: index.css collapses every duration to nothing, so playing it
   * anyway would teleport pieces around the board four times, which is the
   * effect that setting exists to prevent.
   */
  const [plies, setPlies] = useState(() => (prefersReducedMotion() ? MOVES.length : 0))

  useEffect(() => {
    if (!isVisible) return

    if (prefersReducedMotion()) return

    /*
     * A timer per move rather than a chain, so each one is scheduled from the
     * same origin and a slow frame cannot make the gaps drift. Subscribing to
     * something outside React and cleaning it up is what an effect is for; this
     * is not derived state.
     */
    const timers = MOVES.map((_, index) =>
      window.setTimeout(() => setPlies(index + 1), FIRST_MOVE + index * MOVE_INTERVAL),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [isVisible])

  const pieces = startingPieces(START)
  if (!pieces) return null

  const isMate = plies === MOVES.length

  return (
    <figure className="w-full">
      <div ref={ref} role="img" aria-label={label} className="relative aspect-square w-full">
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
          style={{ left: FIELD_INSET, top: FIELD_INSET, width: FIELD_SIZE, height: FIELD_SIZE }}
        >
          {positionAfter(pieces, plies).map((piece) => {
            /*
             * Pieces arrive in a diagonal sweep from a1, the way you set a board
             * up: the delay grows with the distance from that corner.
             */
            const file = fileOf(piece.square)
            const rank = rankOf(piece.square)
            const step = 7 - rankOf(piece.id) + fileOf(piece.id)

            return (
              /*
               * Keyed by the piece, never by the square. A key is React's handle
               * on identity: key the square and every move unmounts one node and
               * mounts another, the browser sees two different elements rather
               * than one that moved, and there is nothing to transition. Keyed by
               * the piece, the same DOM node survives and only its transform
               * changes, which is what the animation rides on.
               *
               * Two nested elements because they animate different things at
               * different times: the wrapper's transform is the square it stands
               * on, the image's is the scale it arrives at. One element would
               * make the appearing stagger delay apply to every later move.
               */
              <div
                key={piece.id}
                className="absolute left-0 top-0 flex h-[12.5%] w-[12.5%] items-center justify-center transition-transform duration-[450ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
                style={{ transform: `translate(${file * 100}%, ${rank * 100}%)` }}
              >
                {piece.id === MATED_KING ? (
                  /*
                   * Mounted from the start at zero opacity rather than added on
                   * mate: an element that appears already opaque has nothing to
                   * transition from. The delay lets the queen finish her slide
                   * before the board lights up.
                   */
                  <span
                    aria-hidden="true"
                    className="absolute inset-[-12%] rounded-full transition-opacity duration-700"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(255,59,48,0.65) 0%, rgba(255,59,48,0.3) 42%, rgba(255,59,48,0) 70%)',
                      opacity: isMate ? 1 : 0,
                      transitionDelay: isMate ? '450ms' : '0ms',
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
                    transform: isVisible ? 'scale(1)' : 'scale(0.55)',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </figure>
  )
}
