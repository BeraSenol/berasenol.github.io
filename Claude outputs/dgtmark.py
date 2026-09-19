import re
p = 'src/components/TechMarks.tsx'
s = open(p).read()

mark = '''
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
'''

assert 'DgtMark' not in s
s = s.rstrip('\n') + '\n' + mark
open(p, 'w').write(s)

p = 'src/components/DgtStudio.tsx'
s = open(p).read()
old = '''import {
  MacOsMark,'''
new = '''import {
  DgtMark,
  MacOsMark,'''
assert s.count(old) == 1
s = s.replace(old, new)

old = '''  { label: "Stockfish", node: <StockfishMark className="h-11 w-auto" /> },
];'''
new = '''  { label: "Stockfish", node: <StockfishMark className="h-11 w-auto" /> },
  { label: "DGT board", node: <DgtMark className="h-7 w-auto" /> },
];'''
assert s.count(old) == 1
open(p, 'w').write(s.replace(old, new))
print('ok')
