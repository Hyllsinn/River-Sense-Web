import { ChartColumn, ChartSpline, List, Pencil, Trophy, X } from "lucide-react";
import { useState } from "react";

import { PreviewPhone } from "../mobile-preview/PreviewPhone";
import { FISH_SPECIES_IMAGES } from "../mobile-preview/snapshot";
import { CatchChart } from "./CatchChart";
import { CatchLogIcon } from "./CatchLogIcon";
import { CatchSpeciesTable } from "./CatchSpeciesTable";
import { FULL_MONTHS } from "./calendar";
import { counts, entries, species, year } from "./sample";

const catchDate = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

const photos = [
  {
    id: "perche",
    label: "Perche",
    alt: "Un pêcheur présente une perche sur un ponton, avec la rivière à gauche.",
  },
  {
    id: "brochet",
    label: "Brochet",
    alt: "Un pêcheur présente un brochet sur les galets, au ras de l’eau.",
  },
  {
    id: "carpe",
    label: "Carpe",
    alt: "Une pêcheuse présente une carpe commune sur la berge au lever du soleil.",
  },
  { id: "sandre", label: "Sandre", alt: "Un adolescent assis sur un rocher présente un sandre." },
] as const;

export function CatchBookPreview() {
  const [overview, setOverview] = useState<"chart" | "species">("chart");
  const [addCatchOpen, setAddCatchOpen] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[number] | null>(null);
  const visible = month === null ? [] : entries.filter((entry) => entry.month === month);

  return (
    <PreviewPhone caption="Aperçu interactif du carnet">
      <button
        type="button"
        aria-expanded={addCatchOpen}
        aria-controls="preview-add-catch"
        onClick={() => setAddCatchOpen((open) => !open)}
        className="panel relative flex w-full flex-col items-center gap-2 overflow-hidden p-6 transition-colors hover:border-primary"
      >
        <img
          src="/premium/ajouter-prise-fond.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-55"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-background/60"
        />
        <CatchLogIcon className="relative h-12 w-14 text-primary drop-shadow" />
        <span className="relative font-display text-lg font-semibold drop-shadow">
          Ajouter une prise
        </span>
      </button>
      <section
        id="preview-add-catch"
        className="inner-panel mt-3 p-4"
        aria-labelledby="preview-add-catch-title"
        hidden={!addCatchOpen}
      >
        <h2 id="preview-add-catch-title" className="section-title">
          Photographier une prise
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dans River’Sense, prenez votre poisson en photo. L’IA analyse l’image et vous propose une
          espèce, que vous pouvez confirmer ou corriger avant d’enregistrer la prise.
        </p>
      </section>
      <section className="panel mt-5 p-4" aria-labelledby="preview-catch-title">
        {month === null ? (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="preview-catch-title" className="section-title flex items-center gap-2">
                <ChartSpline className="size-5 shrink-0 text-primary" aria-hidden />
                Mes prises
              </h2>
              <div
                role="group"
                aria-label="Vue des prises"
                className="relative flex shrink-0 rounded-full border border-border bg-secondary p-0.5"
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0.5 top-0.5 h-10 w-11 border border-foreground/30 bg-muted shadow-sm transition-[transform,translate,border-radius] duration-200 motion-reduce:transition-none ${overview === "species" ? "translate-x-full rounded-r-[1.25rem]" : "rounded-l-[1.25rem]"}`}
                />
                <button
                  type="button"
                  aria-label="Afficher le graphique annuel"
                  aria-pressed={overview === "chart"}
                  className={`relative flex h-10 w-11 items-center justify-center rounded-l-full ${overview === "chart" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setOverview("chart")}
                >
                  <ChartColumn className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Afficher les espèces"
                  aria-pressed={overview === "species"}
                  className={`relative flex h-10 w-11 items-center justify-center rounded-r-full ${overview === "species" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setOverview("species")}
                >
                  <List className="size-5" aria-hidden />
                </button>
              </div>
            </div>
            {overview === "chart" ? (
              <>
                <CatchChart counts={counts} year={year} onMonth={setMonth} />
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Touchez un mois pour voir vos prises.
                </p>
              </>
            ) : (
              <CatchSpeciesTable entries={entries} year={year} species={species} />
            )}
            <p className="mt-3 text-center text-sm font-semibold">{year}</p>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="preview-catch-title" className="section-title">
                  {FULL_MONTHS[month]} {year}
                </h2>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {visible.length} prise{visible.length === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer les prises du mois"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary"
                onClick={() => setMonth(null)}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {visible.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">Aucune prise ce mois-ci.</p>
            ) : (
              <ul className="space-y-2">
                {visible.map((entry) => {
                  const label = species.find((fish) => fish.id === entry.speciesId)?.label;
                  return (
                    <li
                      key={entry.caughtAt}
                      className="inner-panel overflow-hidden p-3 @max-[20rem]:p-2"
                    >
                      <div className="flex items-center gap-2 @max-[20rem]:gap-1">
                        <span
                          className="flex h-10 w-16 shrink-0 items-center justify-center @max-[20rem]:w-10"
                          aria-hidden="true"
                        >
                          <img
                            src={FISH_SPECIES_IMAGES[entry.speciesId]}
                            alt=""
                            width={80}
                            height={40}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-semibold">{label}</p>
                          <time
                            dateTime={entry.caughtAt}
                            className="block text-[10px] whitespace-nowrap text-muted-foreground"
                          >
                            {catchDate.format(new Date(entry.caughtAt))}
                          </time>
                        </div>
                        <button
                          type="button"
                          disabled
                          aria-label={`Modifier ${label}`}
                          title="Modifier la prise"
                          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary disabled:opacity-50 @max-[20rem]:size-8"
                        >
                          <Pencil className="size-4" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </section>
      <section className="panel mt-5 p-4" aria-labelledby="preview-trophies-title">
        <h2 id="preview-trophies-title" className="section-title mb-3 flex items-center gap-2">
          <Trophy className="size-5 text-primary" aria-hidden /> Trophées
        </h2>
        {selectedPhoto ? (
          <figure className="inner-panel overflow-hidden">
            <img
              src={`/premium/galerie-${selectedPhoto.id}.webp`}
              alt={selectedPhoto.alt}
              width="780"
              height="520"
              className="h-auto w-full"
            />
            <figcaption className="flex items-center justify-between gap-2 p-2 text-sm">
              {selectedPhoto.label}
              <button
                type="button"
                className="rounded-full px-2 py-1 text-primary"
                onClick={() => setSelectedPhoto(null)}
              >
                Fermer
              </button>
            </figcaption>
          </figure>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                aria-label={`Agrandir la photo : ${photo.label}`}
                className="aspect-square overflow-hidden rounded-lg border border-border"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={`/premium/galerie-${photo.id}.webp`}
                  alt={photo.alt}
                  width="780"
                  height="520"
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>
    </PreviewPhone>
  );
}
