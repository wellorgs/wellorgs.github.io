import { AlertTriangle, Phone, Truck, User } from "lucide-react";

type Card = {
  side: "l" | "r";
  top: number;
  offset: number;
  w: number;
  rot: number;
  delay: number;
  rAt: number;
  tone: string;
  name: string;
  time: string;
  msg: string;
  reply?: string;
  emergency?: boolean;
  missed?: boolean;
  vip?: boolean;
  sos?: boolean;
  badge?: string;
};

const cards: Card[] = [
  { side: "l", top: 0, offset: 16, w: 270, rot: -3, delay: 0, rAt: 3200, tone: "bg-tint-blue", name: "Meera", time: "9:41 AM", msg: "Can you ask them to call me when they're free?", reply: "Sure, I'll pass that on." },
  { side: "r", top: 0, offset: 0, w: 285, rot: 2, delay: 350, rAt: 3650, tone: "bg-tint-blue", name: "Pooja", time: "9:40 AM", msg: "Is the appointment still on for 5 pm?", reply: "I'll let them know you asked and they'll confirm." },
  { side: "l", top: 36.5, offset: 24, w: 280, rot: -2, delay: 700, rAt: 4100, tone: "bg-tint-purple", name: "+91 98712 34567", time: "9:32 AM", msg: "Are you available for a quick call?", reply: "Sir is in a meeting right now. Would you like me to take a message?" },
  { side: "l", top: 57, offset: 8, w: 275, rot: 2, delay: 1400, rAt: 5000, tone: "bg-tint-amber", name: "Mom", time: "9:30 AM", msg: "Please call me back as soon as you can.", reply: "Priority contact. I'm trying them right now.", vip: true },
  { side: "r", top: 37, offset: 12, w: 285, rot: 2, delay: 1050, rAt: 4550, tone: "bg-tint-purple", name: "Anjali (Client)", time: "9:34 AM", msg: "Just checking on the proposal.", reply: "I've passed on your message." },
  { side: "l", top: 78.5, offset: 0, w: 285, rot: -2, delay: 2100, rAt: 5900, tone: "bg-tint-red", name: "+91 99887 77665", time: "9:31 AM", msg: "There's a fire in the building, please tell them now!", reply: "A priority message has been sent to them.", sos: true },
  { side: "r", top: 54, offset: 20, w: 285, rot: 2, delay: 1750, rAt: 5450, tone: "bg-tint-amber", name: "Delivery", time: "9:29 AM", msg: "Your delivery will be late today.", reply: "Noted. I'll inform sir.", badge: "Important" },
  { side: "r", top: 69, offset: 56, w: 275, rot: -2, delay: 2450, rAt: 6350, tone: "bg-tint-red", name: "Dad", time: "9:29 AM", msg: "Are you free? It's important.", reply: "Priority contact. I'll keep trying until they pick up.", vip: true },
];

type DoodleSpec = {
  x: number;
  y: number;
  text: string[];
  delay: number;
  rot: number;
  arrow: { d: string; x: number; y: number; w: number; h: number; vb: string };
};

const doodles: DoodleSpec[] = [
  { x: 418, y: 0, text: ["Multiple conversations.", "One assistant."], delay: 8000, rot: -5, arrow: { d: "M6 6 C 20 26, 44 40, 66 46", x: 452, y: 54, w: 76, h: 56, vb: "0 0 76 56" } },
  { x: 1098, y: 58, text: ["Handles", "it all."], delay: 8600, rot: 4, arrow: { d: "M40 4 C 44 24, 30 40, 8 50", x: 1086, y: 110, w: 56, h: 58, vb: "0 0 56 58" } },
  { x: 1030, y: 800, text: ["Calls, requests,", "emergencies."], delay: 9200, rot: -4, arrow: { d: "M62 50 C 40 50, 16 36, 6 6", x: 962, y: 766, w: 68, h: 58, vb: "0 0 68 58" } },
];

function Doodle({ d }: { d: DoodleSpec }) {
  return (
    <>
      <div
        className="absolute animate-[write_1.1s_steps(28,end)_both] whitespace-nowrap text-[26px] font-semibold leading-[1.05] text-foreground/60"
        style={{ left: d.x, top: d.y, fontFamily: "Caveat, cursive", transform: `rotate(${d.rot}deg)`, animationDelay: `${d.delay}ms` }}
      >
        {d.text.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
      <svg
        viewBox={d.arrow.vb}
        className="absolute fill-none stroke-foreground/50"
        style={{ left: d.arrow.x, top: d.arrow.y, width: d.arrow.w, height: d.arrow.h }}
        strokeWidth={2.4}
        strokeLinecap="round"
      >
        <path
          d={d.arrow.d}
          pathLength={1}
          strokeDasharray={1}
          className="animate-[draw_0.8s_ease-out_both]"
          style={{ animationDelay: `${d.delay + 1000}ms` }}
        />
      </svg>
    </>
  );
}

function ChatCard({ c, compact, noTime }: { c: Card; compact?: boolean; noTime?: boolean }) {
  const urgent = c.emergency || c.sos;
  const Icon = urgent ? AlertTriangle : c.badge ? Truck : c.missed ? Phone : User;
  return (
    <div
      className="animate-[card-in_0.7s_cubic-bezier(0.2,0.8,0.2,1)_both]"
      style={{ [c.side === "l" ? "marginRight" : "marginLeft"]: compact ? 0 : c.offset, width: compact ? 108 : c.w, animationDelay: `${c.delay}ms` }}
    >
      <div
        className={`animate-[float_6s_ease-in-out_infinite] ${compact ? "rounded-xl p-1.5" : "rounded-2xl p-2.5"} shadow-lift ${c.tone}`}
        style={{ ["--r" as string]: `${c.rot}deg`, animationDelay: `${c.delay}ms` }}
      >
        <div className="flex items-center gap-2">
          <span className={`grid ${compact ? "size-4" : "size-7"} shrink-0 place-items-center rounded-full ${urgent ? "bg-destructive text-white" : "bg-foreground/10 text-foreground/60"}`}>
            <Icon className={compact ? "size-2.5" : "size-3.5"} strokeWidth={2} />
          </span>
          <span className={`${compact ? "truncate text-[9.5px]" : "text-[13px]"} font-semibold ${urgent ? "text-destructive" : ""}`}>{c.name}</span>
          {(c.badge ?? (c.vip ? "Priority" : null)) && <span className={`rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary ${compact ? "hidden" : ""}`}>{c.badge ?? "Priority"}</span>}
          <span className={`ml-auto text-[10px] text-muted-foreground ${compact || noTime ? "hidden" : ""}`}>{c.time}</span>
        </div>
        <p className={`mt-1.5 leading-snug text-foreground/85 ${compact ? "text-[9px]" : "text-[13px]"}`}>{c.msg}</p>
        {c.reply && (
          <div
            className="animate-[typing_0.8s_ease-in-out_both] overflow-hidden"
            style={{ animationDelay: `${c.rAt}ms` }}
          >
            <div className="mt-1.5 flex w-fit gap-1 rounded-full bg-white/70 px-2.5 py-1.5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1.5 animate-pulse rounded-full bg-primary/60" style={{ animationDelay: `${d * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        {c.reply && (
          <div
            className="animate-[reply-in_0.4s_ease-out_both] overflow-hidden"
            style={{ animationDelay: `${c.rAt + 750}ms` }}
          >
            <div className={`mt-1 rounded-lg bg-white/65 ${compact ? "px-1.5 py-1" : "px-2.5 py-1.5"}`}>
              <p className={`flex items-center gap-1 ${compact ? "text-[8px]" : "text-[11px]"} font-semibold text-primary`}>
                <span className="size-1.5 rounded-full bg-success" />
                Assisty AI
              </p>
              <p className={`mt-0.5 leading-snug text-foreground/80 ${compact ? "text-[8.5px]" : "text-[12px]"}`}>{c.reply}</p>
            </div>
          </div>
        )}
        {c.missed && (
          <p className="mt-1.5 text-[11px] font-medium text-primary">Callback noted</p>
        )}
      </div>
    </div>
  );
}

/** Conversations floating around the hero phone. Plays once and stays. */
export function ConversationCloud({ leaving }: { leaving?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-[opacity,filter] duration-[900ms] ease-in ${leaving ? "opacity-0 blur-[7px]" : "opacity-100 blur-0"}`}
    >
      <div className="absolute left-[70px] top-[70px] h-[700px] w-[330px]">
        {cards.filter((c) => c.side === "l").map((c, i) => (
          <div key={c.name} className="absolute right-0 flex justify-end" style={{ top: i * 184 }}>
            <ChatCard c={c} />
          </div>
        ))}
      </div>
      <div className="absolute left-[800px] top-[70px] h-[700px] w-[330px]">
        {cards.filter((c) => c.side === "r").map((c, i) => (
          <div key={c.name} className="absolute left-0 flex" style={{ top: i * 184 }}>
            <ChatCard c={c} />
          </div>
        ))}
      </div>
      {doodles.map((d) => (
        <Doodle key={d.text[0]} d={d} />
      ))}
    </div>
  );
}

// [card name, x, y, rotation] on a 400 x 780 stage: bubbles above, beside and below the phone
const mobileSlots: [string, number, number, number][] = [
  ["Meera", 6, 0, -3],
  ["Pooja", 226, 24, 3],
  ["+91 98712 34567", 2, 170, 2],
  ["Delivery", 228, 196, -2],
  ["+91 99887 77665", 6, 716, -3],
  ["Dad", 226, 742, 3],
];

/** Six conversations around the phone for narrow screens: three each side, above and below. */
export function MobileCloud({ leaving }: { leaving?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-[opacity,filter] duration-[900ms] ease-in ${leaving ? "opacity-0 blur-[7px]" : "opacity-100 blur-0"}`}
    >
      {mobileSlots.map(([name, x, y, rot], i) => {
        const k = cards.find((card) => card.name === name);
        if (!k) return null;
        return (
          <div key={name} className="absolute" style={{ left: x, top: y }}>
            <ChatCard c={{ ...k, w: 168, offset: 0, delay: i * 350, rAt: 3000 + i * 450, rot }} noTime />
          </div>
        );
      })}
    </div>
  );
}
