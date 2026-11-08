import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Camera,
  CloudSun,
  Fish,
  MapPin,
  Smartphone,
  Waves,
} from "lucide-react";
import { useState } from "react";

import landingCss from "../landing.css?url";

const title = "River’Sense | Préparez vos sorties pêche en rivière";
const description =
  "Activité des poissons heure par heure, météo et données de rivière. Découvrez River’Sense, l’application mobile pour préparer vos sorties pêche.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: landingCss }],
  }),
  component: Index,
});

const previews = {
  Perche: {
    time: "07 h",
    score: 82,
    curve:
      "M0 75 C12 76 21 79 34 71 S56 32 73 23 S92 32 105 38 S125 48 136 60 S156 70 169 63 S190 47 201 49 S224 70 240 73",
  },
  Sandre: {
    time: "19 h",
    score: 86,
    curve:
      "M0 64 C15 55 24 55 40 61 S65 70 82 66 S108 72 124 73 S146 75 163 66 S186 44 199 28 S219 29 240 50",
  },
  "Truite fario": {
    time: "09 h",
    score: 78,
    curve:
      "M0 80 C14 80 27 75 39 65 S60 46 75 38 S92 27 103 32 S128 57 144 61 S162 64 176 58 S199 57 210 65 S229 76 240 81",
  },
};

type Species = keyof typeof previews;

function Brand() {
  return (
    <a className="rs-brand" href="/" aria-label="River’Sense, accueil">
      <span className="rs-brand-icon">
        <Waves size={20} aria-hidden="true" />
      </span>
      River’Sense
    </a>
  );
}

function ActivityPreview() {
  const [species, setSpecies] = useState<Species>("Perche");
  const { score, time, curve } = previews[species];

  return (
    <figure className="rs-preview">
      <div className="rs-phone">
        <div className="rs-phone-top">
          <span>
            <Waves size={16} aria-hidden="true" /> River’Sense
          </span>
          <CloudSun size={19} aria-hidden="true" />
        </div>
        <div className="rs-phone-place">
          <MapPin size={17} aria-hidden="true" />
          <div>
            <strong>Cognac</strong>
            <small>La Charente</small>
          </div>
        </div>
        <div className="rs-phone-card">
          <div className="rs-phone-label">
            <Activity size={15} aria-hidden="true" /> Activité estimée
          </div>
          <div className="rs-species" role="group" aria-label="Espèce à afficher">
            {(Object.keys(previews) as Species[]).map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={species === name}
                onClick={() => setSpecies(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="rs-score" aria-live="polite">
            <strong>
              {score}
              <span> %</span>
            </strong>
            <small>Pic estimé · {time}</small>
          </p>
          <svg
            className="rs-chart"
            viewBox="0 0 240 96"
            role="img"
            aria-label={`Profil horaire illustratif pour ${species}`}
          >
            <defs>
              <linearGradient id="river-activity" x2="0" y2="1">
                <stop stopColor="#58a878" stopOpacity=".46" />
                <stop offset="100%" stopColor="#58a878" stopOpacity=".02" />
              </linearGradient>
            </defs>
            <path d="M0 22H240 M0 46H240 M0 70H240 M0 94H240" stroke="#d7e4d6" fill="none" />
            <path d={`${curve} L240 96 H0 Z`} fill="url(#river-activity)" />
            <path d={curve} stroke="#27734d" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
          <div className="rs-chart-times" aria-hidden="true">
            <span>00 h</span>
            <span>06 h</span>
            <span>12 h</span>
            <span>18 h</span>
            <span>24 h</span>
          </div>
        </div>
        <div className="rs-phone-bottom">
          <Waves size={16} aria-hidden="true" /> Niveau · Débit · Température
        </div>
      </div>
      <figcaption>Aperçu interactif · Données illustratives</figcaption>
    </figure>
  );
}

function RiverLandscape() {
  return (
    <svg
      className="rs-landscape"
      viewBox="0 0 800 480"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="river-sky" x2="0" y2="1">
          <stop stopColor="#b6d1bb" stopOpacity="0" />
          <stop offset="1" stopColor="#b6d1bb" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="river-water" x2="0" y2="1">
          <stop stopColor="#dfe8d2" />
          <stop offset="1" stopColor="#8cbaa6" />
        </linearGradient>
      </defs>
      <circle cx="638" cy="187" r="63" fill="#f7e8b8" opacity=".75" />
      <path
        d="M0 275 Q170 160 321 251 T585 235 Q696 186 800 241 V480 H0Z"
        fill="#b7d0bb"
        opacity=".6"
      />
      <path d="M0 304 Q164 231 299 299 T553 290 Q685 217 800 281 V480 H0Z" fill="url(#river-sky)" />
      <path
        d="M0 340 Q115 275 295 326 T571 312 Q681 270 800 305 V480 H0Z"
        fill="#8eaf98"
        opacity=".62"
      />
      <path
        d="M563 323 C650 336 663 349 568 369 C472 390 329 381 321 418 C313 449 459 452 458 480 H800 V359 C751 345 658 331 563 323Z"
        fill="url(#river-water)"
      />
      <path
        d="M573 379 Q637 364 704 377 M465 418 Q562 401 686 410 M528 445 Q641 425 773 437"
        fill="none"
        stroke="#eaf0de"
        strokeWidth="2"
        opacity=".7"
      />
      <path d="M0 399 Q105 347 205 391 T314 480 H0Z" fill="#729b83" opacity=".6" />
    </svg>
  );
}

const features = [
  {
    icon: Activity,
    label: "Choisir son créneau",
    title: "L’activité heure par heure",
    body: "Comparez les moments de la journée selon l’espèce recherchée. La courbe vous aide à repérer les créneaux où l’activité est estimée plus forte.",
  },
  {
    icon: CloudSun,
    label: "Lire les conditions",
    title: "La météo et la rivière",
    body: "Consultez les prévisions, le niveau et le débit lorsque les relevés sont disponibles, ainsi qu’une estimation de la température de l’eau.",
  },
  {
    icon: Camera,
    label: "Garder une trace · Premium",
    title: "Le carnet de prises",
    body: "Enregistrez vos prises, identifiez un poisson à partir d’une photo et retrouvez vos statistiques par mois et par espèce. Le carnet reste sur votre téléphone.",
  },
];

function Index() {
  return (
    <div className="rs-site">
      <a className="rs-skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="rs-header rs-container">
        <Brand />
        <nav aria-label="Navigation principale">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#assistance">Assistance</a>
          <a className="rs-header-cta" href="#application">
            L’application <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
      </header>
      <main id="contenu">
        <section className="rs-hero">
          <RiverLandscape />
          <div className="rs-container rs-hero-inner">
            <div className="rs-intro">
              <p className="rs-eyebrow">
                <span /> L’application de pêche en rivière
              </p>
              <h1>
                Lisez la rivière.
                <br />
                <em>Choisissez votre moment.</em>
              </h1>
              <p className="rs-lead">
                L’activité des poissons, la météo et les conditions de la rivière au même endroit
                pour préparer votre prochaine sortie.
              </p>
              <div className="rs-actions">
                <a className="rs-button" href="#fonctionnalites">
                  Découvrir River’Sense <ArrowDown size={18} aria-hidden="true" />
                </a>
                <a className="rs-text-link" href="#application">
                  Lancement mobile <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
              <p className="rs-coverage">
                <MapPin size={15} aria-hidden="true" /> Rivières de France métropolitaine
              </p>
            </div>
            <ActivityPreview />
          </div>
        </section>
        <section
          className="rs-container rs-features"
          id="fonctionnalites"
          aria-labelledby="features-title"
        >
          <p className="rs-eyebrow">
            <span /> De la préparation au retour
          </p>
          <h2 id="features-title">
            Chaque sortie commence
            <br />
            bien avant le premier lancer.
          </h2>
          <div className="rs-feature-grid">
            {features.map(({ icon: Icon, label, title: heading, body }) => (
              <article key={heading} className="rs-feature">
                <span className="rs-feature-icon">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <p>{label}</p>
                <h3>{heading}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="rs-container rs-launch" id="application" aria-labelledby="launch-title">
          <div className="rs-launch-panel">
            <div>
              <p className="rs-eyebrow">
                <span /> Sur votre téléphone
              </p>
              <h2 id="launch-title">Retrouvez bientôt River’Sense au bord de l’eau.</h2>
              <p>
                Le lancement mobile est en préparation. Les liens de téléchargement seront ajoutés
                ici dès leur disponibilité.
              </p>
            </div>
            <div className="rs-platforms" aria-label="Plateformes prévues">
              <span>
                <Smartphone size={19} aria-hidden="true" /> Android
              </span>
              <span>
                <Smartphone size={19} aria-hidden="true" /> iOS
              </span>
            </div>
          </div>
        </section>
        <section className="rs-container rs-help" id="assistance" aria-labelledby="help-title">
          <div>
            <p className="rs-eyebrow">
              <span /> Assistance
            </p>
            <h2 id="help-title">Une question sur River’Sense ?</h2>
          </div>
          <a className="rs-text-link" href="mailto:riversense-mobile@orange.fr">
            Écrire à l’assistance <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </section>
      </main>
      <footer className="rs-footer">
        <div className="rs-container">
          <Brand />
          <p>
            <Fish size={17} aria-hidden="true" /> Pour les pêcheurs en rivière.
          </p>
          <a href="#assistance">Assistance</a>
        </div>
      </footer>
    </div>
  );
}
