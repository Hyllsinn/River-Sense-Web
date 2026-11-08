const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Civil French time, independent of the server/device's configured timezone. */
export function parisDateTime(time: number | string): string {
  const parts = formatter.formatToParts(new Date(time));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

/** All matching instants: none for a skipped clock time, two for a repeated one. */
export function parisInstants(date: string, clock: string): number[] {
  const target = `${date}T${clock}`;
  const utc = Date.parse(target + ":00Z");
  if (!Number.isFinite(utc)) return [];
  const offsets = new Set(
    [-1, 0, 1].map((day) => {
      const time = utc + day * 86_400_000;
      return Date.parse(parisDateTime(time) + ":00Z") - time;
    }),
  );
  return [...offsets]
    .map((offset) => utc - offset)
    .filter((time) => parisDateTime(time) === target)
    .sort((a, b) => a - b);
}

export function parisDayBounds(date: string): { start: number; end: number } {
  const next = new Date(Date.parse(date + "T12:00:00Z") + 86_400_000).toISOString().slice(0, 10);
  const start = parisInstants(date, "00:00")[0];
  const end = parisInstants(next, "00:00")[0];
  if (start === undefined || end === undefined) throw Error("invalid_french_date");
  return { start, end };
}

/** Half-hourly real instants: 46, 48 or 50 points according to the French day. */
export function activityClockPoints(date: string) {
  const { start, end } = parisDayBounds(date);
  return Array.from({ length: (end - start) / 1_800_000 }, (_, index) => {
    const time = start + index * 1_800_000;
    return { time: new Date(time).toISOString(), hour: parisDateTime(time).slice(11), value: 0 };
  });
}

/** Legacy cached clock strings remain readable; new weather uses explicit UTC. */
export function weatherInstant(value: string): number | undefined {
  const time = /Z$|[+-]\d\d:\d\d$/.test(value)
    ? Date.parse(value)
    : parisInstants(value.slice(0, 10), value.slice(11, 16))[0];
  return typeof time === "number" && Number.isFinite(time) ? time : undefined;
}

export function activityMarkerPosition(
  date: string,
  clock: string,
  points: readonly { hour: string; time?: string | undefined }[],
): number {
  const first = points[0],
    last = points.at(-1);
  if (!first || !last) return 0;
  const minutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
  let start = minutes(first.hour),
    end = minutes(last.hour),
    event = minutes(clock);
  if (first.time && last.time) {
    start = Date.parse(first.time);
    end = Date.parse(last.time);
    event = parisInstants(date, clock)[0] ?? NaN;
  }
  return end > start && Number.isFinite(event)
    ? Math.max(0, Math.min(1, (event - start) / (end - start)))
    : 0;
}
