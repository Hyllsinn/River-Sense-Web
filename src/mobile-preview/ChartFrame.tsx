import { useId, type ReactNode } from "react";

type ChartMarker = {
  x: string;
  label: ReactNode;
  /** Position libre, de 0 à 1, pour les marqueurs entre deux graduations. */
  position?: number | undefined;
};

/** Cadre commun : grille, axes, série lissée et repères. */
export function ChartFrame({
  xLabels,
  yTicks,
  color = "var(--color-primary)",
  markers = [],
  height = 240,
  formatY = (v: number) => String(v),
  values = [],
  xLabelEvery = 1,
  xLabelIndices,
  axisWidth = 36,
  rightPadding = 0,
  topPadding = 24,
}: {
  xLabels: string[];
  yTicks: number[];
  yDomain?: [number, number] | undefined;
  color?: string | undefined;
  variant?: "line" | "area" | undefined;
  markers?: ChartMarker[] | undefined;
  height?: number | undefined;
  formatY?: ((value: number) => string) | undefined;
  values?: (number | null | undefined)[] | undefined;
  /** Conserve l'espacement mais masque une graduation sur N. */
  xLabelEvery?: number | undefined;
  xLabelIndices?: number[] | undefined;
  /** Largeur réservée à l’axe vertical. */
  axisWidth?: number | undefined;
  /** Espace droit permettant de centrer le tracé avec l’axe vertical à gauche. */
  rightPadding?: number | undefined;
  /** Espace au-dessus du tracé, utile uniquement lorsqu’il y a des marqueurs. */
  topPadding?: number | undefined;
}) {
  const gradientId = "riversense-chart-fill-" + useId().replace(/:/g, "");
  const rows = [...yTicks].reverse();
  const finite = values
    .map((value, index) => ({ value, index }))
    .filter(
      (point): point is { value: number; index: number } =>
        typeof point.value === "number" && Number.isFinite(point.value),
    );
  const low = Math.min(...yTicks);
  const high = Math.max(...yTicks);
  const span = Math.max(high - low, 1);
  const points = finite.map(({ value, index }) => ({
    x: (index / Math.max(xLabels.length - 1, 1)) * 100,
    y: 100 - ((value - low) / span) * 100,
  }));
  const path =
    points.length < 2
      ? ""
      : points.slice(0, -1).reduce((line, point, index) => {
          const previous = points[index - 1] ?? point;
          const next = points[index + 1]!;
          const after = points[index + 2] ?? next;
          // Keep the smoothed segment within its samples, including at the activity ceiling.
          const minY = Math.min(point.y, next.y);
          const maxY = Math.max(point.y, next.y);
          const boundY = (y: number) => Math.max(minY, Math.min(maxY, y));
          const control1 = {
            x: point.x + (next.x - previous.x) / 6,
            y: boundY(point.y + (next.y - previous.y) / 6),
          };
          const control2 = {
            x: next.x - (after.x - point.x) / 6,
            y: boundY(next.y - (after.y - point.y) / 6),
          };
          const segment =
            "C " +
            control1.x +
            " " +
            control1.y +
            ", " +
            control2.x +
            " " +
            control2.y +
            ", " +
            next.x +
            " " +
            next.y;
          return index === 0
            ? "M " + point.x + " " + point.y + " " + segment
            : line + " " + segment;
        }, "");
  const area =
    path && points.length
      ? path + " L " + points[points.length - 1]!.x + " 100 L " + points[0]!.x + " 100 Z"
      : "";
  const markerPosition = (marker: ChartMarker) => {
    if (typeof marker.position === "number")
      return Math.min(100, Math.max(0, marker.position * 100));
    const index = xLabels.indexOf(marker.x);
    return index < 0 ? 50 : (index / Math.max(xLabels.length - 1, 1)) * 100;
  };

  return (
    <div className="w-full" style={{ paddingRight: rightPadding }}>
      <div className="relative" style={{ paddingTop: topPadding }}>
        <div className="pointer-events-none absolute top-0 right-0 h-5" style={{ left: axisWidth }}>
          {markers.map((marker, index) => {
            const left = markerPosition(marker);
            return (
              <span
                key={marker.x + "-" + index}
                className="absolute inline-flex items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground"
                style={{
                  left: String(left) + "%",
                  transform: "translateX(-50%)",
                }}
              >
                {marker.label}
              </span>
            );
          })}
        </div>
        <div className="flex" style={{ height }}>
          <div
            className="flex shrink-0 flex-col justify-between pr-1 text-right"
            style={{ width: axisWidth }}
          >
            {rows.map((tick) => (
              <span
                key={tick}
                className="text-[10px] leading-none tabular-nums text-muted-foreground"
              >
                {formatY(tick)}
              </span>
            ))}
          </div>
          <div
            className="relative flex-1 overflow-hidden border-b border-l"
            style={{
              borderBottomColor: "var(--color-border)",
              borderLeftColor: "var(--color-border)",
            }}
          >
            {rows.map((tick, index) =>
              index === rows.length - 1 ? null : (
                <div
                  key={tick}
                  className="absolute inset-x-0 border-t border-dashed border-border/70"
                  style={{ top: String((index / (rows.length - 1)) * 100) + "%" }}
                />
              ),
            )}
            {path && (
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.42" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.025" />
                  </linearGradient>
                </defs>
                <path d={area} fill={"url(#" + gradientId + ")"} />
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.75"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {markers.map((marker, index) => (
              <div
                key={marker.x + "-line-" + index}
                className="absolute top-0 bottom-0 border-l border-dashed"
                style={{
                  left: String(markerPosition(marker)) + "%",
                  borderColor: "var(--color-sand)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex" style={{ paddingLeft: axisWidth }}>
        <div className="relative h-4 min-w-0 flex-1">
          {xLabels.map((label, index) => {
            if (xLabelIndices ? !xLabelIndices.includes(index) : index % xLabelEvery !== 0)
              return null;
            const isFirst = index === 0;
            const isLast = index === xLabels.length - 1;
            const left = (index / Math.max(xLabels.length - 1, 1)) * 100;
            return (
              <span
                key={label + "-" + index}
                className="absolute top-0 whitespace-nowrap text-[11px] text-muted-foreground"
                style={{
                  left: String(left) + "%",
                  transform: isFirst ? "none" : isLast ? "translateX(-100%)" : "translateX(-50%)",
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
