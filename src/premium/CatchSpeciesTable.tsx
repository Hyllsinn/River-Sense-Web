import { Fish } from "lucide-react";
import type { CSSProperties } from "react";
import { FISH_SPECIES_IMAGES } from "../mobile-preview/snapshot";
import type { PreviewEntry, PreviewSpecies } from "./sample";

// Natural palette and portrait crops from the River’Sense catch journal.
const SPECIES_BAR_COLORS: Record<PreviewSpecies, string> = {
  cyprinus_carpio: "#C69B58",
  esox_lucius: "#718752",
  perca_fluviatilis: "#A4B45D",
};

const IMAGE_BOUNDS: Record<
  string,
  { width: number; height: number; left: number; top: number; ratio: number }
> = {
  perca_fluviatilis: {
    width: 176.79558011049724,
    height: 125.66371681415929,
    left: -38.39779005524862,
    top: -16.8141592920354,
    ratio: 1.6017699115044248,
  },
  cyprinus_carpio: {
    width: 128.5140562248996,
    height: 112.6984126984127,
    left: -14.257028112449799,
    top: -5.952380952380952,
    ratio: 1.9761904761904763,
  },
  esox_lucius: {
    width: 111.49825783972125,
    height: 123.47826086956522,
    left: -6.2717770034843205,
    top: -15.217391304347828,
    ratio: 2.4956521739130433,
  },
};

export function CatchSpeciesTable({
  entries,
  year,
  species,
}: {
  entries: readonly PreviewEntry[];
  year: number;
  species: readonly { id: PreviewSpecies; label: string }[];
}) {
  const counts = new Map<PreviewSpecies, number>();
  for (const entry of entries) {
    if (entry.year === year) counts.set(entry.speciesId, (counts.get(entry.speciesId) ?? 0) + 1);
  }
  const rows = species
    .map((entry) => ({ ...entry, count: counts.get(entry.id) ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "fr"));
  const max = Math.max(1, ...rows.map((entry) => entry.count));
  // Four regular intervals, like the annual chart; totals appear beside the bars.
  const guides = [0, 25, 50, 75, 100];
  // Keep the base size from eight species upward; enlarge gradually to 1.5× for one.
  const imageScale = 1 + Math.max(0, 8 - Math.max(1, rows.length)) / 14;

  return (
    <div
      role="region"
      aria-label={`Prises par espèce en ${year}`}
      tabIndex={0}
      className="max-h-[26rem] overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <table
        className="w-full table-fixed border-collapse text-left"
        aria-label={`Espèces pêchées en ${year}`}
        style={
          {
            "--fish-scale": imageScale,
            "--fish-width": "clamp(4.75rem, 24vw, 7rem)",
            "--count-space": `${String(max).length * 0.5 + 0.25}rem`,
          } as CSSProperties
        }
      >
        <colgroup>
          <col className="w-[calc(var(--fish-width)_+_0.25rem)]" />
          <col />
        </colgroup>
        <thead className="sr-only">
          <tr>
            <th scope="col" className="p-0">
              <span className="sr-only">Espèce</span>
            </th>
            <th scope="col" className="p-0 font-normal">
              Prises
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry) => (
            <tr key={entry.id}>
              <th scope="row" aria-label={entry.label} className="p-0 pr-1 font-normal">
                <span
                  className="flex h-[calc(2.109375rem*var(--fish-scale))] w-[var(--fish-width)] shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {FISH_SPECIES_IMAGES[entry.id] && IMAGE_BOUNDS[entry.id] ? (
                    <span
                      className="relative block overflow-hidden"
                      style={{
                        width: `min(100%, calc(2.109375rem * var(--fish-scale) * ${IMAGE_BOUNDS[entry.id]!.ratio}))`,
                        aspectRatio: IMAGE_BOUNDS[entry.id]!.ratio,
                      }}
                    >
                      <img
                        src={FISH_SPECIES_IMAGES[entry.id]}
                        alt=""
                        width={80}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="absolute max-w-none"
                        style={{
                          width: `${IMAGE_BOUNDS[entry.id]!.width}%`,
                          height: `${IMAGE_BOUNDS[entry.id]!.height}%`,
                          left: `${IMAGE_BOUNDS[entry.id]!.left}%`,
                          top: `${IMAGE_BOUNDS[entry.id]!.top}%`,
                        }}
                      />
                    </span>
                  ) : (
                    <Fish className="size-5 text-primary" />
                  )}
                </span>
              </th>
              <td className="relative p-0 pr-[var(--count-space)] align-middle">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 right-[var(--count-space)]"
                >
                  {guides.map((position) => (
                    <span
                      key={position}
                      className="absolute inset-y-0 border-l border-dashed border-border/60"
                      style={position === 100 ? { right: 0 } : { left: `${position}%` }}
                    />
                  ))}
                </div>
                <div className="relative h-1.5">
                  <div
                    data-species-bar
                    className="relative h-full rounded-full"
                    style={{
                      width: `${(entry.count / max) * 100}%`,
                      backgroundColor: SPECIES_BAR_COLORS[entry.id],
                    }}
                  >
                    <span className="absolute left-full top-1/2 ml-1 -translate-y-1/2 text-xs font-medium leading-none whitespace-nowrap tabular-nums">
                      {entry.count}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
