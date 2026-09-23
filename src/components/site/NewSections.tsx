import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, MessageCircleHeart, Pause, PhoneCall, Play, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/site/Reveal";

const STROKE = 1.75;

const steps = [
  "Call comes in, you're busy, so Assisty picks up.",
  "Assisty has a real conversation and figures out what's needed.",
  "You get the summary and recording, or, if it's urgent, Assisty calls you.",
];

/** Compact 3-step strip that sits under the real-call carousel. */
export function HowStrip() {
  return (
    <div className="mx-auto mt-14 grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-5">
      {steps.map((s, i) => (
        <Reveal key={s} delay={i * 80}>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">{i + 1}. </span>
            {s}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

const points = [
  { icon: PhoneCall, title: "It calls you.", body: "For genuinely urgent or escalated matters, Assisty places a real phone call, not just a push notification." },
  { icon: Star, title: "VIP contacts don't wait.", body: "Mark someone priority and Assisty calls again if you don't pick up the first time, bypassing the normal one-time limit." },
  { icon: Eye, title: "It knows the difference.", body: "If a caller is exaggerating or just testing the bot, Assisty flags it instead of crying wolf." },
];

export function EscalationSpotlight() {
  const [paused, setPaused] = useState(false);
  const run = paused ? "paused" : "running";
  return (
    <section id="escalation" className="px-3 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-foreground px-6 py-14 text-background sm:px-12 sm:py-20 lg:px-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[34px] font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              When it's real.{" "}
              <span className="text-background/55">Assisty calls you.</span>
            </h2>
            <ul className="mt-10 space-y-7">
              {points.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <p.icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={STROKE} />
                  <div>
                    <p className="text-lg font-semibold">{p.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-background/70">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="flex flex-col items-center">
            <div className="relative flex size-44 items-center justify-center sm:size-56">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  className="ring-out absolute inset-0 rounded-full border-2 border-primary/60"
                  style={{ animation: "ring-out 2.6s ease-out infinite", animationDelay: `${i * 0.85}s`, animationPlayState: run }}
                />
              ))}
              <span
                className="ring-shake relative flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-28"
                style={{ animation: "ring-shake 2.6s ease-in-out infinite", animationPlayState: run }}
              >
                <PhoneCall className="size-10" strokeWidth={STROKE} />
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              aria-label={paused ? "Play animation" : "Pause animation"}
              className="mt-6 flex size-10 items-center justify-center rounded-full text-background/80 transition-colors hover:bg-background/10"
            >
              {paused ? <Play className="size-4" fill="currentColor" /> : <Pause className="size-4" fill="currentColor" />}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Pyramid: 6, then 8, then 10.
const audienceRows = [
  ["Doctors", "Lawyers", "Real Estate", "Consultants", "Freelancers", "Personal"],
  ["Dentists", "Therapists", "Architects", "Accountants", "Photographers", "Coaches", "Contractors", "Planners"],
  ["Founders", "Sales Teams", "Teachers", "Shop Owners", "Restaurants", "Home Services", "Delivery", "Parents", "Night Shifts", "Anyone busy"],
];

export function WhoFor() {
  return (
    <section id="who" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 text-center sm:px-5 sm:py-20">
      <Reveal>
        <h2 className="text-[28px] font-bold leading-tight sm:text-4xl">
          Built for people{" "}
          <span className="text-muted-foreground">who can't always pick up.</span>
        </h2>
        <div className="mt-8 space-y-2.5">
          {audienceRows.map((row, i) => (
            <Reveal key={i} delay={i * 120} className={`mx-auto flex flex-wrap items-center justify-center gap-2 xl:flex-nowrap ${["max-w-3xl", "max-w-5xl", "max-w-6xl"][i]}`}>
              {row.map((a) => (
                <span key={a} className="whitespace-nowrap rounded-lg bg-card px-3.5 py-2 text-sm font-medium text-foreground/85">
                  {a}
                </span>
              ))}
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function BoardCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-5 sm:pb-16">
      <Reveal className="flex flex-col gap-6 rounded-xl bg-card p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="flex size-12 items-center justify-center rounded-full bg-tint-amber">
            <MessageCircleHeart className="size-5 text-foreground/80" strokeWidth={STROKE} />
          </span>
          <h2 className="mt-5 text-[26px] font-bold leading-tight sm:text-[32px]">You decide what we build next</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Our roadmap is public. Post an idea, upvote what you need, and watch it move from exploring to shipped on the live board.
          </p>
        </div>
        <Link
          to="/features"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-90"
        >
          Open the live board <ArrowRight className="size-4" strokeWidth={2} />
        </Link>
      </Reveal>
    </section>
  );
}

type Testimonial = {
  name: string;
  country: string;
  title: string;
  quote: string;
};

// Real, approved reviews from early testers.
const testimonials: Testimonial[] = [
  { name: "Neha K.", country: "India", title: "Summaries that save time", quote: "I stopped worrying about missing important calls. The summaries tell me exactly what happened without making me listen to the whole conversation." },
  { name: "Kabir M.", country: "India", title: "It felt like a real conversation", quote: "The first call genuinely surprised me. It felt like someone was actually having a conversation instead of reading a script." },
  { name: "Hannah W.", country: "United Kingdom", title: "Handled a call during a meeting", quote: "It handled an unexpected call while I was in a meeting and captured every important detail. That's exactly what I wanted." },
  { name: "Marcus R.", country: "United States", title: "Natural, even when interrupted", quote: "The conversations feel natural, especially when people interrupt or change topics. It doesn't lose the flow." },
  { name: "Kavya N.", country: "India", title: "Knows what needs my attention", quote: "I love that it knows the difference between an ordinary call and something that actually needs my attention." },
  { name: "Liam T.", country: "Canada", title: "Faster than I expected", quote: "The response time was much faster than I expected, and the assistant didn't sound stiff or overly formal." },
  { name: "Jasleen B.", country: "India", title: "Someone reliable answering for me", quote: "It feels less like a call screening app and more like someone reliable answering on my behalf." },
  { name: "Grace L.", country: "Australia", title: "Summaries I can skim in seconds", quote: "The call summaries are clean and easy to skim. I know what matters in seconds." },
  { name: "Vikram D.", country: "India", title: "Escalation I can trust", quote: "The emergency escalation feature gave me confidence because it doesn't overreact, but it also doesn't miss serious situations." },
  { name: "Inês C.", country: "Portugal", title: "Adapts to natural conversation", quote: "The assistant adapts surprisingly well to natural conversations instead of forcing people into predefined answers." },
];

export function TrustStrip() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section id="trust" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-5">
        <h2 className="text-[28px] font-bold leading-tight sm:text-4xl">
          What early testers <span className="text-muted-foreground">are saying.</span>
        </h2>
      </div>

      <div
        ref={scroller}
        className="mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <figure key={t.name} className="flex w-[290px] shrink-0 snap-start flex-col justify-between rounded-xl bg-card p-6 sm:w-[340px] sm:p-7">
            <div>
              <div className="flex gap-1" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} className="size-4 fill-primary text-primary" strokeWidth={0} />
                ))}
              </div>
              <h3 className="mt-5 text-[17px] font-bold leading-snug">{t.title}</h3>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{"“"}{t.quote}{"”"}</blockquote>
            </div>
            <figcaption className="mt-8">
              <span className="block text-[15px] font-semibold">{t.name}</span>
              <span className="block text-sm text-muted-foreground">{t.country}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl justify-end gap-2 px-4 sm:px-5">
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous reviews" className="flex size-10 items-center justify-center rounded-full bg-card hover:bg-accent">
          <ChevronLeft className="size-5" strokeWidth={STROKE} />
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Next reviews" className="flex size-10 items-center justify-center rounded-full bg-card hover:bg-accent">
          <ChevronRight className="size-5" strokeWidth={STROKE} />
        </button>
      </div>
    </section>
  );
}
