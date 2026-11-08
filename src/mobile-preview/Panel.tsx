import type { ReactNode } from "react";

export function Panel({
  title,
  icon,
  aside,
  children,
}: {
  title: ReactNode;
  icon?: ReactNode | undefined;
  aside?: ReactNode | undefined;
  children: ReactNode;
}) {
  return (
    <section className="panel mt-6 p-5 ">
      <header
        className={`mb-5 flex items-baseline justify-between gap-2 ${aside ? "flex-nowrap" : "flex-wrap"}`}
      >
        <h2 className="section-title flex min-w-0 items-center gap-2">
          {icon ? <span className="shrink-0 text-primary">{icon}</span> : null}
          {title}
        </h2>
        {aside ? <span className="shrink-0 text-xs text-muted-foreground">{aside}</span> : null}
      </header>
      {children}
    </section>
  );
}
