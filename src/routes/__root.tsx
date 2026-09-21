import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { DeferredToaster } from "@/components/ui/deferred-toaster";
import { Analytics } from "@/components/site/Analytics";
import { CookieConsent } from "@/components/site/CookieConsent";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Assisty AI, an AI assistant that answers your calls" },
      { name: "description", content: "Join the Assisty AI waitlist. It answers your phone when you cannot, talks to the caller naturally, and gives you a summary in the app. Genuine emergencies reach you directly, within minutes." },
      { name: "author", content: "Assisty AI" },
      { property: "og:title", content: "Assisty AI, an AI assistant that answers your calls" },
      { property: "og:description", content: "Join the Assisty AI waitlist. It answers your phone when you cannot, talks to the caller naturally, and gives you a summary in the app. Genuine emergencies reach you directly, within minutes." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://assistyai.in/og-hero.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Assisty AI answering calls on a phone, with the conversations it handles around it" },
      { name: "twitter:image", content: "https://assistyai.in/og-hero.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@AssistyAI" },
      { name: "twitter:title", content: "Assisty AI, an AI assistant that answers your calls" },
      { name: "twitter:description", content: "Join the Assisty AI waitlist. It answers your phone when you cannot, talks to the caller naturally, and gives you a summary in the app. Genuine emergencies reach you directly, within minutes." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700&family=Caveat:wght@500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Assisty AI",
            url: "https://assistyai.in/",
            logo: "https://assistyai.in/favicon.png",
            description:
              "Assisty AI answers your phone when you cannot, talks to the caller naturally, and gives you a plain-language summary. Genuine emergencies reach you directly, within minutes.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Assisty AI",
            url: "https://assistyai.in/",
          },
        ]),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieConsent />
      <Analytics />
      <DeferredToaster position="top-center" />
    </QueryClientProvider>
  );
}
