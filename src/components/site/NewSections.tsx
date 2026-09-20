import { Eye, Pause, PhoneCall, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";

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
  ["Dentists", "Therapists", "Architects", "Accountants", "Photographers", "Coaches", "Contractors", "Event Planners"],
  ["Founders", "Sales Teams", "Teachers", "Shop Owners", "Restaurant Owners", "Home Services", "Delivery Partners", "Busy Parents", "Night-shift Workers", "Anyone on the go"],
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
            <div key={i} className={`mx-auto flex flex-wrap items-center justify-center gap-2.5 ${["max-w-2xl", "max-w-4xl", "max-w-6xl"][i]}`}>
              {row.map((a) => (
                <span key={a} className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground/85">
                  {a}
                </span>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

type Testimonial = {
  name: string;
  country: string;
  quote: string;
  /** Path to the person's photo, used with their permission. Falls back to initials. */
  avatar?: string;
};

// Real, approved reviews from early testers.
const testimonials: Testimonial[] = [
  { name: "Priya Sharma", country: "India", quote: "I stopped worrying about missing important calls. The summaries tell me exactly what happened without making me listen to the whole conversation." },
  { name: "Rohan Singh", country: "India", quote: "The first call genuinely surprised me. It felt like someone was actually having a conversation instead of reading a script." },
  { name: "Emily Carter", country: "United Kingdom", quote: "It handled an unexpected call while I was in a meeting and captured every important detail. That's exactly what I wanted." },
  { name: "Daniel Brooks", country: "United States", quote: "The conversations feel natural, especially when people interrupt or change topics. It doesn't lose the flow." },
  { name: "Ananya Verma", country: "India", quote: "I love that it knows the difference between an ordinary call and something that actually needs my attention." },
  { name: "Michael Chen", country: "Canada", quote: "The response time was much faster than I expected, and the assistant didn't sound stiff or overly formal." },
  { name: "Simran Kaur", country: "India", quote: "It feels less like a call screening app and more like someone reliable answering on my behalf." },
  { name: "Olivia Taylor", country: "Australia", quote: "The call summaries are clean and easy to skim. I know what matters in seconds." },
  { name: "Arjun Patel", country: "India", quote: "The emergency escalation feature gave me confidence because it doesn't overreact, but it also doesn't miss serious situations." },
  { name: "Sofia Martins", country: "Portugal", quote: "The assistant adapts surprisingly well to natural conversations instead of forcing people into predefined answers." },
];

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function TestimonialSlot() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [hold]);

  const t = testimonials[i] ?? testimonials[0]!;
  return (
    <div
      className="flex h-full flex-col justify-between"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <figure key={i} className="animate-rise" aria-live="polite">
        <blockquote className="text-[18px] leading-relaxed">{"\u201C"}{t.quote}{"\u201D"}</blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          {t.avatar ? (
            <img src={t.avatar} alt="" className="size-11 rounded-full object-cover" />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-tint-amber text-sm font-bold text-primary">
              {initials(t.name)}
            </span>
          )}
          <span>
            <span className="block text-[15px] font-semibold">{t.name}</span>
            <span className="block text-sm text-muted-foreground">{t.country}</span>
          </span>
        </figcaption>
      </figure>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {testimonials.map((x, n) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show review from ${x.name}`}
            aria-current={n === i}
            className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section id="trust" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-5 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal className="rounded-xl bg-card p-7 sm:p-9">
          <TestimonialSlot />
        </Reveal>
      </div>
    </section>
  );
}
