import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function LegalPage({ title }: { title: string }) {
  return (
    <div className="rs-site">
      <main className="rs-panel rs-legal-page" aria-labelledby="legal-title">
        <Link className="rs-text-link" to="/">
          <ArrowLeft size={17} aria-hidden="true" /> Retour à River’Sense
        </Link>
        <h1 id="legal-title">{title}</h1>
        <p className="rs-legal-status">Texte en cours de finalisation.</p>
        <Link className="rs-text-link" to="/" hash="assistance">
          Contacter l’assistance
        </Link>
      </main>
    </div>
  );
}
