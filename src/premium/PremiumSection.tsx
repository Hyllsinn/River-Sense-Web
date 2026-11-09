import { Camera, ChartColumn, CloudSun, ShieldCheck } from "lucide-react";

import { CatchBookPreview } from "./CatchBookPreview";

export function PremiumSection() {
  return (
    <section className="rs-panel" id="premium" aria-labelledby="premium-title">
      <div className="rs-hero-inner rs-premium-layout">
        <CatchBookPreview />
        <div className="rs-intro">
          <h2 id="premium-title">Plus qu’un simple carnet de pêche, un autre outil d’analyse</h2>
          <p className="rs-lead">
            En souscrivant à l’abonnement Premium, vous soutenez le projet River’Sense et accédez à
            des fonctionnalités d’analyse supplémentaires.
          </p>
          <ul className="rs-premium-benefits">
            <li>
              <Camera size={20} aria-hidden="true" />
              <p>
                <strong>Enregistrez une prise en photo.</strong> L’IA reconnaît l’espèce et ajoute la prise à votre album.
                Créez aussi votre galerie de poissons trophées.
              </p>
            </li>
            <li>
              <ChartColumn size={20} aria-hidden="true" />
              <p>
                <strong>Relisez votre saison.</strong> Consultez le graphique annuel, retrouvez les
                prises du mois et comparez vos résultats de pêche par espèce.
              </p>
            </li>
            <li>
              <CloudSun size={20} aria-hidden="true" />
              <p>
                <strong>Sachez à quoi vous attendre.</strong> Activez la fonction météo heure par heure
                et découvrez comment sera le ciel pendant votre partie de pêche.
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
        </div>
      </div>
    </section>
  );
}
