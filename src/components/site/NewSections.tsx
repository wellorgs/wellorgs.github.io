import { Eye, Pause, PhoneCall, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/site/Reveal";

export function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-5 sm:py-20">
      <Reveal>
        <h2 className="text-[30px] font-bold leading-[1.08] sm:text-5xl">
          Your phone doesn't know you're busy.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
          You're with a patient. You're in a meeting. You're talking to a client. You're driving.
          You're asleep. Your phone keeps ringing. You can't answer.{" "}
          <span className="font-semibold text-foreground">Assisty answers instead.</span>
        </p>
      </Reveal>
    </section>
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
      <div className="mx-auto max-w-6xl overflow-hidden rounded-4xl bg-foreground px-6 py-14 text-background shadow-lift sm:px-12 sm:py-20 lg:px-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[34px] font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              When it's real, <span className="text-primary">Assisty calls you.</span>
            </h2>
            <ul className="mt-10 space-y-7">
              {points.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background/10">
                    <p.icon className="size-5 text-primary" strokeWidth={2} />
                  </span>
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
                className="ring-shake relative flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift sm:size-28"
                style={{ animation: "ring-shake 2.6s ease-in-out infinite", animationPlayState: run }}
              >
                <PhoneCall className="size-10" strokeWidth={2} />
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              aria-label={paused ? "Play animation" : "Pause animation"}
              className="mt-6 flex size-10 items-center justify-center rounded-full border border-background/20 text-background/80 transition-colors hover:bg-background/10"
            >
              {paused ? <Play className="size-4" fill="currentColor" /> : <Pause className="size-4" fill="currentColor" />}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const lines = [
  { lang: "Hindi", text: "सर अभी मीटिंग में हैं। क्या मैं संदेश ले सकती हूँ?" },
  { lang: "Marathi", text: "साहेब सध्या मीटिंगमध्ये आहेत. मी निरोप घेऊ का?" },
  { lang: "Tamil", text: "சார் இப்போது கூட்டத்தில் இருக்கிறார். நான் செய்தி எடுத்துக்கொள்ளலாமா?" },
  { lang: "Punjabi", text: "ਸਰ ਇਸ ਵੇਲੇ ਮੀਟਿੰਗ ਵਿੱਚ ਹਨ। ਕੀ ਮੈਂ ਸੁਨੇਹਾ ਲੈ ਸਕਦੀ ਹਾਂ?" },
  { lang: "English", text: "Sir is in a meeting right now. Would you like me to take a message?" },
];

export function LanguagesSection() {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % lines.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="languages" className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-[28px] font-bold leading-tight sm:text-4xl">
          Speaks their language. <span className="text-primary">Automatically.</span>
        </h2>
        <div className="mt-8 rounded-4xl bg-card p-6 shadow-soft sm:p-10">
          {still ? (
            <ul className="space-y-4 text-left">
              {lines.map((l) => (
                <li key={l.lang}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{l.lang}</span>
                  <p className="mt-1 text-lg">{l.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-[120px] flex-col items-center justify-center" aria-live="polite">
              <span className="rounded-full bg-tint-green px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                {lines[i]?.lang}
              </span>
              <p key={i} className="animate-rise mt-4 text-xl font-medium leading-snug sm:text-2xl">
                {lines[i]?.text}
              </p>
            </div>
          )}
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

// Only publish quotes from real testers who approved them.
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

const tints = ["bg-tint-amber", "bg-tint-blue", "bg-tint-green", "bg-tint-purple", "bg-tint-red"];
const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
      <div className="gap-4 sm:columns-2 lg:columns-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 80} className="mb-4 break-inside-avoid rounded-4xl bg-card p-6 shadow-soft sm:p-7">
            <p className="text-[16px] leading-relaxed">{"“"}{t.quote}{"”"}</p>
            <div className="mt-6 flex items-center gap-3">
              {t.avatar ? (
                <img src={t.avatar} alt="" className="size-11 rounded-full object-cover" />
              ) : (
                <span className={`flex size-11 items-center justify-center rounded-full text-sm font-bold text-foreground/80 ${tints[i % tints.length]}`}>
                  {initials(t.name)}
                </span>
              )}
              <div>
                <p className="text-[15px] font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.country}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
