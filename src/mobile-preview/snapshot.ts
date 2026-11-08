import { formatRain, formatWind } from "./lib/display-format";
import type { FishFeedingDisplay } from "./lib/fish-feeding-display.types";
import type { HydroBundle, HydroPart, Point } from "./lib/hydrology/types";
import type { ThermalWeather } from "./lib/thermal-types";
import type { WeatherDay } from "./Weather";

// Cognac was drawn once from Cognac, Jarnac and Nantes. This example does not roll
// over at midnight and none of its values are live observations or forecasts.
const place = "Cognac";
const river = "La Charente";
const insee = "16102";
const date = "2026-11-08";
const dayMs = 86_400_000;
const hourMs = 3_600_000;
const midnight = Date.parse(date + "T00:00:00+01:00");
const isoDay = (offset: number) =>
  new Date(midnight + offset * dayMs + 12 * hourMs).toISOString().slice(0, 10);
const round = (value: number) => Math.round(value * 100) / 100;

// Keep a fixed curve phase for each species, independent of the display order.
const species = [
  ["perca_fluviatilis", "Perche", 8, 16, 0],
  ["esox_lucius", "Brochet", 10, 15, 1],
  ["sander_lucioperca", "Sandre", 6, 19, 2],
  ["cyprinus_carpio", "Carpe", 10, 17, 3],
  ["barbus_barbus", "Barbeau", 7, 18, 5],
  ["squalius_cephalus", "Chevesne", 9, 15, 6],
  ["tinca_tinca", "Tanche", 8, 17, 7],
  ["abramis_brama", "Brème", 11, 16, 8],
  ["rutilus_rutilus", "Gardon", 9, 14, 9],
  ["oncorhynchus_mykiss", "Truite arc-en-ciel", 8, 16, 10],
  ["micropterus_salmoides", "Black-bass", 10, 16, 12],
  ["silurus_glanis", "Silure", 5, 21, 13],
  ["thymallus_thymallus", "Ombre", 9, 15, 14],
] as const;

const fishFeeding: FishFeedingDisplay = {
  modelVersion: "demo",
  waterbodyId: "demo-cognac-charente",
  days: Array.from({ length: 6 }, (_, day) => ({
    targetDate: isoDay(day),
    sunrise: `07:${54 + day}`,
    sunset: `17:${37 - day}`,
    points: [],
    families: [
      {
        activityGroup: "demo",
        label: "Espèces",
        points: [],
        species: species.map(([speciesId, label, morning, evening, phase]) => ({
          speciesId,
          label,
          points: Array.from({ length: 24 }, (_, hour) => ({
            hour: `${String(hour).padStart(2, "0")}:00`,
            time: new Date(midnight + day * dayMs + hour * hourMs).toISOString(),
            value: Math.round(
              Math.max(
                0,
                Math.min(
                  98,
                  17 +
                    45 * Math.exp(-((hour - morning - day / 5) ** 2) / 10) +
                    42 * Math.exp(-((hour - evening + day / 4) ** 2) / 12) +
                    8 * Math.sin(hour * 0.87 + phase + day) +
                    5 * Math.cos(hour * 1.7 + day - phase),
                ),
              ),
            ),
          })),
        })),
      },
    ],
  })),
};

function station(metric: "H" | "Q"): HydroPart {
  const points: Point[] = Array.from({ length: 49 }, (_, index) => {
    const variation = Math.sin(index / 6) * 0.45 + Math.cos(index / 3.2) * 0.17 + index / 100;
    return {
      time: new Date(midnight - (48 - index) * 6 * hourMs).toISOString(),
      value: round(metric === "H" ? 91 + variation * 13 : 68 + variation * 17),
    };
  });
  const last = points[points.length - 1]!;
  return {
    station: `demo-${metric}`,
    last,
    daily: {},
    points,
    start: points[0]!.time,
    end: last.time,
    ...(metric === "H" && {
      relative: {
        value: round((last.value - 90) / 100),
        p25: -0.21,
        p75: 0.27,
        points: points.map(({ time, value }) => ({ time, value: round((value - 90) / 100) })),
      },
    }),
  };
}

const thermal: ThermalWeather = {
  status: "estimated",
  latestWaterTemperatureC: 12.4,
  history: [13.6, 13.2, 12.9, 12.7, 12.5, 12.4].map((waterTemperatureC, index) => ({
    date: isoDay(index - 5),
    waterTemperatureC,
  })),
};

const bundle: HydroBundle = {
  insee,
  river: "demo-charente",
  date,
  generatedAt: new Date(midnight).toISOString(),
  expiresAt: new Date(midnight + dayMs).toISOString(),
  complete: true,
  parts: { H: station("H"), Q: station("Q") },
  thermal,
  fishFeeding,
};

const weather: WeatherDay[] = [
  [14, 7, 0, 10, 2],
  [13, 6, 0, 8, 1],
  [13, 7, 0.3, 12, 3],
  [12, 8, 4.2, 15, 61],
  [14, 9, 1.8, 18, 80],
  [14, 7, 0, 10, 2],
].map(([max, min, rain, wind, weatherCode], index) => {
  const key = isoDay(index);
  return {
    key,
    label:
      index === 0
        ? "Aujourd’hui"
        : new Intl.DateTimeFormat("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
            timeZone: "Europe/Paris",
          }).format(new Date(key + "T12:00:00Z")),
    max: `${max}°`,
    min: `${min}°`,
    rain: formatRain(rain),
    wind: formatWind(wind),
    weatherCode,
  };
});

export const demo = { place, river, bundle, thermal, weather };

export const FISH_SPECIES_IMAGES: Readonly<Record<string, string>> = Object.fromEntries(
  species.map(([id]) => [id, `/demo-fish/${id}.webp`]),
);
