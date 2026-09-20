import CompanionDemo from "@/components/site/CompanionDemo";
import { Reveal } from "@/components/site/Reveal";
import { LANGUAGE_COUNT } from "@/siteFacts";

import { Check } from "lucide-react";

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

const supporting = [
  {
    id: "languages",
    eyebrow: "Multi-language",
    title: "Speaks their language.",
    emphasis: "Automatically.",
    body: "If a caller speaks Marathi, Punjabi, Tamil, or another Indian language, Assisty AI detects it mid-call and switches to reply in that language, without being asked.",
    proof: { value: LANGUAGE_COUNT, label: "languages, including regional" },
  },
  {
    id: "summaries",
    eyebrow: "Summary and recording",
    title: "A summary and the actual recording,",
    emphasis: "the moment the call ends.",
    body: "After every call you get an app push notification with a short, natural recap: who called, why, and whether it was urgent, plus the call recording so you can hear the actual tone in seconds.",
    proof: { value: "1 note", label: "per call, nothing to piece together" },
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

      <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 pb-6 sm:px-5 lg:grid-cols-5">
        {/* Featured */}
        <Reveal className="rounded-xl bg-card p-6 sm:p-10 lg:col-span-3 lg:row-span-2 lg:p-12">
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

        {/* Supporting */}
        {supporting.map((s, i) => (
          <Reveal key={s.id} delay={(i + 1) * 80} className="flex flex-col rounded-xl bg-card p-6 sm:p-8 lg:col-span-2">
            <span className={eyebrow}>{s.eyebrow}</span>
            <h3 className="mt-4 text-[22px] font-bold leading-[1.15] sm:text-[26px]">
              {s.title} <span className="text-primary">{s.emphasis}</span>
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
            <div className="mt-auto flex flex-wrap items-baseline gap-x-3 pt-6">
              <p className="whitespace-nowrap text-2xl font-bold tracking-tight">{s.proof.value}</p>
              <p className="text-sm text-muted-foreground">{s.proof.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
