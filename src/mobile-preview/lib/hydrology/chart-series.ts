import type { Point } from "./types";

/** Partitionne les mesures brutes : aucune fenêtre de lissage ne franchit un trou. */
export function splitChartPoints(points: Point[], gapThresholdHours = 24): Point[][] {
  const thresholdMs = gapThresholdHours * 3_600_000;
  const segments: Point[][] = [];
  let current: Point[] | undefined;
  let last: number | undefined;
  for (const point of points) {
    const time = Date.parse(point.time);
    if (!Number.isFinite(time) || !Number.isFinite(point.value)) {
      current = undefined;
      last = undefined;
      continue;
    }
    if (!current || (last !== undefined && (time < last || time - last >= thresholdMs))) {
      current = [];
      segments.push(current);
    }
    current.push(point);
    last = time;
  }
  return segments;
}

/**
 * Réduit les oscillations courtes dans le graphique sans modifier les mesures
 * brutes ni les séries utilisées par les moteurs hydrologiques.
 */
export function smoothForDisplay(
  points: Point[],
  windowHours: number,
  sampleEveryHours: number,
): Point[] {
  if (points.length < 3) return points;
  // The fast path requires chronological, finite observations. Keep the legacy
  // calculation for malformed inputs rather than silently reorder business data.
  const times = points.map((point) => Date.parse(point.time));
  const ordered = times.every(
    (time, index) =>
      Number.isFinite(time) &&
      Number.isFinite(points[index]!.value) &&
      (index === 0 || time >= times[index - 1]!),
  );
  const sums = [0];
  if (ordered) {
    for (const point of points) sums.push(sums.at(-1)! + point.value);
  }
  const indexed = ordered && sums.every(Number.isFinite);
  // Independent binary searches preserve the centered-to-trailing transition:
  // the left boundary can move backwards near the end of the series.
  const bound = (target: number, inclusive: boolean): number => {
    let low = 0;
    let high = times.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (times[middle]! < target || (inclusive && times[middle] === target)) low = middle + 1;
      else high = middle;
    }
    return low;
  };
  const windowMs = windowHours * 3_600_000;
  const stepMs = Math.max(1, sampleEveryHours) * 3_600_000;
  const lastTime = times.at(-1)!;
  let nextSample = times[0]!;
  const result: Point[] = [];

  for (const [index, point] of points.entries()) {
    const time = times[index]!;
    if (!Number.isFinite(time) || (time < nextSample && time !== lastTime)) continue;
    const centeredEnd = time + windowMs / 2;
    const from = centeredEnd <= lastTime ? time - windowMs / 2 : time - windowMs;
    const to = centeredEnd <= lastTime ? centeredEnd : time;
    if (indexed && Number.isFinite(from) && Number.isFinite(to)) {
      const left = bound(from, false);
      const right = bound(to, true);
      if (right > left) {
        result.push({ ...point, value: (sums[right]! - sums[left]!) / (right - left) });
      }
    } else {
      const values = points.filter(
        (_, candidate) => times[candidate]! >= from && times[candidate]! <= to,
      );
      if (values.length) {
        result.push({
          ...point,
          value: values.reduce((sum, item) => sum + item.value, 0) / values.length,
        });
      }
    }
    nextSample = time + stepMs;
  }
  return result;
}
