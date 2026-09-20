import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Static build for GitHub Pages: client-only SPA shell, no server runtime.
export default defineConfig({
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"] },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } } }),
    viteReact(),
  ],
  base: process.env["SITE_BASE"] ?? "/",
  build: { outDir: "dist-static" },
});
