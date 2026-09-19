import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TrustSection } from "@/components/site/TrustSection";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy | Assisty AI" },
      { name: "description", content: "How Assisty AI handles call recordings, retention, deletion and third-party processors." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-10">
        {/* PRIVACY PENDING - retention period, AI-training stance and processor list still need legal review */}
        <TrustSection />
      </main>
      <SiteFooter />
    </div>
  ),
});
