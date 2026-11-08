import { Camera, ChartColumn, ShieldCheck, Sparkles } from "lucide-react";

import { CatchBookPreview } from "./CatchBookPreview";

export function PremiumSection() {
  return (
    <section className="rs-panel" id="premium" aria-labelledby="premium-title">
      <div className="rs-hero-inner">
        <div className="rs-intro">
          <p className="rs-eyebrow">
            <Sparkles size={15} aria-hidden="true" /> River’Sense Premium
          </p>
          <h2 id="premium-title">Le carnet de vos sorties pêche</h2>
          <p className="rs-lead">
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
        </div>
        <CatchBookPreview />
      </div>
    </section>
  );
}
