import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// GitHub Pages serves this repo at /Flore-Azzouz-WebPage/, not at the domain
// root, so it needs a `base`. The Vercel production build (custom domain)
// stays at "/". Toggled by the GITHUB_PAGES env var set in the Pages workflow.
const isGithubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  site: isGithubPages ? "https://mazztok45.github.io" : "https://www.floreazzouz.fr",
  base: isGithubPages ? "/Flore-Azzouz-WebPage/" : "/",
  output: "static",
  integrations: [tailwind(), react()],
  adapter: vercel(),
});
