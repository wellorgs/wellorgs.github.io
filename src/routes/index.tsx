import { createFileRoute, Link } from "@tanstack/react-router";

import { HandMockup } from "@/components/site/HandMockup";

import { FaqSection, topFaqs } from "@/components/site/FaqSection";
import { VoiceIntro } from "@/components/site/VoiceIntro";
import { FeatureSections } from "@/components/site/FeatureSections";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
// PRICING HIDDEN - section exists in components/site/Pricing.tsx, commented out until pricing is finalised
// import { Pricing } from "@/components/site/Pricing";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/site/Reveal";
import { SiteHeader } from "@/components/site/SiteHeader";
import { RealCalls } from "@/components/site/RealCalls";
import { EscalationSpotlight, TrustStrip, WhoFor } from "@/components/site/NewSections";
import { LANGUAGE_COUNT } from "@/siteFacts";
import { WaitlistForm } from "@/components/site/WaitlistForm";


const HOME_TITLE = "Assisty AI, an AI assistant that answers your calls";
const HOME_DESCRIPTION =
  "Join the Assisty AI waitlist. It answers your phone when you cannot, talks to the caller naturally, and gives you a summary in the app. Genuine emergencies reach you directly, within minutes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://myassistant.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:description", content: HOME_DESCRIPTION },
    ],

    links: [{ rel: "canonical", href: "https://myassistant.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: topFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: Landing,
});


const stats = [
  { value: "1,400+", label: "on the waitlist" },
  { value: LANGUAGE_COUNT, label: "languages, including regional" },
  { value: "< 2 min", label: "to a full summary" },
];


function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <MobileCtaBar />

      <main className="pb-16 md:pb-0">
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden bg-accent/35">
          <div className="relative mx-auto max-w-6xl px-4 pb-0 pt-10 text-center sm:px-5 sm:pt-16 lg:pt-20">
            <h1 className="animate-rise mx-auto max-w-4xl text-[34px] font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              You can't answer every call. <span className="text-primary">Assisty can.</span>
            </h1>
            <p className="animate-rise mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Assisty answers your incoming calls when you're busy, understands why they're calling,
              and if it's real, it calls you back.
            </p>
            <p className="animate-rise mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              You're with a patient, in a meeting, driving, asleep, your phone doesn't know, and it keeps ringing anyway.
            </p>


            <div id="waitlist" className="animate-rise mx-auto mt-8 max-w-lg scroll-mt-24">
              <WaitlistForm />
              <p className="mx-auto mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-xs">
                Routine → Handled · Important → Summarized · Escalated → Calls you
              </p>
              {/* PRICING PENDING - "First 7 days free at launch" pill removed until pricing is finalised. Original:
              <p className="shine-pill mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight text-foreground sm:text-sm">
                <Sparkles className="animate-spark size-4 text-primary" strokeWidth={2} />
                First 7 days free at launch
                <span className="font-normal text-muted-foreground">No spam, ever.</span>
              </p>
              (also re-add: import { Sparkles } from "lucide-react") */}
            </div>

            <VoiceIntro />

            <div className="mx-auto mt-10 max-w-[1200px] sm:mt-12">
              <HandMockup />
            </div>
          </div>
          <div aria-hidden className="hero-edge-blur pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-16 [mask-image:linear-gradient(to_bottom,transparent,black_70%)]" />
        </section>

        {/* Stats */}
        <section className="relative z-10 -mt-8 rounded-t-xl bg-background">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-10 pt-10 sm:grid-cols-3 sm:px-5 md:pb-12">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 90}
                className="rounded-xl bg-card px-5 py-7 text-center sm:px-7 sm:py-8"
              >
                <p className="text-3xl font-semibold leading-none sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2.5 text-[13px] leading-snug text-muted-foreground sm:text-sm">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <RealCalls />

        <EscalationSpotlight />

        {/* Features */}
        <FeatureSections />

        <WhoFor />

        <TrustStrip />

        {/* Pricing */}
        {/* PRICING HIDDEN - restore <Pricing /> (and the import above) once pricing is ready */}
        {/* <Pricing /> */}

        <FaqSection />

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-5">
          <div className="rounded-4xl bg-primary px-5 py-11 text-center sm:px-8 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-primary-foreground sm:text-[44px]">
              You can't answer every call. You shouldn't have to.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-primary-foreground/80 sm:text-base">
              Assisty handles your incoming calls when you're busy, gives you the context you need, and calls you when it's real.
            </p>

            <div className="mx-auto mt-7 max-w-lg">
              <WaitlistForm onPrimary />
              <p className="mt-5 text-sm font-medium text-primary-foreground/90">
                Every call handled. Only what matters reaches you.
              </p>

            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
