import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../legal/LegalPage";
import landingCss from "../landing.css?url";

const title = "Conditions d’utilisation";

export const Route = createFileRoute("/conditions-utilisation")({
  head: () => ({
    meta: [{ title: title + " | River’Sense" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "stylesheet", href: landingCss }],
  }),
  component: () => <LegalPage title={title} />,
});
