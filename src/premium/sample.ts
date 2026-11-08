export const species = [
  { id: "perca_fluviatilis", label: "Perche" },
  { id: "esox_lucius", label: "Brochet" },
  { id: "cyprinus_carpio", label: "Carpe" },
] as const;

export type PreviewSpecies = (typeof species)[number]["id"];
export type PreviewEntry = { speciesId: PreviewSpecies; year: number; month: number };

export const year = 2026;
const totals = [0, 1, 2, 3, 5, 7, 8, 6, 4, 3, 2, 0];
const speciesOrder = [
  "perca_fluviatilis",
  "esox_lucius",
  "perca_fluviatilis",
  "cyprinus_carpio",
] as const;

export const entries: PreviewEntry[] = totals.flatMap((count, month) =>
  Array.from({ length: count }, (_, index) => ({
    year,
    month,
    speciesId: speciesOrder[(index + month) % speciesOrder.length]!,
  })),
);

export const counts = totals.map(
  (_, month) => entries.filter((entry) => entry.month === month).length,
);
