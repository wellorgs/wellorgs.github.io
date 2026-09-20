# Assisty AI website

Marketing site for Assisty AI (https://assistyai.in). TanStack Start + React + Tailwind, deployed to Cloudflare Pages.

## Develop
```
pnpm install
pnpm dev            # http://localhost:8080
```

## Build
- `pnpm build`  Cloudflare Pages build (SSR + server functions), output `dist`.
- `pnpm build:static`  Static SPA build for GitHub Pages, output `dist-static/client` (no waitlist/board/sitemap: those need the server).

## Environment
Build-time: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.
Runtime (Cloudflare Pages secrets): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `WAITLIST_ADMIN_PASSCODE`.
