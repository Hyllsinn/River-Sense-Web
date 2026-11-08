/** Fixed French display units; source measurements keep their native values. */
export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
const metric = (value: number | null | undefined, unit: string, digits: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? `${formatNumber(value, digits)} ${unit}`
    : "—";
export const formatFlow = (value: number | null | undefined) => metric(value, "m³/s", 2);
export const formatLevel = (value: number | null | undefined) => metric(value, "m", 2);
export const formatRain = (value: number | null | undefined) => metric(value, "mm", 1);
export const formatWind = (value: number | null | undefined) => metric(value, "km/h", 0);
