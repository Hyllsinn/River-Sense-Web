import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ma page" },
      { name: "description", content: "Page vierge prête à être codée." },
      { property: "og:title", content: "Ma page" },
      { property: "og:description", content: "Page vierge prête à être codée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return <main className="min-h-screen bg-background" />;
}
