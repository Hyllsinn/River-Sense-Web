import { useId } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
} from "recharts";
import { CHART_SIDE_SPACE, formatAxisNumber } from "./lib/chart-layout";
import type { Point } from "./lib/hydrology/types";
import { splitChartPoints, smoothForDisplay } from "./lib/hydrology/chart-series";

const MONTHS_FR = [
  "janv",
  "févr",
  "mars",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sept",
  "oct",
  "nov",
  "déc",
];
const DAY_MS = 86_400_000;

function compactDate(time: number): string {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "numeric",
  }).formatToParts(time);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return Number.isFinite(day) && month >= 1 && month <= 12 ? `${day} ${MONTHS_FR[month - 1]}` : "—";
}

function hydroDateTicks(end: string): number[] {
  const current = Date.parse(end);
  return Number.isFinite(current) ? [current - 4 * DAY_MS, current - 2 * DAY_MS, current] : [];
}

function compactTooltipDate(time: number): string {
  if (!Number.isFinite(time)) return "—";
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(time);
  const weekday = parts.find((part) => part.type === "weekday")?.value.replace(".", "");
  const day = parts.find((part) => part.type === "day")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  const capitalizedWeekday = weekday
    ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
    : undefined;
  return capitalizedWeekday && day && hour && minute
    ? `${capitalizedWeekday} ${day} à ${hour}h${minute}`
    : "—";
}

export function HydroChart({
  points,
  p25,
  p75,
  start,
  end,
  color = "var(--color-water)",
  yDomain,
  yTicks,
  formatY,
  formatValue,
  gapThresholdHours = 24,
  smoothingHours,
  sampleEveryHours = 1,
  valueLabel = "Relevé",
}: {
  points: Point[];
  p25?: number | undefined;
  p75?: number | undefined;
  start: string;
  end: string;
  color?: string;
  yDomain?: [number, number] | undefined;
  yTicks?: number[] | undefined;
  formatY?: ((value: number) => string) | undefined;
  formatValue?: ((value: number) => string) | undefined;
  /** Coupe la courbe avant le lissage dès que cet écart est atteint. */
  gapThresholdHours?: number | undefined;
  /** Filtre de présentation uniquement : les données métier restent brutes. */
  smoothingHours?: number | undefined;
  /** Cadence de rendu de la série filtrée. */
  sampleEveryHours?: number | undefined;
  valueLabel?: string | undefined;
}) {
  const gradientId = `riversense-hydro-fill-${useId().replace(/:/g, "")}`;
  const dateTicks = hydroDateTicks(end);
  const segments = splitChartPoints(points, gapThresholdHours).map((part) =>
    smoothingHours ? smoothForDisplay(part, smoothingHours, sampleEveryHours) : part,
  );
  const series = segments.flatMap((part, index) =>
    part.map((point) => ({ time: Date.parse(point.time), [`v${index}`]: point.value })),
  );

  return (
    <div className="h-[254px] w-full text-[11px]">
      <ResponsiveContainer>
        <ComposedChart
          data={series}
          margin={{ top: 12, right: CHART_SIDE_SPACE, bottom: 4, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.42} />
              <stop offset="100%" stopColor={color} stopOpacity={0.025} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="var(--color-border)"
            strokeDasharray="3 3"
            strokeOpacity={0.7}
          />
          <XAxis
            dataKey="time"
            type="number"
            domain={[Date.parse(start), Date.parse(end)]}
            ticks={dateTicks}
            tickFormatter={(value) => compactDate(Number(value))}
            stroke="var(--color-border)"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            width={CHART_SIDE_SPACE}
            tickMargin={4}
            tickSize={0}
            domain={yDomain ?? ["auto", "auto"]}
            {...(yTicks ? { ticks: yTicks } : {})}
            stroke="var(--color-border)"
            tick={<CompactAxisTick format={formatY ?? formatAxisNumber} />}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={(value) => compactTooltipDate(Number(value))}
            formatter={(v) => [
              formatValue ? formatValue(Number(v)) : Number(v).toFixed(1),
              valueLabel,
            ]}
            contentStyle={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
              borderRadius: "var(--radius-xl)",
              fontSize: 11,
            }}
          />
          {p25 !== undefined && p75 !== undefined && (
            <ReferenceArea
              y1={p25}
              y2={p75}
              fill="var(--color-reed)"
              fillOpacity={0.03}
              stroke="none"
              ifOverflow="extendDomain"
              pointerEvents="none"
            />
          )}
          {segments.map((part, i) => (
            <Area
              key={i}
              type="monotoneX"
              dataKey={`v${i}`}
              stroke={color}
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${gradientId})`}
              baseValue="dataMin"
              dot={part.length === 1 ? { r: 2, fill: color, stroke: color } : false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
          {p25 !== undefined && p75 !== undefined && (
            <ReferenceLine
              y={p25}
              stroke="var(--color-reed)"
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />
          )}
          {p25 !== undefined && p75 !== undefined && (
            <ReferenceLine
              y={p75}
              stroke="var(--color-reed)"
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CompactAxisTick({
  x = 0,
  y = 0,
  payload,
  format,
}: {
  x?: number;
  y?: number;
  payload?: { value?: unknown };
  format: (value: number) => string;
}) {
  const label = format(Number(payload?.value));
  return (
    <text
      x={x}
      y={y}
      dy="0.32em"
      textAnchor="end"
      fill="var(--color-muted-foreground)"
      fontSize={10}
      {...(label.length > 4
        ? { textLength: CHART_SIDE_SPACE - 4, lengthAdjust: "spacingAndGlyphs" as const }
        : {})}
    >
      {label}
    </text>
  );
}
