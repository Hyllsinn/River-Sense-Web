import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudSun, Activity, ArrowUpRight, Camera, MapPin, Smartphone, Waves } from "lucide-react";
import { MobilePreview } from "../mobile-preview/MobilePreview";

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
    links: [
      { rel: "stylesheet", href: landingCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter+Tight:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

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
    body: "Enregistrez vos prises, identifiez un poisson à partir d’une photo et retrouvez vos statistiques par mois et par espèce.",
  },
];

function Index() {
  return (
    <div className="rs-site">
      <a className="rs-skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="rs-header">
        <a className="rs-banner" href="/" aria-label="River’Sense, accueil">
          <img
            src="/river-sense-banner.webp"
            alt="River’Sense · Catch the moment"
            width="1280"
            height="480"
            fetchPriority="high"
          />
        </a>
      </header>
      <main id="contenu">
        <section className="rs-hero rs-panel" aria-labelledby="hero-title">
          <div className="rs-hero-inner">
            <div className="rs-intro">
              <p className="rs-eyebrow">
                <span /> L’application de pêche en rivière
              </p>
              <h1 id="hero-title">
                Analysez, <em>et saisissez le bon moment pour pêcher</em>
              </h1>
              <p className="rs-lead">
                L’activité des poissons, la météo et les conditions de la rivière au même endroit
                pour préparer votre prochaine sortie.
              </p>
              <div className="rs-actions" aria-label="Boutiques mobiles" role="group">
                <a className="rs-store-link" href="https://apps.apple.com/fr/iphone/today">
                  <span className="rs-store-icon rs-store-icon-apple" aria-hidden="true">
                    <Smartphone size={25} />
                  </span>
                  <span>
                    <small>Télécharger sur</small>
                    <strong>App Store</strong>
                  </span>
                  <ArrowUpRight className="rs-store-arrow" size={15} aria-hidden="true" />
                </a>
                <a className="rs-store-link" href="https://play.google.com/store/apps?hl=fr">
                  <svg className="rs-store-icon" viewBox="0 0 32 32" aria-hidden="true">
                    <path fill="#32BBF1" d="M5 3v26l13-13z" />
                    <path fill="#00D086" d="M5 3c.6-.5 1.4-.5 2.2 0l15.7 8.9L18 16z" />
                    <path fill="#FFCC33" d="m18 16 4.9-4.1 5.5 3.1c.9.5.9 1.5 0 2l-5.5 3.1z" />
                    <path fill="#FF4761" d="m18 16 4.9 4.1L7.2 29c-.8.5-1.6.5-2.2 0z" />
                  </svg>
                  <span>
                    <small>Télécharger sur</small>
                    <strong>Google Play</strong>
                  </span>
                  <ArrowUpRight className="rs-store-arrow" size={15} aria-hidden="true" />
                </a>
              </div>
              <p className="rs-coverage">
                <MapPin size={15} aria-hidden="true" /> Rivières de France métropolitaine
              </p>
            </div>
            <MobilePreview />
          </div>
        </section>
        <section className="rs-features" id="fonctionnalites" aria-labelledby="features-title">
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
        <section className="rs-launch rs-panel" id="application" aria-labelledby="launch-title">
          <div className="rs-launch-panel">
            <div>
              <p className="rs-eyebrow">
                <span /> Sur votre téléphone
              </p>
              <h2 id="launch-title">Retrouvez River’Sense au bord de l’eau.</h2>
              <p>
                River’Sense est disponible sur Android et iOS. Consultez les conditions de votre
                rivière directement sur votre téléphone.
              </p>
            </div>
            <div className="rs-platforms" aria-label="Plateformes disponibles">
              <span>
                <Smartphone size={19} aria-hidden="true" /> Android
              </span>
              <span>
                <Smartphone size={19} aria-hidden="true" /> iOS
              </span>
            </div>
          </div>
        </section>
        <section className="rs-help rs-panel" id="assistance" aria-labelledby="help-title">
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
      <footer className="rs-footer rs-panel">
        <div className="rs-footer-grid">
          <div>
            <Brand />
            <p>Les conditions de pêche en rivière, espèce par espèce.</p>
          </div>
          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal">Informations légales</h2>
            <ul>
              <li>
                <Link to="/confidentialite">Politique de confidentialité</Link>
              </li>
              <li>
                <Link to="/conditions-utilisation">Conditions d’utilisation</Link>
              </li>
              <li>
                <a href="#assistance">Assistance</a>
              </li>
            </ul>
          </nav>
          <div>
            <h2>Contact</h2>
            <a className="rs-footer-email" href="mailto:riversense-mobile@orange.fr">
              riversense-mobile@orange.fr
            </a>
          </div>
        </div>
        <p className="rs-footer-copyright">© 2026 River’Sense. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
