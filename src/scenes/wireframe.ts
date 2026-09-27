import { mix, rgba, smoothstep, type RGB, type Scene, type SceneFrame } from "./scene";

/**
 * A wireframe viewport: a geodesic sphere over a ground grid, with the camera
 * slowly circling it, the way an editor viewport looks in wireframe mode.
 *
 * Behind the Unreal Engine card, in the Pro colours that card's title uses.
 * No 3D library: a perspective camera is a dozen lines of vector maths, and
 * everything here is lines, so the canvas's own line drawing is enough.
 */

type Vec3 = readonly [number, number, number];

const TAU = Math.PI * 2;

/** One full circle of the camera, one turn of the sphere, one float up and down. */
const ORBIT_SECONDS = 70;
const SPIN_SECONDS = 30;
const BOB_SECONDS = 7;

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (a: Vec3): Vec3 => {
  const length = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / length, a[1] / length, a[2] / length];
};
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/**
 * A unit sphere made of triangles: an icosahedron, each face split into four
 * and the new corners pushed out to the surface, `levels` times over. Only
 * the edges are kept, once each, since that is all a wireframe draws.
 */
function geodesicSphere(levels: number) {
  const g = (1 + Math.sqrt(5)) / 2;
  const vertices: Vec3[] = (
    [
      [-1, g, 0], [1, g, 0], [-1, -g, 0], [1, -g, 0],
      [0, -1, g], [0, 1, g], [0, -1, -g], [0, 1, -g],
      [g, 0, -1], [g, 0, 1], [-g, 0, -1], [-g, 0, 1],
    ] as const
  ).map(normalize);
  let faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const key = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);

  for (let level = 0; level < levels; level++) {
    // Neighbouring faces share an edge, so each midpoint is made once and reused.
    const midpoints = new Map<string, number>();
    const midpoint = (a: number, b: number) => {
      const known = midpoints.get(key(a, b));
      if (known !== undefined) return known;
      vertices.push(normalize(lerp3(vertices[a], vertices[b], 0.5)));
      midpoints.set(key(a, b), vertices.length - 1);
      return vertices.length - 1;
    };
    faces = faces.flatMap(([a, b, c]): [number, number, number][] => {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]];
    });
  }

  const edges = new Map<string, readonly [number, number]>();
  for (const [a, b, c] of faces) {
    for (const [p, q] of [[a, b], [b, c], [c, a]] as const) edges.set(key(p, q), [p, q]);
  }
  return { vertices, edges: [...edges.values()] };
}

// Built once, when the module loads: 162 corners, 480 edges.
const SPHERE = geodesicSphere(2);
const SPHERE_CENTRE: Vec3 = [0, 1.15, 0];

/** The grid runs from -GRID to GRID on both axes, one line per unit. */
const GRID = 7;

/** Lines closer than this to the camera are cut off, as a real camera's near plane does. */
const NEAR = 0.4;

/*
 * The canvas is fastest when it strokes many lines as one path. So lines are
 * sorted into a few buckets by how bright they should be, and each bucket is
 * one path with one colour: 32 strokes a frame, 16 for the grid and 16 for
 * the sphere, rather than one for each of close to a thousand lines.
 */
const BUCKETS = 16;

function draw(ctx: CanvasRenderingContext2D, { width, height, time, palette }: SceneFrame) {
  const unit = Math.min(width * 0.5, height * 1.1);

  // The camera circles the sphere, a little above it, looking slightly down.
  const angle = 0.7 + (TAU * time) / ORBIT_SECONDS;
  const eye: Vec3 = [Math.sin(angle) * 6.4, 2.2, Math.cos(angle) * 6.4];
  const target = SPHERE_CENTRE;
  const forward = normalize(sub(target, eye));
  const right = normalize(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);

  /*
   * Where the sphere lands on the card, and the lens: a focal length in
   * pixels. Bottom right, where the card has the least text over it.
   */
  const centreX = width - 0.2 * unit;
  const centreY = height - 0.24 * unit;
  const focal = 0.9 * unit;

  /** A point in camera space: across, up, and distance ahead. */
  const view = (p: Vec3): Vec3 => {
    const d = sub(p, eye);
    return [dot(d, right), dot(d, up), dot(d, forward)];
  };
  const screen = (c: Vec3): [number, number] => [
    centreX + (focal * c[0]) / c[2],
    centreY - (focal * c[1]) / c[2],
  ];

  const paths = Array.from({ length: BUCKETS }, () => new Path2D());

  /** Queues the line from a to b (camera space) at a brightness from 0 to 1. */
  const line = (a: Vec3, b: Vec3, level: number) => {
    if (level <= 0.02) return;
    // Clip to the near plane, or drop the line if it is wholly behind it.
    if (a[2] < NEAR && b[2] < NEAR) return;
    if (a[2] < NEAR) a = lerp3(a, b, (NEAR - a[2]) / (b[2] - a[2]));
    if (b[2] < NEAR) b = lerp3(b, a, (NEAR - b[2]) / (a[2] - b[2]));
    const path = paths[Math.min(BUCKETS - 1, Math.floor(level * BUCKETS))];
    const [ax, ay] = screen(a);
    const [bx, by] = screen(b);
    path.moveTo(ax, ay);
    path.lineTo(bx, by);
  };

  const flush = (tint: (level: number) => RGB, alpha: (level: number) => number) => {
    for (let i = 0; i < BUCKETS; i++) {
      const level = (i + 0.5) / BUCKETS;
      ctx.strokeStyle = rgba(tint(level), alpha(level));
      ctx.stroke(paths[i]);
      paths[i] = new Path2D();
    }
  };

  ctx.lineWidth = 1;

  /*
   * The ground grid. Each line is cut into unit steps so every step can fade
   * on its own: towards the grid's edge, so it has no hard border, and with
   * distance from the camera, like fog. The two lines through the origin are
   * brighter, as a viewport's axis lines are.
   */
  for (let i = -GRID; i <= GRID; i++) {
    for (let j = -GRID; j < GRID; j++) {
      const axis = i === 0 ? 1.8 : 1;
      for (const [p, q] of [
        [[i, 0, j], [i, 0, j + 1]],
        [[j, 0, i], [j + 1, 0, i]],
      ] as const) {
        const mid = lerp3(p, q, 0.5);
        const edge = smoothstep(GRID, GRID - 3, Math.hypot(mid[0], mid[2]));
        const a = view(p);
        const b = view(q);
        const fog = smoothstep(15, 5, (a[2] + b[2]) / 2);
        line(a, b, Math.min(1, 0.55 * axis * edge * fog));
      }
    }
  }
  flush(() => palette.ink, (level) => 0.24 * level);

  /*
   * A ring on the ground under the sphere, where its shadow would fall. It is
   * drawn with the sphere, at the brightness of the sphere's middle.
   */
  const ring = 72;
  for (let s = 0; s < ring; s++) {
    const a0 = (TAU * s) / ring;
    const a1 = (TAU * (s + 1)) / ring;
    line(view([Math.cos(a0), 0, Math.sin(a0)]), view([Math.cos(a1), 0, Math.sin(a1)]), 0.5);
  }

  /*
   * The sphere turns on its own axis, tilted, faster than the camera goes
   * round, so its triangles slide past each other instead of the whole mesh
   * turning as one. And it floats: a few hundredths up and down.
   */
  const spin = (TAU * time) / SPIN_SECONDS;
  const [sinSpin, cosSpin] = [Math.sin(spin), Math.cos(spin)];
  const [sinTilt, cosTilt] = [Math.sin(0.4), Math.cos(0.4)];
  const centre: Vec3 = [
    SPHERE_CENTRE[0],
    SPHERE_CENTRE[1] + 0.06 * Math.sin((TAU * time) / BOB_SECONDS),
    SPHERE_CENTRE[2],
  ];
  const centreDepth = view(centre)[2];
  const points = SPHERE.vertices.map(([x, y, z]) => {
    const x1 = x * cosSpin + z * sinSpin; // about the vertical axis
    const z1 = z * cosSpin - x * sinSpin;
    const y2 = y * cosTilt - z1 * sinTilt; // then tipped forward
    const z2 = z1 * cosTilt + y * sinTilt;
    return view([centre[0] + x1, centre[1] + y2, centre[2] + z2]);
  });
  /*
   * Nearer edges are brighter and lighter in colour, farther ones deeper
   * and fainter, so the front of the mesh reads in front of the back without
   * hiding either.
   */
  for (const [p, q] of SPHERE.edges) {
    const a = points[p];
    const b = points[q];
    const depth = (a[2] + b[2]) / 2 - centreDepth; // -1 at the front of the sphere, 1 at the back
    line(a, b, Math.max(0.03, 0.5 - 0.5 * depth));
  }
  flush(
    (level) => mix(palette.proDeep, palette.proLight, level),
    (level) => 0.05 + 0.4 * level,
  );
}

export const wireframe: Scene = { draw, stillTime: 9 };
