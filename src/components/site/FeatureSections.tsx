import type { LucideIcon } from "lucide-react";
import CompanionDemo from "@/components/site/CompanionDemo";
import { AnimateInView } from "@/components/site/AnimateInView";
import { LANGUAGE_COUNT } from "@/siteFacts";

import {
  Check,
  Languages,
  MessageSquareText,
  PhoneCall,
  Volume2,
} from "lucide-react";

type Section = {
  id: string;
  eyebrow: string;
  icon: LucideIcon;
  tint: string;
  title: string;
  emphasis: string;
  body: string;
  points: string[];
  proof: { value: string; label: string };
  visual: React.ReactNode;
};

/* ---------- small, self-contained visuals ---------- */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-card p-5 shadow-soft ${className}`}>{children}</div>
  );
}

function LanguageVisual() {
  const langs = ["Hindi", "English", "Marathi", "Tamil", "Punjabi", "Bengali", "Gujarati", "Telugu"];
  return (
    <div className="space-y-3">
      <Panel>
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-green">
            <Languages className="size-5 text-foreground/80" strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[15px] font-semibold">Switched to Marathi, mid-call</p>
            <p className="text-sm text-muted-foreground">Detected automatically, no menu needed</p>
          </div>
        </div>
        <div className="mt-4 space-y-2.5">
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-tint-neutral px-3.5 py-2 text-[13px]">
            "Can we continue in Marathi?"
          </div>
          <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-tint-green px-3.5 py-2 text-[13px]">
            "Of course, switching to Marathi now."
          </div>
        </div>
      </Panel>
      <Panel className="flex flex-wrap gap-2">
        {langs.map((l) => (
          <span
            key={l}
            className="rounded-full bg-tint-neutral px-3 py-1.5 text-xs font-medium text-foreground/80"
          >
            {l}
          </span>
        ))}
      </Panel>
    </div>
  );
}

function SummaryVisual() {
  return (
    <div className="space-y-3">
      <Panel className="seq-1">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-blue">
            <MessageSquareText className="size-5 text-foreground/80" strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[15px] font-semibold">Call summary</p>
            <p className="text-sm text-muted-foreground">Ready the moment the call ends</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          A delivery partner called about tomorrow's pickup. Asked to confirm the address,
          said they will try again after 5pm if unanswered.
        </p>
      </Panel>
      <div className="min-h-[56px]">
        <Panel className="seq-3 flex items-center gap-3 bg-tint-green">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-primary-foreground">
            <PhoneCall className="size-3.5" strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Call recording · 1:42</p>
            <div className="mt-1 flex h-4 items-end gap-[2px]">
              {[3, 6, 4, 8, 5, 7, 3, 6, 4, 9, 5, 3].map((h, i) => (
                <span key={i} className="w-[2px] rounded-full bg-success/70" style={{ height: `${h * 2}px` }} />
              ))}
            </div>
          </div>
        </Panel>
      </div>
      <div className="min-h-[56px]">
        <Panel className="seq-4 flex items-center gap-3">
          <span className="size-2 rounded-full bg-success" />
          <p className="text-sm text-muted-foreground">
            Sent to the app the moment the call ended
          </p>
        </Panel>
      </div>
    </div>
  );
}

function RecordingVisual() {
  return (
    <Panel className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-amber">
          <Volume2 className="size-5 text-foreground/80" strokeWidth={1.9} />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Call recording</p>
        </div>
      </div>
      <div className="flex h-14 items-end gap-[3px]">
        {[3, 6, 4, 9, 5, 7, 3, 8, 4, 10, 6, 3, 7, 5, 9, 4, 6, 3, 8, 5].map((h, i) => (
          <span key={i} className="w-[3px] rounded-full bg-primary/60" style={{ height: `${h * 5}px` }} />
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-tint-amber px-4 py-3 text-sm">
        <span className="font-medium">Call recording · 1:42</span>
      </div>
    </Panel>
  );
}

/* ---------- content ---------- */

const sections: Section[] = [
  {
    id: "screening",
    eyebrow: "Call screening",
    icon: PhoneCall,
    tint: "bg-tint-blue",
    title: "A real conversation,",
    emphasis: "not a phone tree.",
    body: "When you cannot pick up, Assisty AI does. It greets the caller naturally, asks who they are and why they are calling, and handles the conversation like a person would, not a robotic menu.",
    points: [
      "Natural, warm conversation, never a scripted menu",
      "Confirms the caller's name and reason, every time",
      "Asks the caller to repeat if the line is unclear, instead of guessing",
    ],
    proof: { value: "1 call", label: "answered like a real person, every time" },
    visual: <CompanionDemo />,
  },
  {
    id: "languages",
    eyebrow: "Multi-language",
    icon: Languages,
    tint: "bg-tint-green",
    title: "Speaks their language.",
    emphasis: "Automatically.",
    body: "If a caller speaks Marathi, Punjabi, Tamil, or another Indian language, Assisty AI detects it mid-call and switches to reply in that language, without being asked.",
    points: [
      "Detects the caller's language automatically, mid-call",
      "Replies naturally in Hindi, English, and regional languages",
      "No menu to select a language, it just adapts",
    ],
    proof: { value: LANGUAGE_COUNT, label: "languages, incl. regional" },
    visual: <LanguageVisual />,
  },
  {
    id: "summaries",
    eyebrow: "Call summaries",
    icon: MessageSquareText,
    tint: "bg-tint-neutral",
    title: "One summary,",
    emphasis: "the moment the call ends.",
    body: "After every call you get a short, natural recap in the app: who called, why, and whether it was urgent, plus the call recording so you can hear the actual tone in seconds.",
    points: [
      "Short, plain-language recap, not a full transcript to read",
      "Call recording attached, so you can hear it yourself",
      "Ready the second the call ends, nothing to check manually",
    ],
    proof: { value: "1 note", label: "per call, nothing to piece together" },
    visual: <SummaryVisual />,
  },
  {
    id: "recording",
    eyebrow: "Call recordings",
    icon: Volume2,
    tint: "bg-tint-amber",
    title: "You hear the actual recording,",
    emphasis: "not just a transcript.",
    body: "Call recording attached, so you can hear the actual tone in seconds.",
    points: [
      "Call recording attached, so you can hear it yourself",
      "Ready the second the call ends, nothing to check manually",
      "Recorded so you can review exactly what was said",
    ],
    proof: { value: "Audio", label: "attached to every summary" },
    visual: <RecordingVisual />,
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
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Four things Assisty AI handles on every call, built to feel like a real
          person picked up, not an app.
        </p>
      </div>


      {sections.map((s, index) => (
        <div key={s.id} id={s.id} className="sticky top-20 mx-auto max-w-6xl scroll-mt-24 px-4 py-4 sm:px-5 sm:py-6">
          <div className="grid items-center gap-8 rounded-4xl bg-tint-neutral p-5 shadow-[0_20px_60px_-15px_rgb(0_0_0/0.18)] sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
            <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-soft">
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${s.tint}`}>
                  <s.icon className="size-3.5 text-foreground/80" strokeWidth={2} />
                </span>
                {s.eyebrow}
              </span>
              <h3 className="mt-5 text-[26px] font-bold leading-[1.12] sm:text-[34px] lg:text-[40px]">
                {s.title} <span className="text-primary">{s.emphasis}</span>
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{s.body}</p>
              <ul className="mt-6 space-y-3">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px]">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-card shadow-soft">
                      <Check className="size-3 text-success" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border/60 pt-6">
                <p className="whitespace-nowrap text-3xl font-bold tracking-tight">{s.proof.value}</p>
                <p className="text-sm text-muted-foreground">{s.proof.label}</p>
              </div>
            </div>

            <AnimateInView className={index % 2 === 1 ? "lg:order-1" : ""}>
              {s.visual}
            </AnimateInView>

          </div>
        </div>
      ))}

    </section>
  );
}
