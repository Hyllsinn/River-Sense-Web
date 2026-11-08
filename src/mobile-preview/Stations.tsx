import { formatAxisNumber } from "./lib/chart-layout";
import { levelChartReference } from "./lib/hydrology/level-chart-reference";
import { formatNumber, formatFlow, formatLevel } from "./lib/display-format";
import type { HydroBundle, Point } from "./lib/hydrology/types";
import type { ThermalWeather } from "./lib/thermal-types";
import { percentileAsRelativeMeters } from "./lib/hydrology/percentile-display";
import { HydroChart } from "./HydroChart";
import { smoothForDisplay, splitChartPoints } from "./lib/hydrology/chart-series";
import { Loader2, Waves } from "lucide-react";

import { Panel } from "./Panel";

/**
 * Stations.
 * `bundle` : données hydrométriques normalisées côté backend.
 * `waterTemp` : issue de l'équation de température.
 */
export function Stations({
  waterTemp,
  bundle,
  thermal,
  thermalLoading = false,
  unmonitored = false,
}: {
  waterTemp?: string | null | undefined;
  bundle?: HydroBundle | undefined;
  thermal?: ThermalWeather | undefined;
  thermalLoading?: boolean;
  unmonitored?: boolean;
}) {
  const thermalSeries = thermal ?? bundle?.thermal;
  const waterHistory =
    thermalSeries?.history.map((day) =>
      typeof day.waterTemperatureC === "number" ? day.waterTemperatureC : null,
    ) ?? [];
  const latestTemperature = thermalSeries?.latestWaterTemperatureC;
  const waterValue =
    typeof latestTemperature === "number" && Number.isFinite(latestTemperature)
      ? formatNumber(latestTemperature, 1)
      : waterTemp;
  const waterDates = thermalSeries?.history.map((day) => day.date) ?? [];
  const waterScale = scaleFor(waterHistory);
  const levelRelative = bundle?.parts.H?.relative;
  const levelReference = levelChartReference(bundle?.parts.H);
  const levelUsesPercentiles = levelReference?.scale === "percentile";
  const levelTrend = latestTrend(levelReference?.relativePoints);
  const flowTrend = latestTrend(bundle?.parts.Q?.points);
  return (
    <Panel
      title={
        <>
          Stations
          {(unmonitored || bundle?.unmonitored) && (
            <svg
              className="size-5 shrink-0"
              viewBox="0 0 100 100"
              role="img"
              aria-label="Rivière sans station hydrométrique"
            >
              <path
                fill="#078bf5"
                fillRule="evenodd"
                d="M50 17C46 33 39 42 34 50C28 59 27 65 30 72C33 80 41 84 50 84C62 84 72 75 72 63C72 49 56 36 50 17ZM35 51C27 66 35 78 54 79C41 72 34 63 35 51Z"
              />
              <circle cx="50" cy="50" r="46" fill="none" stroke="#dc2626" strokeWidth="5.2" />
              <path d="M17.5 82.5 82.5 17.5" fill="none" stroke="#dc2626" strokeWidth="5.2" />
            </svg>
          )}
        </>
      }
      icon={<Waves className="size-5" />}
    >
      <div className="grid gap-5">
        {!(unmonitored || bundle?.unmonitored) && (
          <>
            <div className="min-w-0">
              <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="label-caps">{"NIVEAU :"}</span>
                <span className="font-display text-base font-semibold text-water tabular-nums">
                  {typeof levelTrend === "number"
                    ? `${levelTrend > 0 ? "+" : ""}${formatNumber(levelTrend, 1)} cm`
                    : "—"}
                </span>
              </h3>
              {bundle?.parts.H ? (
                <HydroChart
                  points={levelReference?.points ?? bundle.parts.H.points}
                  p25={levelReference?.p25}
                  p75={levelReference?.p75}
                  start={bundle.parts.H.start}
                  end={bundle.parts.H.end}
                  yDomain={levelReference?.domain}
                  yTicks={levelReference?.ticks}
                  formatY={
                    levelUsesPercentiles && levelRelative
                      ? (value) =>
                          formatAxisNumber(
                            percentileAsRelativeMeters(value, levelRelative.p25, levelRelative.p75),
                          )
                      : (value) => formatAxisNumber(value / 100)
                  }
                  formatValue={
                    levelUsesPercentiles && levelRelative
                      ? (value) =>
                          relativeMeterLabel(
                            percentileAsRelativeMeters(value, levelRelative.p25, levelRelative.p75),
                          )
                      : levelReference?.scale === "relative_cm"
                        ? (value) => relativeMeterLabel(value / 100)
                        : (value) => `${formatNumber(value, 1)} cm`
                  }
                  smoothingHours={25}
                  sampleEveryHours={6}
                  valueLabel={"Niveau"}
                />
              ) : (
                <div className="flex h-[254px] items-center justify-center text-[11px] text-muted-foreground">
                  Niveau indisponible
                </div>
              )}
              {bundle?.parts.H?.relative?.partialHistory && (
                <p className="mt-1 text-[11px] text-muted-foreground">Repère historique partiel</p>
              )}
              {levelReference?.kind === "recent" && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  P25 / P75 récents · {levelReference.from && referenceDate(levelReference.from)} au{" "}
                  {levelReference.to && referenceDate(levelReference.to)}
                  {" · comparaison sur cette période uniquement"}
                </p>
              )}
              {bundle?.parts.H && !levelReference && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Hauteur mesurée en m · repères P25 / P75 indisponibles sur cette période
                </p>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="label-caps">{"DEBIT :"}</span>
                <span className="font-display text-base font-semibold text-reed tabular-nums">
                  {typeof flowTrend === "number" ? formatFlow(flowTrend) : "—"}
                </span>
              </h3>
              {bundle?.parts.Q ? (
                <>
                  <HydroChart
                    points={bundle.parts.Q.points}
                    start={bundle.parts.Q.start}
                    end={bundle.parts.Q.end}
                    color="var(--color-reed)"
                    smoothingHours={25}
                    sampleEveryHours={6}
                    valueLabel={"Débit"}
                    formatY={formatAxisNumber}
                    formatValue={(value) => formatFlow(value)}
                  />
                </>
              ) : (
                <div className="flex h-[254px] items-center justify-center text-[11px] text-muted-foreground">
                  Débit indisponible
                </div>
              )}
            </div>
          </>
        )}
        <Metric
          label={"TEMPÉRATURE DE L'EAU :"}
          value={waterValue}
          unit="°C"
          color="var(--color-sand)"
          values={waterHistory}
          dates={waterDates}
          ticks={waterScale}
          loading={thermalLoading}
          emptyLabel={
            thermalSeries?.availability === "outside_supported_period"
              ? "Estimation historique indisponible pour cette période"
              : thermalSeries?.status === "calibration_pending"
                ? "Profil thermique non disponible sur ce tronçon"
                : "Température de l’eau indisponible"
          }
        />
      </div>
    </Panel>
  );
}

function Metric({
  label,
  value,
  unit,
  color,
  values = [],
  dates = [],
  ticks,
  loading = false,
  emptyLabel = "Température de l’eau indisponible",
}: {
  label: string;
  value?: string | null | undefined;
  unit: string;
  color: string;
  values?: (number | null | undefined)[];
  dates?: string[];
  ticks?: number[];
  loading?: boolean;
  emptyLabel?: string;
}) {
  return (
    <div>
      <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="label-caps">{label}</span>
        <span className="font-display text-base font-semibold" style={{ color }}>
          {loading ? "Calcul…" : (value ?? "—")} {!loading && value ? unit : ""}
        </span>
      </h3>
      {loading ? (
        <div
          className="flex h-[254px] items-center justify-center gap-2 text-[11px] text-muted-foreground"
          role="status"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Température de l’eau en cours de calcul…
        </div>
      ) : !values.some((value) => typeof value === "number" && Number.isFinite(value)) ? (
        <div className="flex h-[254px] items-center justify-center text-[11px] text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <HydroChart
          points={thermalPoints(values, dates)}
          start={thermalBounds(dates).start}
          end={thermalBounds(dates).end}
          color={color}
          yDomain={ticks ? [ticks[0]!, ticks[ticks.length - 1]!] : [0, 100]}
          yTicks={ticks ?? [0, 25, 50, 75, 100]}
          formatY={formatAxisNumber}
          gapThresholdHours={48}
          valueLabel={label}
          formatValue={(value) => `${value.toFixed(1)} ${unit}`}
        />
      )}
    </div>
  );
}

function latestTrend(points: Point[] | undefined): number | null {
  if (!points?.length) return null;
  const latestSegment = splitChartPoints(points).at(-1);
  return latestSegment ? (smoothForDisplay(latestSegment, 25, 6).at(-1)?.value ?? null) : null;
}

function thermalPoints(values: (number | null | undefined)[], dates: string[]): Point[] {
  return values.flatMap((value, index) => {
    const date = dates[index];
    return typeof value === "number" && Number.isFinite(value) && date
      ? [{ time: date + "T12:00:00.000Z", value }]
      : [];
  });
}

function thermalBounds(dates: string[]): { start: string; end: string } {
  const first = dates[0];
  const last = dates.at(-1);
  return {
    start: first ? first + "T12:00:00.000Z" : new Date(0).toISOString(),
    end: last ? last + "T12:00:00.000Z" : new Date(0).toISOString(),
  };
}

function scaleFor(values: (number | null | undefined)[]): number[] {
  const finite = values.filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value),
  );
  if (!finite.length) return [0, 5, 10, 15, 20];
  const minimum = Math.floor(Math.min(...finite) - 1);
  const maximum = Math.ceil(Math.max(...finite) + 1);
  const step = Math.max(1, Math.ceil((maximum - minimum) / 4));
  const low = Math.floor(minimum / step) * step;
  return Array.from({ length: 5 }, (_, index) => low + index * step);
}

function relativeMeterLabel(value: number): string {
  const normalized = Math.abs(value) < 0.005 ? 0 : value;
  const sign = normalized > 0 ? "+" : "";
  return `${sign}${formatLevel(normalized)}`;
}

function referenceDate(time: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "short",
  }).format(new Date(time));
}
