import { CalendarDays, CloudRain, Loader2, Snowflake, Wind } from "lucide-react";
import type { ReactNode } from "react";
import { Panel } from "./Panel";

export type WeatherDay = {
  key: string;
  label: string;
  max?: string | null | undefined;
  min?: string | null | undefined;
  condition?: string | null | undefined;
  rain?: string | null | undefined;
  wind?: string | null | undefined;
  weatherCode?: number | null | undefined;
};

type WeatherCondition =
  | "clear"
  | "mainly_clear"
  | "partly_cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "showers"
  | "snow"
  | "thunderstorm"
  | "unknown";

function weatherVisual(day: WeatherDay): { condition: WeatherCondition; label: string } {
  const code = day.weatherCode;
  if (code === 0) return { condition: "clear", label: "Ciel dégagé" };
  if (code === 1) return { condition: "mainly_clear", label: "Peu nuageux" };
  if (code === 2) return { condition: "partly_cloudy", label: "Partiellement nuageux" };
  if (code === 3) return { condition: "overcast", label: "Couvert" };
  if (code === 45 || code === 48) return { condition: "fog", label: "Brouillard" };
  if ([51, 53, 55, 56, 57].includes(code ?? -1)) return { condition: "drizzle", label: "Bruine" };
  if ([61, 63, 65, 66, 67].includes(code ?? -1)) return { condition: "rain", label: "Pluie" };
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return { condition: "snow", label: "Neige" };
  if ([80, 81, 82].includes(code ?? -1)) return { condition: "showers", label: "Averses" };
  if ([95, 96, 99].includes(code ?? -1)) return { condition: "thunderstorm", label: "Orage" };
  return { condition: "unknown", label: day.condition ?? "—" };
}

function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  const svg = (children: ReactNode) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
  const cloudPath = "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242";
  const cloud = "var(--weather-cloud)";
  const darkCloud = "var(--weather-cloud-dark)";
  const rain = "var(--weather-rain)";
  const sun = "var(--weather-sun)";

  if (condition === "clear")
    return svg(
      <g stroke={sun}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </g>,
    );

  if (condition === "mainly_clear" || condition === "partly_cloudy")
    return svg(
      <>
        <g stroke={sun}>
          <path d="M12 2v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="M20 12h2" />
          <path d="m19.07 4.93-1.41 1.41" />
          <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
        </g>
        <path stroke={cloud} d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
      </>,
    );

  if (condition === "overcast" || condition === "unknown")
    return svg(<path stroke={darkCloud} d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />);

  if (condition === "fog")
    return svg(
      <g stroke={darkCloud}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M16 17H7M17 21H9" />
      </g>,
    );

  if (condition === "drizzle")
    return svg(
      <>
        <path stroke={darkCloud} d={cloudPath} />
        <g stroke={rain}>
          <path d="M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1" />
        </g>
      </>,
    );

  if (condition === "rain" || condition === "showers")
    return svg(
      <>
        <path stroke={darkCloud} d={cloudPath} />
        <g stroke={rain}>
          <path d="M16 14v6M8 14v6M12 16v6" />
        </g>
      </>,
    );

  if (condition === "snow")
    return (
      <Snowflake
        className={`${className} text-weather-snow`}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    );

  return svg(
    <>
      <path stroke={darkCloud} d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path stroke="var(--weather-lightning)" d="m13 12-3 5h4l-3 5" />
    </>,
  );
}

/** Météo — six jours issus du bundle quotidien. */
export function Weather({ days, loading = false }: { days: WeatherDay[]; loading?: boolean }) {
  return (
    <Panel title={"Météo"} icon={<CalendarDays className="size-5" />}>
      {loading ? (
        <div
          className="flex min-h-[246px] items-center justify-center gap-2 text-sm text-muted-foreground"
          role="status"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Météo en cours de chargement…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 ">
          {days.map((day) => {
            const visual = weatherVisual(day);

            return (
              <div
                key={day.key}
                className="relative flex flex-col items-center rounded-2xl border border-border/60 bg-card/20 p-3 transition-colors hover:bg-card/35 "
              >
                <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {day.label}
                </span>
                <div className="mt-2 flex aspect-square w-full max-w-[4.5rem] items-center justify-center ">
                  <WeatherIcon condition={visual.condition} className="size-11 stroke-[1.7] " />
                </div>
                <div className="mt-2 text-center ">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-display text-xl font-semibold ">{day.max ?? "—"}</span>
                    <span className="text-sm text-muted-foreground ">{day.min ?? "—"}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-muted-foreground ">
                    {visual.label}
                  </p>
                </div>
                <div className="mt-2 flex w-full flex-wrap justify-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground ">
                  <span className="flex items-center gap-1.5">
                    <CloudRain className="size-3 text-water " aria-hidden /> {day.rain ?? "—"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="size-3 text-reed " aria-hidden /> {day.wind ?? "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
