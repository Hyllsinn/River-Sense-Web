import { Camera, ChartColumn, Fish, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import { CatchChart } from "./CatchChart";
import { CatchSpeciesTable } from "./CatchSpeciesTable";
import { FULL_MONTHS } from "./calendar";
import { counts, entries, species, year } from "./sample";

const gallery = [
  { id: "perche", label: "Perche", alt: "Une pêcheuse présente une perche au bord d’une rivière." },
  {
    id: "brochet",
    label: "Brochet",
    alt: "Un pêcheur tient un brochet au-dessus d’un tapis de réception.",
  },
  { id: "carpe", label: "Carpe", alt: "Une pêcheuse tient une carpe commune sur la berge." },
] as const;

function CatchStats() {
  const [bySpecies, setBySpecies] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const total = month === null ? 0 : (counts[month] ?? 0);

  return (
    <section className="mobile-demo rs-premium-stats" aria-labelledby="premium-catch-stats">
      <div className="rs-premium-stats-header">
        <h3 id="premium-catch-stats">Mes prises</h3>
        <div className="rs-premium-switch" role="group" aria-label="Vue du carnet">
          <button type="button" aria-pressed={!bySpecies} onClick={() => setBySpecies(false)}>
            <ChartColumn size={16} aria-hidden="true" /> Par mois
          </button>
          <button type="button" aria-pressed={bySpecies} onClick={() => setBySpecies(true)}>
            <Fish size={16} aria-hidden="true" /> Par espèce
          </button>
        </div>
      </div>
      {bySpecies ? (
        <CatchSpeciesTable entries={entries} year={year} species={species} />
      ) : (
        <CatchChart counts={counts} year={year} onMonth={setMonth} />
      )}
      <p className="rs-premium-chart-note" aria-live="polite">
        {bySpecies
          ? `Répartition des prises en ${year} · Exemple`
          : month === null
            ? `Touchez un mois pour voir vos prises · Exemple ${year}`
            : `${FULL_MONTHS[month]} ${year} · ${total} prise${total === 1 ? "" : "s"}`}
      </p>
    </section>
  );
}

export function PremiumSection() {
  return (
    <section className="rs-panel rs-premium" id="premium" aria-labelledby="premium-title">
      <div className="rs-premium-main">
        <div className="rs-premium-copy">
          <p className="rs-eyebrow">
            <Sparkles size={15} aria-hidden="true" /> River’Sense Premium
          </p>
          <h2 id="premium-title">Le carnet de vos sorties pêche</h2>
          <p className="rs-premium-intro">
            Retrouvez vos prises en photo et suivez votre saison, mois par mois et espèce par
            espèce.
          </p>
          <ul className="rs-premium-benefits">
            <li>
              <Camera size={20} aria-hidden="true" />
              <p>
                <strong>Enregistrez une prise en photo.</strong> Le carnet propose une espèce à
                partir de l’image. Vous pouvez aussi la choisir vous-même.
              </p>
            </li>
            <li>
              <ChartColumn size={20} aria-hidden="true" />
              <p>
                <strong>Relisez votre saison.</strong> Consultez le graphique annuel, touchez un
                mois pour retrouver les prises du mois et comparez vos résultats par espèce.
              </p>
            </li>
            <li>
              <ShieldCheck size={20} aria-hidden="true" />
              <p>
                <strong>Utilisez River’Sense sans publicité.</strong> Premium donne accès au carnet
                de prises et retire les annonces.
              </p>
            </li>
          </ul>
          <dl className="rs-premium-prices" aria-label="Tarifs Premium">
            <div>
              <dt>Mensuel</dt>
              <dd>
                0,99 € <span>/ mois</span>
              </dd>
            </div>
            <div>
              <dt>Annuel</dt>
              <dd>
                9,90 € <span>/ an</span>
              </dd>
            </div>
          </dl>
          <CatchStats />
        </div>
        <figure className="rs-premium-preview">
          <img
            src="/premium/carnet-riversense.webp"
            width="716"
            height="1500"
            loading="lazy"
            decoding="async"
            alt="Aperçu River’Sense montrant une perche identifiée et le graphique annuel du carnet de prises."
          />
          <figcaption>Aperçu du carnet River’Sense</figcaption>
        </figure>
      </div>
      <div className="rs-premium-gallery">
        <h3>Galerie de prises</h3>
        <p>Exemples de photos de pêche générées pour la démonstration.</p>
        <div className="rs-premium-gallery-grid">
          {gallery.map(({ id, label, alt }) => (
            <figure key={id}>
              <img
                src={`/premium/galerie-${id}.webp`}
                alt={alt}
                width="780"
                height="520"
                loading="lazy"
                decoding="async"
              />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
