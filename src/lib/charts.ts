export type Point = readonly [x: number, y: number];

/** Point on axis `index` of `count`, starting at 12 o'clock and going clockwise. */
export function polarPoint(cx: number, cy: number, radius: number, index: number, count: number): Point {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

export function toPointsAttr(points: readonly Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

export function radarPoints(values: readonly number[], max: number, cx: number, cy: number, radius: number): Point[] {
  return values.map((v, i) => polarPoint(cx, cy, (Math.min(Math.max(v, 0), max) / max) * radius, i, values.length));
}

export interface SparklineGeometry {
  points: Point[];
  line: string;
  area: string;
}

/** Evenly spaced points scaled into a `width`×`height` box inset by `pad`. */
export function sparkline(values: readonly number[], width: number, height: number, min: number, max: number, pad = 4): SparklineGeometry {
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;
  const points: Point[] = values.map((v, i) => [
    values.length > 1 ? pad + i * step : width / 2,
    pad + innerH - ((Math.min(Math.max(v, min), max) - min) / (max - min)) * innerH,
  ]);
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = points.length
    ? `${line} L${points[points.length - 1][0].toFixed(1)} ${height - pad} L${points[0][0].toFixed(1)} ${height - pad} Z`
    : '';
  return { points, line, area };
}
