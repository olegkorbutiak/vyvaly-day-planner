import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Perfect Day Planner",
    short_name: "Day Planner",
    description: "Диктуй або пиши все, що в голові — розберемо на задачі пізніше.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f2f3",
    theme_color: "#04170f",
    orientation: "portrait",
    lang: "uk",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
