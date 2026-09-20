import { useEffect } from "react";

import { useAnalyticsConsent } from "@/components/site/CookieConsent";

// Microsoft Clarity (free heatmaps + session recordings), loaded only after the visitor allows analytics.
// The project ID is public (it ships in the page), so it lives here, not in Cloudflare env vars.
const ID = "ylfk48tl6h";

type Clarity = ((...args: unknown[]) => void) & { q?: unknown[] };

export function Analytics() {
  const allowed = useAnalyticsConsent();

  useEffect(() => {
    const w = window as unknown as { clarity?: Clarity };
    if (allowed && !w.clarity) {
      const c: Clarity = (...args) => {
        (c.q = c.q || []).push(args);
      };
      w.clarity = c;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.clarity.ms/tag/${ID}`;
      document.head.appendChild(s);
    }
    w.clarity?.("consent", allowed);
  }, [allowed]);

  return null;
}
