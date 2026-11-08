import { MONTHS, FULL_MONTHS } from "./calendar";

export function CatchChart({
  counts,
  year,
  onMonth,
  disabled = false,
}: {
  counts: readonly number[];
  year: number;
  onMonth(month: number): void;
  disabled?: boolean;
}) {
  const max = Math.max(4, ...counts);
  const ceiling = Math.ceil(max / 4) * 4;
  return (
    <div>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 flex h-48 flex-col justify-between"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n} className="border-t border-dashed border-border/60" />
            ))}
          </div>
          <div className="relative grid grid-cols-12 gap-0.5">
            {MONTHS.map((label, month) => {
              const count = counts[month] ?? 0;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={disabled}
                  onClick={() => onMonth(month)}
                  aria-label={`${FULL_MONTHS[month]} ${year} : ${count} prise${count === 1 ? "" : "s"}`}
                  className="group min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
                >
                  <span className="relative flex h-48 items-end justify-center">
                    <span
                      className="relative w-3/4 rounded-t-sm bg-gradient-to-t from-primary/50 to-primary transition-colors group-hover:from-accent/70 group-hover:to-accent"
                      style={{
                        height: count ? `${(count / ceiling) * 100}%` : "2px",
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-foreground"
                      >
                        {count || ""}
                      </span>
                    </span>
                  </span>
                  <span aria-hidden className="mt-3 block text-[8px] text-muted-foreground">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
