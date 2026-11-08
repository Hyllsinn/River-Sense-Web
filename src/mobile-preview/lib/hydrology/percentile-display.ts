import type { Point } from "./types";

/**
 * Convertit l'écart au niveau médian en position percentile pour l'affichage.
 * P25 et P75 proviennent du référentiel historique propre à la station.
 */
export function levelPointsAsPercentiles(points: Point[], p25: number, p75: number): Point[] {
  const lowerSpan = Math.abs(p25);
  if (!(p25 < 0) || !(p75 > 0) || lowerSpan === 0) return [];

  return points.map((point) => {
    const percentile =
      point.value <= 0 ? 50 + 25 * (point.value / lowerSpan) : 50 + 25 * (point.value / p75);
    return {
      ...point,
      value: Math.min(100, Math.max(0, percentile)),
    };
  });
}

/**
 * Conversion inverse destinée aux libellés : l'axe reste positionné par
 * percentile mais présente l'écart au niveau médian en mètres.
 */
export function percentileAsRelativeMeters(percentile: number, p25: number, p75: number): number {
  const bounded = Math.min(100, Math.max(0, percentile));
  const relativeCm =
    bounded <= 50 ? ((bounded - 50) / 25) * Math.abs(p25) : ((bounded - 50) / 25) * p75;
  return relativeCm / 100;
}

/**
 * Zoom borné qui conserve toujours P25 et P75, puis s'élargit pour contenir
 * toute la série avec une petite marge. Les limites restent dans P0–P100.
 */
export function percentileDisplayDomain(points: Point[]): [number, number] {
  const values = points.map((point) => point.value).filter((value) => Number.isFinite(value));
  const minimum = Math.min(25, ...values);
  const maximum = Math.max(75, ...values);
  const padding = Math.max(5, (maximum - minimum) * 0.08);
  const low = Math.max(0, Math.floor((minimum - padding) / 5) * 5);
  const high = Math.min(100, Math.ceil((maximum + padding) / 5) * 5);
  return [low, high];
}
