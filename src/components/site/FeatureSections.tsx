import type { LucideIcon } from "lucide-react";
import CompanionDemo from "@/components/site/CompanionDemo";
import { AnimateInView } from "@/components/site/AnimateInView";

import {
  Check,
  Languages,
  MessageSquareText,
  PhoneCall,
  ShieldAlert,
  Star,
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

function SosVisual() {
  return (
    <Panel className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-red">
          <ShieldAlert className="size-5 text-foreground/80" strokeWidth={1.9} />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Confirmed emergency</p>
          <p className="text-sm text-muted-foreground">Caller on hold, you're being called now</p>
        </div>
      </div>
      <div className="space-y-2 text-left">
        {[
          ["Just now", "Calling you now"],
          ["No answer", "Priority contact tried next"],
          ["Still no answer", "Priority alert sent instantly"],
        ].map(([n, s]) => (
          <div
            key={n}
            className="flex items-center justify-between rounded-2xl bg-tint-red px-4 py-3 text-sm"
          >
            <span className="font-medium">{n}</span>
            <span className="text-muted-foreground">{s}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        One escalation call per issue. Pushing again sends an alert, not a second call.
      </p>
    </Panel>
  );
}

function VipVisual() {
  return (
    <Panel className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-amber">
          <Star className="size-5 text-foreground/80" strokeWidth={1.9} />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Priority contacts</p>
          <p className="text-sm text-muted-foreground">Get an automatic second try</p>
        </div>
      </div>
      <ol className="space-y-3">
        {[
          ["Just now", "Priority contact called, no answer", "bg-tint-amber"],
          ["+15 sec", "Automatic retry placed", "bg-tint-blue"],
          ["+40 sec", "Still unanswered, priority alert sent", "bg-tint-neutral"],
        ].map(([time, text, tint]) => (
          <li key={text as string} className="flex gap-3">
            <span className={`mt-1 size-2.5 shrink-0 rounded-full ${tint}`} />
            <div>
              <p className="text-[15px] leading-snug">{text}</p>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function MuffledVisual() {
  return (
    <Panel className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-amber">
          <Volume2 className="size-5 text-foreground/80" strokeWidth={1.9} />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Bad line, not a bad call</p>
          <p className="text-sm text-muted-foreground">Asks again instead of guessing</p>
        </div>
      </div>
      <div className="flex h-10 items-end gap-[3px]">
        {[2, 4, 2, 6, 3, 2, 5, 2, 3, 6, 2, 4, 2, 5, 3, 2].map((h, i) => (
          <span key={i} className="w-[3px] rounded-full bg-foreground/25" style={{ height: `${h * 5}px` }} />
        ))}
      </div>
      <div className="space-y-2.5">
        <div className="w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-tint-neutral px-3.5 py-2 text-[13px] text-muted-foreground">
          "I need to- -reach them ab-- the—"
        </div>
        <div className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-tint-amber px-3.5 py-2 text-[13px]">
          "Sorry, that broke up. Could you say that again, a bit slower?"
        </div>
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
    body: "When you cannot pick up, MyAssistant does. It greets the caller naturally, asks who they are and why they are calling, and handles the conversation like a person would, not a robotic menu.",
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
    body: "If a caller speaks Marathi, Punjabi, Tamil, or another Indian language, MyAssistant detects it mid-call and switches to reply in that language, without being asked.",
    points: [
      "Detects the caller's language automatically, mid-call",
      "Replies naturally in Hindi, English, and regional languages",
      "No menu to select a language, it just adapts",
    ],
    proof: { value: "10+", label: "Indian languages supported" },
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
    id: "sos",
    eyebrow: "Emergency escalation",
    icon: ShieldAlert,
    tint: "bg-tint-red",
    title: "When it's real,",
    emphasis: "you hear about it live.",
    body: "MyAssistant judges whether a call is a genuine emergency, not just someone saying it is urgent. If it is, the caller is put on hold and MyAssistant calls you directly, right then, to relay it live.",
    points: [
      "Only a confirmed emergency triggers a live call to you",
      "The caller is put on hold while you are reached",
      "One escalation call per issue, a repeat push sends an alert instead of ringing again",
    ],
    proof: { value: "Live call", label: "not a text, for a genuine emergency" },
    visual: <SosVisual />,
  },
  {
    id: "vip",
    eyebrow: "Priority contacts",
    icon: Star,
    tint: "bg-tint-amber",
    title: "Mark someone priority,",
    emphasis: "and they get tried twice.",
    body: "Every escalation gets one call, by design. Contacts you mark as priority are the exception: miss their call and MyAssistant automatically tries you again once before it sends an alert instead of leaving them on hold.",
    points: [
      "One extra, automatic attempt for the contacts you choose",
      "Immediate alert if you still do not answer the second call",
      "The caller is told you have been notified, so they are not left guessing",
    ],
    proof: { value: "2 tries", label: "for priority contacts, before an alert" },
    visual: <VipVisual />,
  },
  {
    id: "audio",
    eyebrow: "Audio handling",
    icon: Volume2,
    tint: "bg-tint-amber",
    title: "Bad signal, muffled call.",
    emphasis: "Still handled properly.",
    body: "On a noisy street or a weak signal, MyAssistant does not guess at what it half-heard. It asks the caller to repeat or move somewhere clearer, the same way a good receptionist would.",
    points: [
      "Recognizes when audio is too muffled or broken up to trust",
      "Asks the caller to repeat, instead of inventing details",
      "Tells you when a call was hard to hear, in the summary",
    ],
    proof: { value: "Always asks again", label: "instead of guessing on a bad line" },
    visual: <MuffledVisual />,
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
          Six things MyAssistant handles on every call, built to feel like a real
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
