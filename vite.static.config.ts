import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Static build for GitHub Pages: client-only SPA shell, no server runtime.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } },
  },
  vite: {
    base: process.env["SITE_BASE"] ?? "/",
    build: { outDir: "dist-static" },
  },
});
