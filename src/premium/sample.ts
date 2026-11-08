export const species = [
  { id: "perca_fluviatilis", label: "Perche" },
  { id: "esox_lucius", label: "Brochet" },
  { id: "cyprinus_carpio", label: "Carpe" },
  { id: "sander_lucioperca", label: "Sandre" },
  { id: "tinca_tinca", label: "Tanche" },
  { id: "salmo_trutta", label: "Truite fario" },
  { id: "squalius_cephalus", label: "Chevesne" },
  { id: "barbus_barbus", label: "Barbeau" },
] as const;

export type PreviewSpecies = (typeof species)[number]["id"];
export type PreviewEntry = {
  speciesId: PreviewSpecies;
  year: number;
  month: number;
  caughtAt: string;
};

export const year = 2026;
const [perche, brochet, carpe, sandre, tanche, truite, chevesne, barbeau] = species;

// Fixed draw without replacement in each month to show a varied journal.
const catchesByMonth = [
  [],
  [perche],
  [chevesne, barbeau],
  [carpe, sandre, tanche],
  [barbeau, tanche, chevesne, sandre, truite],
  [tanche, carpe, truite, barbeau, perche, chevesne, brochet],
  [sandre, carpe, truite, chevesne, barbeau, brochet, perche, tanche],
  [sandre, perche, tanche, barbeau, truite, carpe],
  [chevesne, sandre, barbeau, brochet],
  [brochet, tanche, barbeau],
  [perche, barbeau],
  [],
];

export const entries: PreviewEntry[] = catchesByMonth.flatMap((catches, month) =>
  catches.map(({ id }, index) => ({
    year,
    month,
    speciesId: id,
    caughtAt: new Date(
      Date.UTC(year, month, (catches.length - index) * 3, 7 + (index % 4), (15 + index * 13) % 60),
    ).toISOString(),
  })),
);

export const counts = catchesByMonth.map((catches) => catches.length);
