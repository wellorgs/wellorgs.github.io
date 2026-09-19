import {
  Bell,
  Globe2,
  Lock,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/site/Reveal";

const callouts = [
  {
    icon: Lock,
    tint: "bg-tint-blue",
    title: "Encrypted, coming and going",
    body: "Call recordings, summaries and contact details are sent over encrypted connections and stored encrypted at rest.",
  },
  {
    icon: Users,
    tint: "bg-tint-green",
    title: "Only your team sees it",
    body: "Call summaries and recordings are visible to the people you invite. Nothing is sold, rented or shared with advertisers.",
  },
  {
    icon: ShieldAlert,
    tint: "bg-tint-amber",
    title: "You're only interrupted when it's real",
    body: "A live call reaches you only for a confirmed emergency. Every other call waits for you in a calm summary.",
  },
  {
    icon: UserCheck,
    tint: "bg-tint-purple",
    title: "You stay in control",
    body: "Add or remove numbers, priority contacts and team members whenever you want, and turn features on or off per number.",
  },
  {
    icon: Globe2,
    tint: "bg-tint-neutral",
    title: "Built for how you actually talk",
    body: "Calls are handled in Hindi, English, and regional Indian languages, detected automatically, no setup required.",
  },
  {
    icon: Trash2,
    tint: "bg-tint-red",
    title: "Leave and take your data",
    body: "Export the full history whenever you want. Ask us to delete the account and everything in it goes with it.",
  },
];

const emergencySteps = [
  {
    step: "1",
    title: "The call is heard in full",
    body: "MyAssistant judges whether it's a genuine emergency, not just a caller who says it's urgent.",
  },
  {
    step: "2",
    title: "The caller is put on hold",
    body: "Once confirmed, the caller stays on hold, not disconnected, while you're being reached.",
  },
  {
    step: "3",
    title: "You get a live call",
    body: "MyAssistant calls you directly, immediately, to relay what's happening. Not a text, not a push notification.",
  },
  {
    step: "4",
    title: "Priority contacts get a retry",
    body: "If the contact you're reaching doesn't answer and is marked priority, MyAssistant automatically tries again once.",
  },
  {
    step: "5",
    title: "An alert goes out, and it's all on record",
    body: "Still no answer, and a priority alert is sent right away. Either way, the call is recorded so you can review exactly what was said.",
  },
];


const practices = [
  "Encryption in transit and at rest for call recordings, summaries and contact data",
  "Sign in with email or Google, with your session on your own device",
  "Access limited to the team members you invite, per phone number",
  "Escalation call recordings kept for the incident record, removable on request",
  "No selling, renting or ad targeting with your call data, ever",
  "Data export and account deletion on request from the account owner",
];

export function TrustSection() {
  return (
    <section id="trust" className="cv-auto mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 pt-4 sm:px-5">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft">
          <ShieldCheck className="size-4 shrink-0 text-primary" strokeWidth={2} />
          Trust and safety
        </span>
        <h2 className="mt-5 text-[28px] font-bold leading-tight sm:text-[40px]">
          Your calls, not our data set.{" "}
          <span className="text-primary">Here is exactly how it works.</span>
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          You are handing us who calls you, what they say, and when. That deserves
          plain answers, not a policy nobody reads.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {callouts.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 70}
            className="rounded-4xl bg-card p-6 shadow-soft sm:p-7"
          >
            <span className={`flex size-11 items-center justify-center rounded-2xl ${c.tint}`}>
              <c.icon className="size-5 text-foreground/80" strokeWidth={1.9} />
            </span>
            <h3 className="mt-5 text-[17px] font-bold">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{c.body}</p>
          </Reveal>
        ))}
      </div>

      {/* Emergency response flow */}
      <Reveal className="mt-6 rounded-4xl bg-tint-neutral p-6 shadow-soft sm:p-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-soft">
            <PhoneCall className="size-4 shrink-0 text-foreground/80" strokeWidth={2} />
            What happens in an emergency
          </span>
          <h3 className="mt-5 text-[24px] font-bold leading-tight sm:text-[30px]">
            Five steps, from ring to resolution.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            The same chain runs every time, automatically, so nothing depends on
            someone remembering to check a message.
          </p>
        </div>

        <div className="mt-8">
          <ol className="relative">
            {emergencySteps.map((s, i) => (
              <li key={s.step} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft">
                    {s.step}
                  </span>
                  {i < emergencySteps.length - 1 && (
                    <div className="mt-2 w-px flex-1 border-l-2 border-dashed border-border/80" />
                  )}
                </div>
                <div className="rounded-3xl bg-card p-5 shadow-soft">
                  <p className="text-[16px] font-semibold">{s.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
          <Bell className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          MyAssistant supports you in an emergency. It does not replace your local
          emergency number, and anyone in immediate danger should still call it directly.
        </p>
      </Reveal>


      {/* Security and data handling summary */}
      <Reveal className="mt-6 grid gap-8 rounded-4xl bg-card p-6 shadow-soft sm:p-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-tint-blue">
            <ShieldCheck className="size-5 text-foreground/80" strokeWidth={1.9} />
          </span>
          <h3 className="mt-5 text-[24px] font-bold leading-tight sm:text-[30px]">
            Security and data handling, in plain words
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            This is what we do today, written by the MyAssistant team. We are not claiming
            any certification or audit we have not completed, and we will update this page
            as that changes.
          </p>
        </div>
        <ul className="space-y-3">
          {practices.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-2xl bg-muted/50 px-4 py-3 text-[15px]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.4} />
              <span className="text-foreground/80">{p}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
