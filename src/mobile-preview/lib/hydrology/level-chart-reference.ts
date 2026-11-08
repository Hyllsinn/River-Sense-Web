import type { HydroPart, Point } from "./types";
import { levelPointsAsPercentiles, percentileDisplayDomain } from "./percentile-display";

export const RECENT_LEVEL_MIN_HOURS = 24;
const HOUR = 3_600_000;
const WINDOW = 120 * HOUR;

export type LevelChartReference = {
  kind: "historical" | "recent";
  scale: "percentile" | "relative_cm" | "height_cm";
  points: Point[];
  /** Heights in cm relative to this reference's P50, before display smoothing. */
  relativePoints: Point[];
  p25: number;
  p75: number;
  domain: [number, number];
  ticks?: number[];
  from?: string;
  to?: string;
  sampleCount?: number;
};

/** Same linear interpolation as the historical NumPy quantiles, including real ties. */
export function linearQuantile(sorted: readonly number[], fraction: number): number {
  const position = (sorted.length - 1) * fraction;
  const low = Math.floor(position),
    high = Math.ceil(position);
  return sorted[low]! + (sorted[high]! - sorted[low]!) * (position - low);
}

function domain(points: Point[], p25: number, p75: number): [number, number] {
  const values = points.map((p) => p.value).filter(Number.isFinite);
  const low = Math.min(p25, ...values),
    high = Math.max(p75, ...values);
  const padding = Math.max(1, (high - low) * 0.08);
  return [low - padding, high + padding];
}

/**
 * Display-only reference. Never enters H/Q acquisition, station routing or fish activity.
 * Historical quartiles keep their existing scale when no point would be clipped.
 * Zero spans or values beyond the display transform use exact relative centimetres.
 */
export function levelChartReference(part: HydroPart | undefined): LevelChartReference | null {
  if (!part) return null;
  const relative = part.relative;
  if (
    relative &&
    Number.isFinite(relative.p25) &&
    Number.isFinite(relative.p75) &&
    relative.p25 <= 0 &&
    relative.p75 >= 0 &&
    Array.isArray(relative.points) &&
    relative.points.length &&
    relative.points.every((p) => Number.isFinite(p.value) && Number.isFinite(Date.parse(p.time)))
  ) {
    const percentiles = levelPointsAsPercentiles(relative.points, relative.p25, relative.p75);
    const fitsPercentileScale = relative.points.every(
      (p) => p.value >= 2 * relative.p25 && p.value <= 2 * relative.p75,
    );
    if (percentiles.length && fitsPercentileScale)
      return {
        kind: "historical",
        scale: "percentile",
        points: percentiles,
        relativePoints: relative.points,
        p25: 25,
        p75: 75,
        domain: percentileDisplayDomain(percentiles),
        ticks: [25, 75],
      };
    return {
      kind: "historical",
      scale: "relative_cm",
      points: relative.points,
      relativePoints: relative.points,
      p25: relative.p25,
      p75: relative.p75,
      domain: domain(relative.points, relative.p25, relative.p75),
    };
  }
  const recent = recentLevelQuantiles(part.points, part.end);
  if (!recent) return null;
  return {
    kind: "recent",
    scale: "height_cm",
    points: part.points,
    relativePoints: part.points.map((point) => ({ ...point, value: point.value - recent.p50 })),
    p25: recent.p25,
    p75: recent.p75,
    domain: domain(part.points, recent.p25, recent.p75),
    from: recent.from,
    to: recent.to,
    sampleCount: recent.sampleCount,
  };
}

/**
 * Empirical quartiles of the latest continuous measured window (at most five days).
 * One last real sample per UTC hour prevents dense sampling from overweighting an hour.
 * A >=24-hour gap, a reversed timestamp or an invalid point starts a new segment.
 * Conflicting duplicate timestamps reject the reference; missing measurements are never imputed.
 */
export function recentLevelQuantiles(
  points: readonly Point[],
  end: string,
): {
  p25: number;
  p50: number;
  p75: number;
  from: string;
  to: string;
  sampleCount: number;
} | null {
  const finish = Date.parse(end);
  if (!Number.isFinite(finish)) return null;
  let segment: { time: number; value: number }[] = [];
  let last: number | undefined;
  const timestamps = new Map<number, number>();
  for (const point of points) {
    const time = Date.parse(point.time);
    if (!Number.isFinite(time) || !Number.isFinite(point.value)) {
      segment = [];
      last = undefined;
      continue;
    }
    if (time > finish || time < finish - WINDOW) continue;
    if (timestamps.has(time) && timestamps.get(time) !== point.value) return null;
    timestamps.set(time, point.value);
    if (last !== undefined && (time < last || time - last >= 24 * HOUR)) segment = [];
    if (time !== last) segment.push({ time, value: point.value });
    last = time;
  }
  const hours = new Map<number, { time: number; value: number }>();
  for (const point of segment) hours.set(Math.floor(point.time / HOUR), point);
  const sampled = [...hours.values()];
  if (
    sampled.length < RECENT_LEVEL_MIN_HOURS ||
    sampled.at(-1)!.time - sampled[0]!.time < 23 * HOUR
  )
    return null;
  const sorted = sampled.map((p) => p.value).sort((a, b) => a - b);
  return {
    p25: linearQuantile(sorted, 0.25),
    p50: linearQuantile(sorted, 0.5),
    p75: linearQuantile(sorted, 0.75),
    sampleCount: sampled.length,
    from: new Date(sampled[0]!.time).toISOString(),
    to: new Date(sampled.at(-1)!.time).toISOString(),
  };
}
