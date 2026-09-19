import { createFileRoute } from "@tanstack/react-router";

import { FaqSection, faqs } from "@/components/site/FaqSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Assisty AI" },
      { name: "description", content: "Answers to common questions about how Assisty AI answers your calls." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-10">
        <FaqSection all />
      </main>
      <SiteFooter />
    </div>
  ),
});
