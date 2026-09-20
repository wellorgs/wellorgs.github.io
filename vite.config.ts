import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Cloudflare Pages build: SSR + server functions run as a Pages _worker.js.
export default defineConfig({
  server: { port: 8080 },
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"] },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    nitro({ preset: "cloudflare-pages", compatibilityDate: "2025-09-01" }),
  ],
  build: { outDir: "dist" },
});
