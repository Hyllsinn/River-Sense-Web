import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../legal/LegalPage";
import landingCss from "../landing.css?url";

const title = "Politique de confidentialité";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [{ title: title + " | River’Sense" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "stylesheet", href: landingCss }],
  }),
  component: () => <LegalPage title={title} />,
});
