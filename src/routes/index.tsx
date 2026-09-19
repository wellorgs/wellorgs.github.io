import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircleHeart, Sparkles } from "lucide-react";

import { AppScreens } from "@/components/site/AppScreens";
import { HandMockup } from "@/components/site/HandMockup";

import { FaqSection, faqs } from "@/components/site/FaqSection";
import { FeatureSections } from "@/components/site/FeatureSections";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
import { Pricing } from "@/components/site/Pricing";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/site/Reveal";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TrustSection } from "@/components/site/TrustSection";
import { WaitlistForm } from "@/components/site/WaitlistForm";


const HOME_TITLE = "MyAssistant, an AI assistant that answers your calls";
const HOME_DESCRIPTION =
  "Join the MyAssistant waitlist. It answers your phone when you cannot, talks to the caller naturally, and gives you a summary in the app. Genuine emergencies reach you directly, within minutes.";

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
          mainEntity: faqs.map((f) => ({
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
  { value: "1,400+", label: "people on the waitlist" },
  { value: "10+", label: "Indian languages supported" },
  { value: "< 2 min", label: "average emergency response" },
];

const verticals = [
  "Real estate agents",
  "Immigration consultants",
  "Lawyers",
  "Doctors and clinics",
  "IT freelancers",
  "Delivery coordinators",
  "Property managers",
  "Insurance agents",
  "Accountants",
  "Salon and spa owners",
  "Contractors",
  "Travel agents",
  "Customer support teams",
  "Therapists",
  "Restaurant owners",
  "Wedding planners",
  "Recruiters",
  "Consultants of every kind",
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
            <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-soft">
              <span className="size-1.5 rounded-full bg-success" />
              Early access opening soon
            </span>
            <h1 className="animate-rise mx-auto mt-6 max-w-4xl text-[34px] font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Never miss a call that matters.
              <br />
              <span className="text-primary">Let MyAssistant answer.</span>
            </h1>
            <p className="animate-rise mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              MyAssistant picks up when you cannot, talks to the caller like a real person,
              and gives you a calm summary in the app the moment the call ends. Something
              genuinely urgent, and it calls you directly, within minutes.
            </p>


            <div id="waitlist" className="animate-rise mx-auto mt-8 max-w-lg scroll-mt-24">
              <WaitlistForm />
              <p className="shine-pill mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight text-foreground sm:text-sm">
                <Sparkles className="animate-spark size-4 text-primary" strokeWidth={2} />
                First 7 days free at launch
                <span className="font-normal text-muted-foreground">No spam, ever.</span>
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-[1200px] sm:mt-12">
              <HandMockup />
            </div>
          </div>
          <div aria-hidden className="hero-edge-blur pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-16 backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,transparent,black_70%)]" />
        </section>

        {/* Stats */}
        <section className="relative z-10 -mt-8 rounded-t-[2.5rem] bg-background shadow-[0_-18px_40px_-18px_rgb(0_0_0/0.22)]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-10 pt-10 sm:grid-cols-3 sm:px-5 md:pb-12">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 90}
                className="rounded-2xl border border-border bg-card px-5 py-7 text-center shadow-soft sm:px-7 sm:py-8"
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

        {/* Real app screens */}
        <AppScreens />


        {/* Features */}
        <FeatureSections />


        {/* Who it's for */}
        <section id="who" className="cv-auto mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-bold leading-tight sm:text-4xl">
              Built for people
              <span className="text-muted-foreground"> who live on the phone.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Anyone fielding a steady stream of calls can hand the phone to MyAssistant.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {verticals.map((v, i) => (
              <Reveal key={v} delay={i * 35}>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/85 shadow-soft">
                  {v}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Two sides */}
        <section className="cv-auto mx-auto max-w-6xl px-4 pb-16 sm:px-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="rounded-4xl bg-tint-green p-7 shadow-soft sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                For your callers
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[28px]">
                Feels like a real person answered.
              </h2>
              <ul className="mt-6 space-y-3.5 text-[15px] leading-relaxed text-foreground/75">
                <li>No menus to press through, just a real conversation</li>
                <li>Talks in whatever language they are comfortable in</li>
                <li>Their message reaches you, worded the way they said it</li>
              </ul>
            </Reveal>
            <Reveal delay={110} className="rounded-4xl bg-tint-blue p-7 shadow-soft sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                For you
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[28px]">
                A dashboard that stays quiet.
              </h2>
              <ul className="mt-6 space-y-3.5 text-[15px] leading-relaxed text-foreground/75">
                <li>One summary per call, not a pile of missed-call alerts</li>
                <li>Only interrupted for a confirmed, genuine emergency</li>
                <li>Full call history and transcripts whenever you want to check</li>
              </ul>
            </Reveal>
          </div>
        </section>


        {/* Pricing */}
        <Pricing />

        {/* Trust, security and emergency response */}
        <TrustSection />


        {/* FAQ */}
        <FaqSection />


        {/* Feature board teaser */}

        <section id="board" className="cv-auto mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-5">
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-4xl border border-border/50 bg-card p-7 shadow-soft sm:flex-row sm:items-center sm:p-10">
            <div className="max-w-xl">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-amber">
                <MessageCircleHeart className="size-5 text-foreground/80" strokeWidth={1.9} />
              </span>
              <h2 className="mt-5 text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[28px]">
                You decide what we build next
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed tracking-tight text-muted-foreground">
                Our roadmap is public. Post an idea, upvote what you need, and watch it
                move from exploring to shipped on the live board.
              </p>
            </div>
            <Link
              to="/features"
              className="btn-glow btn-sheen inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-foreground px-7 text-base font-semibold text-background sm:w-auto"
            >
              Open the live board
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-5">
          <div className="rounded-4xl bg-primary px-5 py-11 text-center shadow-lift sm:px-8 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-primary-foreground sm:text-[44px]">
              Let MyAssistant take the next call.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-primary-foreground/80 sm:text-base">
              Join 1,400+ people getting early access first.
            </p>

            <div className="mx-auto mt-7 max-w-lg">
              <WaitlistForm onPrimary />

            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
