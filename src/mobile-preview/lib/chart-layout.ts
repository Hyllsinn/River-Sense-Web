/** Shared plot gutters align activity and station charts at every screen width. */
export const CHART_SIDE_SPACE = 24;

const compactNumber = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
  useGrouping: false,
});
const axisNumber = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
  useGrouping: false,
});

/** Units live in headings; tooltips keep their original full values and units. */
export function formatAxisNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const normalized = Math.abs(value) < 0.005 ? 0 : value;
  const formatter = Math.abs(normalized) >= 1000 ? compactNumber : axisNumber;
  return formatter.format(normalized).replace(/[\s\u00a0\u202f]/g, "");
}
