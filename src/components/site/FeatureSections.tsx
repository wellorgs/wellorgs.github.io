import CompanionDemo from "@/components/site/CompanionDemo";
import { Reveal } from "@/components/site/Reveal";
import { LANGUAGE_COUNT } from "@/siteFacts";

import { useEffect, useState } from "react";
import { Check, Languages, Play } from "lucide-react";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.12em] text-primary";

const featured = {
  eyebrow: "Call screening",
  title: "A real conversation,",
  emphasis: "not a phone tree.",
  body: "When you cannot pick up, Assisty AI does. It greets the caller naturally, asks who they are and why they are calling, and handles the conversation like a person would, not a robotic menu.",
  points: [
    "Natural, warm conversation, never a scripted menu",
    "Confirms the caller's name and reason, every time",
    "Asks the caller to repeat if the line is unclear, instead of guessing",
  ],
};

// index 0 is the English opener; the rest are mid-call switches
const DEMO_LANGS = ["Marathi", "Tamil", "Hindi", "Punjabi", "Bengali", "Gujarati"];

function LanguageMockup() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % (DEMO_LANGS.length + 1)), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div key={i} className="seq-in flex items-center gap-4 rounded-2xl bg-background p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-tint-purple">
        <Languages className="size-5 text-foreground/80" strokeWidth={1.75} />
      </span>
      {i === 0 ? (
        <p className="text-[15px] font-medium">“Hi, I need to reschedule my appointment.”</p>
      ) : (
        <div>
          <p className="text-[15px] font-semibold">Switched to {DEMO_LANGS[i - 1]}, mid-call</p>
          <p className="text-sm text-muted-foreground">Detected automatically, no menu needed</p>
        </div>
      )}
    </div>
  );
}

const BARS = [4, 10, 6, 14, 8, 16, 10, 6, 13, 9, 15, 7, 11, 5, 12, 8, 14, 6, 10, 4];

function SummaryMockup() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-background p-5">
        <p className="font-semibold">Call summary</p>
        <p className="text-xs text-muted-foreground">Ready the moment the call ends</p>
        <p className="mt-3 text-[15px] leading-relaxed">
          A delivery partner called about tomorrow's pickup. Asked to confirm the address, said they will try again
          after 5pm if unanswered.
        </p>
      </div>
      <div className="rounded-2xl bg-tint-green p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <Play className="size-4 fill-current" />
          </span>
          <div className="flex h-6 flex-1 items-center gap-[3px]">
            {BARS.map((h, k) => (
              <span key={k} className="w-[3px] rounded-full bg-success" style={{ height: h * 1.5 }} />
            ))}
          </div>
          <span className="text-sm font-medium">Call recording · 1:42</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Sent to the app the moment the call ended</p>
      </div>
    </div>
  );
}

const supporting = [
  {
    id: "languages",
    eyebrow: "Multi-language",
    title: "Speaks their language.",
    emphasis: "Automatically.",
    points: [
      "Detects the caller's language automatically",
      "Replies fluently in Hindi, Punjabi, Tamil, and regional languages",
      "No menu to select a language, it just adapts",
    ],
    proof: { value: LANGUAGE_COUNT, label: "languages, incl. regional" },
    mockup: <LanguageMockup />,
  },
  {
    id: "summaries",
    eyebrow: "Summary and recording",
    title: "A summary and the actual recording,",
    emphasis: "the moment the call ends.",
    body: "After every call you get a short, natural recap in the app: who called, why, and whether it was urgent, plus the call recording so you can hear the actual tone in seconds.",
    points: [
      "Short, plain-language recap, not a full transcript to read",
      "Call recording attached, so you can hear it yourself",
      "Ready the second the call ends, nothing to check manually",
    ],
    proof: { value: "1 note", label: "per call, nothing to piece together" },
    mockup: <SummaryMockup />,
  },
];

export function FeatureSections() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 pt-14 text-center sm:px-5 sm:pt-16">
        <h2 className="mx-auto max-w-3xl text-[28px] font-bold leading-tight sm:text-4xl">
          Everything a call needs.
          <span className="text-muted-foreground"> Nothing it doesn't.</span>
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 pb-6 sm:px-5">
        {/* Featured */}
        <Reveal className="rounded-xl bg-card p-6 sm:p-10 lg:p-12">
          <span className={eyebrow}>{featured.eyebrow}</span>
          <h3 className="mt-5 text-[30px] font-bold leading-[1.08] sm:text-[40px] lg:text-[48px]">
            {featured.title} <span className="text-primary">{featured.emphasis}</span>
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{featured.body}</p>
          <ul className="mt-6 space-y-3">
            {featured.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px]">
                <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={1.75} />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-background p-4 sm:p-5">
            <CompanionDemo />
          </div>
        </Reveal>

      </div>

      {supporting.map((s, i) => (
        <Reveal key={s.id} className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-5 lg:grid-cols-2 lg:gap-16">
          <div className={i % 2 ? "lg:order-2" : ""}>
            <span className={eyebrow}>{s.eyebrow}</span>
            <h3 className="mt-4 text-[26px] font-bold leading-[1.15] sm:text-[34px]">
              {s.title} <span className="text-primary">{s.emphasis}</span>
            </h3>
            {s.body && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>}
            <ul className="mt-5 space-y-3">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px]">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={1.75} />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-3">
              <p className="whitespace-nowrap text-2xl font-bold tracking-tight">{s.proof.value}</p>
              <p className="text-sm text-muted-foreground">{s.proof.label}</p>
            </div>
          </div>
          <div className="rounded-xl bg-card p-5 sm:p-8">{s.mockup}</div>
        </Reveal>
      ))}
    </section>
  );
}
