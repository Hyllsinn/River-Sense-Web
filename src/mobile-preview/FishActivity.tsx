import { useCallback, useEffect, useRef, useState } from "react";
import { Fish, Sunrise, Sunset, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { HydroBundle } from "./lib/hydrology/types";
import type { ActivityLoadState } from "./lib/fish-feeding-display.types";
import { FISH_SPECIES_IMAGES } from "./snapshot";
import { isImagePrepared, prepareImage } from "./lib/image-loading";
import { CHART_SIDE_SPACE } from "./lib/chart-layout";
import { activityMarkerPosition } from "./lib/french-time";
import { ChartFrame } from "./ChartFrame";
import { Panel } from "./Panel";

function dayWeekdayLabel(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
    .format(new Date(date + "T12:00:00"))
    .replace(".", "")
    .toLowerCase();
}

function dayDateLabel(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  })
    .format(new Date(date + "T12:00:00"))
    .replace(".", "");
}

export function FishActivity({
  bundle,
  activity,
}: {
  bundle?: HydroBundle | undefined;
  activity?: ActivityLoadState;
}) {
  const fallback = {
    values: [] as number[],
    hours: [] as string[],
    sunrise: null,
    sunset: null,
    dawnPosition: 0.3,
    duskPosition: 0.8,
    message: "L'activité est calculée dès que les données locales sont disponibles.",
  };
  const display = activity ? activity.display : bundle?.fishFeeding;
  const loading = activity?.loading ?? false;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const day = display?.days[selectedDayIndex] ?? display?.days[0];
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>();
  const navigation = useRef(0);
  const species = day?.families.flatMap((family) => family.species) ?? [];
  const selectedIndex = Math.max(
    0,
    species.findIndex((fish) => fish.speciesId === selectedSpeciesId),
  );
  const selectedSpecies = species[selectedIndex];
  const selectedImage = selectedSpecies && FISH_SPECIES_IMAGES[selectedSpecies.speciesId];
  const previousSpecies = species[(selectedIndex - 1 + species.length) % species.length];
  const nextSpecies = species[(selectedIndex + 1) % species.length];
  const previousImage = previousSpecies && FISH_SPECIES_IMAGES[previousSpecies.speciesId];
  const nextImage = nextSpecies && FISH_SPECIES_IMAGES[nextSpecies.speciesId];

  const firstTargetDate = display?.days[0]?.targetDate;
  useEffect(() => {
    navigation.current++;
    setSelectedDayIndex(0);
    setSelectedSpeciesId(undefined);
  }, [display?.waterbodyId, display?.modelVersion, firstTargetDate]);

  // Load neighbouring portraits before the user presses an arrow.
  useEffect(() => {
    for (const src of new Set([previousImage, nextImage])) {
      if (src) {
        void prepareImage(src).catch(() => {});
      }
    }
  }, [previousImage, nextImage]);

  // Invalidate pending selections after leaving the river/day or changing targets.
  const invalidateNavigation = useCallback(() => {
    navigation.current++;
  }, []);
  useEffect(() => {
    invalidateNavigation();
    return invalidateNavigation;
  }, [selectedDayIndex, invalidateNavigation]);

  function chooseSpecies(fish: typeof selectedSpecies) {
    if (!fish) return;
    const request = ++navigation.current;
    const src = FISH_SPECIES_IMAGES[fish.speciesId];
    if (!src || isImagePrepared(src)) {
      setSelectedSpeciesId(fish.speciesId);
      return;
    }
    // Keep fish and curve together until the requested portrait is decoded.
    void prepareImage(src, "high")
      .catch(() => {})
      .then(() => {
        if (request === navigation.current) setSelectedSpeciesId(fish.speciesId);
      });
  }

  const selectedPoints =
    selectedSpecies?.points ?? (day?.families.length ? undefined : day?.points);
  const values = selectedPoints?.map((point) => Math.min(98, point.value)) ?? fallback.values;
  const hours =
    selectedPoints?.map((point) => {
      const hour = Number(point.hour.slice(0, 2));
      return `${hour}h${point.hour.slice(3) === "00" ? "" : point.hour.slice(3)}`;
    }) ?? fallback.hours;
  const sunrise = day?.sunrise ?? fallback.sunrise;
  const sunset = day?.sunset ?? fallback.sunset;
  const ready = values.length > 0;

  return (
    <Panel title={"Activité des poissons"} icon={<Fish className="size-5" />}>
      {loading && (
        <p role="status" className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {ready ? "Actualisation…" : "Chargement de l’activité…"}
        </p>
      )}
      {selectedSpecies && (
        <div
          className="-mt-4 mb-1 grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3"
          role="group"
          aria-label="Choisir une espèce"
        >
          <button
            type="button"
            aria-label="Espèce précédente"
            disabled={species.length < 2}
            onClick={() => chooseSpecies(previousSpecies)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-30"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <div className="col-start-2 flex min-w-0 items-center justify-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={selectedSpecies.label}
                width={720}
                height={320}
                decoding="async"
                className="mx-auto h-28 w-full max-w-[17rem] object-contain "
              />
            )}
          </div>
          <button
            type="button"
            aria-label="Espèce suivante"
            disabled={species.length < 2}
            onClick={() => chooseSpecies(nextSpecies)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-30"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}

      {ready ? (
        <>
          <ChartFrame
            axisWidth={CHART_SIDE_SPACE}
            rightPadding={CHART_SIDE_SPACE}
            xLabels={hours}
            xLabelEvery={4}
            xLabelIndices={selectedPoints?.flatMap((point, index) =>
              point.hour.endsWith(":00") &&
              Number(point.hour.slice(0, 2)) % 2 === 0 &&
              selectedPoints.findIndex((p) => p.hour === point.hour) === index
                ? [index]
                : [],
            )}
            yDomain={[0, 100]}
            yTicks={[0, 25, 50, 75, 100]}
            variant="area"
            color="var(--color-primary)"
            values={values}
            markers={
              sunrise && sunset
                ? [
                    {
                      x: "sunrise",
                      position: day
                        ? activityMarkerPosition(day.targetDate, sunrise, selectedPoints ?? [])
                        : fallback.dawnPosition,
                      label: (
                        <>
                          <Sunrise className="size-3.5 text-sand" aria-hidden />
                          {sunrise}
                        </>
                      ),
                    },
                    {
                      x: "sunset",
                      position: day
                        ? activityMarkerPosition(day.targetDate, sunset, selectedPoints ?? [])
                        : fallback.duskPosition,
                      label: (
                        <>
                          <Sunset className="size-3.5 text-sand" aria-hidden />
                          {sunset}
                        </>
                      ),
                    },
                  ]
                : []
            }
            height={210}
          />
          {display && display.days.length > 0 && (
            <div
              role="tablist"
              aria-label="Jour de prévision de l'activité"
              className="mt-3 grid grid-cols-6 gap-1 rounded-xl border border-border bg-card/40 p-1"
            >
              {display.days.slice(0, 6).map((forecastDay, index) => {
                const active = index === selectedDayIndex;
                return (
                  <button
                    key={forecastDay.targetDate}
                    type="button"
                    role="tab"
                    data-press-feedback="off"
                    aria-selected={active}
                    aria-label={`${dayWeekdayLabel(forecastDay.targetDate)}, ${dayDateLabel(forecastDay.targetDate)}`}
                    onClick={() => setSelectedDayIndex(index)}
                    className={
                      "flex min-w-0 flex-col items-center rounded-lg px-1 py-1.5 transition-colors " +
                      (active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground")
                    }
                  >
                    <span className="text-[9px] font-medium leading-none uppercase">
                      {dayWeekdayLabel(forecastDay.targetDate)}
                    </span>
                    <span className="mt-1 text-[10px] font-semibold leading-none ">
                      {dayDateLabel(forecastDay.targetDate)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {!day && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{fallback.message}</p>
          )}
        </>
      ) : (
        <div className="flex h-[210px] items-center justify-center rounded-lg border border-dashed border-border px-5 text-center text-sm text-muted-foreground">
          {loading
            ? "La courbe s’affichera à la fin du chargement et des relances."
            : activity?.selected
              ? "Actualise les données pour afficher l’activité."
              : "Choisis une commune et une rivière pour afficher l’activité."}
        </div>
      )}
    </Panel>
  );
}
