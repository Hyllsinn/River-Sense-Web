export const species = [
  { id: "perca_fluviatilis", label: "Perche" },
  { id: "esox_lucius", label: "Brochet" },
  { id: "cyprinus_carpio", label: "Carpe" },
  { id: "sander_lucioperca", label: "Sandre" },
  { id: "tinca_tinca", label: "Tanche" },
] as const;

export type PreviewSpecies = (typeof species)[number]["id"];
export type PreviewEntry = { speciesId: PreviewSpecies; year: number; month: number };

export const year = 2026;
const [perche, brochet, carpe, sandre, tanche] = species;

// Fixed random draw for the demonstration, in calendar order.
const catchesByMonth = [
  [],
  [carpe],
  [carpe, sandre],
  [perche, perche, brochet],
  [perche, brochet, tanche, carpe, perche],
  [brochet, tanche, brochet, brochet, sandre, brochet, perche],
  [brochet, carpe, tanche, tanche, perche, brochet, carpe, perche],
  [brochet, carpe, brochet, carpe, tanche, brochet],
  [carpe, carpe, perche, sandre],
  [carpe, sandre, carpe],
  [perche, brochet],
  [],
];

export const entries: PreviewEntry[] = catchesByMonth.flatMap((catches, month) =>
  catches.map(({ id }) => ({ year, month, speciesId: id })),
);

export const counts = catchesByMonth.map((catches) => catches.length);
