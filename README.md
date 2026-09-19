# MyAssistant website

Marketing site for MyAssistant (TanStack Start, React 19, Tailwind v4).

- Dev: `pnpm install && pnpm dev`
- Static build (GitHub Pages): `pnpm exec vite build --config vite.static.config.ts` (output in `dist-static/client`)
- Deploys automatically from `main` via `.github/workflows/pages.yml`.

The waitlist form and feature board need a backend that GitHub Pages cannot run; they are placeholders until the backend is swapped in.
