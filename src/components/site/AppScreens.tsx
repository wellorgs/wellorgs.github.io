import iphoneFrame from "@/assets/iphone-frame.png";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  Apple,
  BatteryFull,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3x3,
  Home,
  LayoutGrid,
  Mic,
  MoreHorizontal,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  ShieldAlert,
  Signal,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Video,
  Volume2,
  Wifi,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/**
 * Faithful, static recreations of real MyAssistant app screens, rendered inside
 * true-to-platform iPhone and Android device frames so visitors can see the
 * app is native-feeling on both.
 */

type Platform = "ios" | "android";

function AndroidGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 9h12v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Zm-2.5 0A1.5 1.5 0 0 1 5 10.5v4a1.5 1.5 0 0 1-3 0v-4A1.5 1.5 0 0 1 3.5 9Zm17 0A1.5 1.5 0 0 1 22 10.5v4a1.5 1.5 0 0 1-3 0v-4A1.5 1.5 0 0 1 20.5 9ZM9 19.5h2V22a1 1 0 1 1-2 0v-2.5Zm4 0h2V22a1 1 0 1 1-2 0v-2.5ZM7.6 3.2 6.8 1.9a.4.4 0 1 1 .7-.4l.8 1.4A6.9 6.9 0 0 1 12 2.2c1 0 2 .2 2.9.6l.8-1.3a.4.4 0 1 1 .7.4l-.8 1.3A6 6 0 0 1 18 8H6a6 6 0 0 1 1.6-4.8ZM9.2 5.6a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Zm5.6 0a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Z" />
    </svg>
  );
}

function StatusBar({ platform, light }: { platform: Platform; light?: boolean | undefined }) {
  const tone = light ? "text-white" : "text-foreground";
  if (platform === "ios") {
    return (
      <div className={`absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between px-6 pt-1 text-[10px] font-semibold ${tone}`}>
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <Signal className="size-3" strokeWidth={2.5} />
          <Wifi className="size-3" strokeWidth={2.5} />
          <BatteryFull className="size-3.5" strokeWidth={2.2} />
        </span>
      </div>
    );
  }
  return (
    <div className={`absolute inset-x-0 top-0 z-20 flex h-8 items-center justify-between px-4 pt-1 text-[10px] font-medium ${tone}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Wifi className="size-3" strokeWidth={2.4} />
        <Signal className="size-3" strokeWidth={2.4} />
        <BatteryFull className="size-3.5" strokeWidth={2.2} />
      </span>
    </div>
  );
}

type Role = "parent" | "family";

/** Floating capsule nav — 5 tabs per role, exactly as in the app. */
function TabBar({
  platform,
  role = "parent",
  tab,
}: {
  platform: Platform;
  role?: Role | undefined;
  tab?: string | undefined;
}) {
  const items =
    role === "parent"
      ? [
          { icon: <Home className="size-[15px]" />, label: "Home", active: true },
          { icon: <PhoneCall className="size-[15px]" />, label: "Calls" },
          { icon: <Sparkles className="size-[15px]" />, label: "Assistant" },
          { icon: <Users className="size-[15px]" />, label: "Contacts" },
          { icon: <User className="size-[15px]" />, label: "Profile" },
        ]
      : [
          { icon: <LayoutGrid className="size-[15px]" />, label: "Dashboard", active: true },
          { icon: <Phone className="size-[15px]" />, label: "Numbers" },
          { icon: <Users className="size-[15px]" />, label: "Contacts" },
          { icon: <TrendingUp className="size-[15px]" />, label: "Insights" },
          { icon: <User className="size-[15px]" />, label: "Profile" },
        ];
  const tabs = items.map((t) => ({
    ...t,
    active: tab ? t.label === tab : "active" in t && t.active,
  }));
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 z-20 bg-background px-3 pt-3 ${platform === "ios" ? "pb-5" : "pb-3"}`}
    >
      <div className="flex items-center justify-between gap-0.5 rounded-[28px] border border-border/60 bg-background/95 px-2 py-2 shadow-lift backdrop-blur">
        {tabs.map((t) => (
          <span
            key={t.label}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-3xl py-1 ${
              t.active ? "bg-secondary text-primary" : "text-muted-foreground"
            }`}
          >
            {t.icon}
            <span className="text-[8.5px] font-medium leading-none">{t.label}</span>
          </span>
        ))}
      </div>
      {platform === "ios" ? (
        <span className="mx-auto mt-2 block h-[4px] w-[92px] rounded-full bg-foreground/70" />
      ) : (
        <div className="mt-2 flex items-center justify-center gap-10 text-foreground/60">
          <span className="block size-2 rotate-45 border-b-2 border-l-2 border-current" />
          <span className="block size-2 rounded-[2px] border-2 border-current" />
          <span className="block size-2 rounded-full border-2 border-current" />
        </div>
      )}
    </div>
  );
}

function PhoneFrame({
  children,
  label,
  caption,
  platform,
  chrome = true,
  role = "parent",
  tab,
  statusBarLight,
}: {
  children: ReactNode;
  label: string;
  caption: string;
  platform: Platform;
  chrome?: boolean | undefined;
  role?: Role | undefined;
  tab?: string | undefined;
  statusBarLight?: boolean | undefined;
}) {
  const ios = platform === "ios";
  const screenContent = (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative h-[560px] w-[260px]">
        <StatusBar platform={platform} light={statusBarLight} />
        <div
          className={`no-scrollbar h-full overflow-hidden px-4 text-[13px] ${ios ? "pt-11" : "pt-10"} ${chrome ? "pb-28" : "pb-4"}`}
        >
          {children}
        </div>
        {chrome ? <TabBar platform={platform} role={role} tab={tab} /> : null}
      </div>
    </div>
  );
  return (
    <figure className="w-[292px] shrink-0 lg:w-[300px]">
      {ios ? (
        <div className="relative aspect-[1350/2760]">
          <div className="absolute left-[5.33%] top-[2.46%] h-[95%] w-[89.3%] overflow-hidden bg-background">
            {screenContent}
          </div>
          <img src={iphoneFrame} alt="" draggable={false} className="pointer-events-none absolute inset-0 z-40 h-full w-full select-none" />
        </div>
      ) : (
      <div
        className={`relative bg-gradient-to-b from-foreground/70 via-foreground/95 to-foreground/70 shadow-lift ${
          ios
            ? "rounded-[2.8rem] p-[11px] lg:rounded-[3rem] lg:p-[12px]"
            : "rounded-[2.1rem] p-[8px] lg:rounded-[2.2rem]"
        }`}
      >
        <span aria-hidden className={`absolute -left-[3px] w-[3px] rounded-l-sm bg-foreground/60 ${ios ? "top-24 h-12" : "top-28 h-9"}`} />
        <span aria-hidden className={`absolute -right-[3px] w-[3px] rounded-r-sm bg-foreground/60 ${ios ? "top-28 h-16" : "top-32 h-14"}`} />
        <div
          className={`relative h-[628px] overflow-hidden bg-background lg:h-[646px] ${
            ios ? "rounded-[2.3rem] lg:rounded-[2.4rem]" : "rounded-[1.7rem] lg:rounded-[1.8rem]"
          }`}
        >
          {ios ? (
            <div className="absolute left-1/2 top-2 z-30 h-[24px] w-[96px] -translate-x-1/2 rounded-full bg-foreground/85 lg:h-[25px] lg:w-[100px]" />
          ) : (
            <div className="absolute left-1/2 top-2 z-30 size-[11px] -translate-x-1/2 rounded-full bg-foreground/85 lg:size-[12px]" />
          )}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative h-[560px] w-[260px] scale-[1.12] lg:scale-[1.15]">
              <StatusBar platform={platform} light={statusBarLight} />
              <div
                className={`no-scrollbar h-full overflow-hidden px-4 text-[13px] ${
                  ios ? "pt-11" : "pt-10"
                } ${chrome ? "pb-28" : "pb-4"}`}
              >
                {children}
              </div>
              {chrome ? <TabBar platform={platform} role={role} tab={tab} /> : null}
            </div>
          </div>
        </div>
      </div>
      )}
      <figcaption className="mt-4 px-1">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold">{label}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
            {ios ? <Apple className="size-3" /> : <AndroidGlyph className="size-3" />}
            {ios ? "iPhone" : "Android"}
          </span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {caption.replace(" — ", " - ")}
        </p>
      </figcaption>
    </figure>
  );
}

function Card({
  children,
  tone = "card",
  className = "",
}: {
  children: ReactNode;
  tone?: "card" | "blue" | "green" | "amber" | "purple" | "red";
  className?: string;
}) {
  const tones = {
    card: "bg-card",
    blue: "bg-tint-blue",
    green: "bg-tint-green",
    amber: "bg-tint-amber",
    purple: "bg-tint-purple",
    red: "bg-tint-red",
  } as const;
  return (
    <div className={`rounded-3xl ${tones[tone]} p-4 shadow-soft ${className}`}>{children}</div>
  );
}

function Bubble({ children }: { children: ReactNode }) {
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-card shadow-soft">
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function Pillow({ children, primary }: { children: ReactNode; primary?: boolean }) {
  return (
    <span
      className={`inline-flex h-8 items-center rounded-full px-3 text-[11px] font-semibold ${
        primary ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function ParentHome() {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between px-1">
        <div>
          <p className="text-[11px] text-muted-foreground">Good afternoon,</p>
          <p className="text-lg font-bold">3 calls handled today</p>
        </div>
        <span className="relative grid size-8 place-items-center rounded-2xl bg-card shadow-soft">
          <Bell className="size-4 text-foreground/70" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
        </span>
      </div>

      <Card tone="blue">
        <div className="flex gap-3">
          <Bubble>
            <PhoneIncoming className="size-5 text-primary" />
          </Bubble>
          <div className="min-w-0">
            <Eyebrow>Missed call, now answered</Eyebrow>
            <p className="mt-0.5 text-[15px] font-semibold">Delivery partner</p>
            <p className="text-[11px] text-muted-foreground">Asked about tomorrow's pickup</p>
            <div className="mt-3 flex gap-2">
              <Pillow primary>Call back</Pillow>
              <Pillow>View summary</Pillow>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <Card tone="green" className="p-3">
          <PhoneCall className="size-4 text-success" />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Calls answered
          </p>
          <p className="text-[13px] font-semibold">12 / 14</p>
        </Card>
        <Card tone="amber" className="p-3">
          <Clock className="size-4 text-warning" />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Avg. response
          </p>
          <p className="text-[13px] font-semibold">38 sec</p>
        </Card>
      </div>

      <p className="px-1 pt-1 text-[13px] font-semibold">Upcoming today</p>
      <Card className="p-2">
        <ul className="divide-y">
          {[
            { t: "1:00 PM", l: "Scheduled callback" },
            { t: "4:00 PM", l: "Client call · Main Street" },
            { t: "6:30 PM", l: "Weekly summary review" },
          ].map((e) => (
            <li key={e.t} className="flex items-center gap-3 px-2 py-2.5">
              <span className="w-14 text-[11px] font-semibold text-muted-foreground">{e.t}</span>
              <span className="text-[12px]">{e.l}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function FamilyDashboard() {
  const numbers = [
    {
      initials: "PL",
      name: "Personal line",
      status: "Active · handled 3 calls",
      tone: "green" as const,
      dot: "bg-success",
      calls: "3 today",
      contacts: "2 priority",
      escalations: "0 today",
    },
    {
      initials: "BL",
      name: "Business line",
      status: "1 emergency escalated",
      tone: "amber" as const,
      dot: "bg-warning",
      calls: "8 today",
      contacts: "3 priority",
      escalations: "1 today",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="px-1">
        <p className="text-lg font-bold">Dashboard</p>
        <p className="text-[11px] text-muted-foreground">Every number, at a glance</p>
      </div>

      {numbers.map((p) => (
        <Card key={p.name} tone={p.tone}>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-card text-[13px] font-semibold text-muted-foreground">
              {p.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">{p.name}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={`size-1.5 shrink-0 rounded-full ${p.dot}`} />
                <span className="truncate">{p.status}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{p.calls.split(" ")[0]}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Calls today</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[
              { icon: <PhoneCall className="size-3.5" />, label: p.calls },
              { icon: <Users className="size-3.5" />, label: p.contacts },
              { icon: <ShieldAlert className="size-3.5" />, label: p.escalations },
            ].map((m, i) => (
              <div
                key={i}
                className="flex min-w-0 flex-col items-center gap-1 rounded-2xl bg-card px-1 py-2 text-center"
              >
                <span className="text-muted-foreground">{m.icon}</span>
                <span className="w-full truncate text-[10px] font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <p className="px-1 pt-1 text-[13px] font-semibold">Alerts</p>
      <Card className="p-2">
        <ul className="divide-y">
          {[
            { dot: "bg-warning", title: "Business line escalated an urgent caller", time: "20 min ago" },
            { dot: "bg-primary", title: "Personal line handled 3 calls today", time: "1h ago" },
            { dot: "bg-warning", title: "A callback is still pending", time: "2h ago" },
          ].map((a) => (
            <li key={a.title} className="flex items-center gap-2.5 px-2 py-2.5">
              <span className={`size-1.5 shrink-0 rounded-full ${a.dot}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium">{a.title}</p>
                <p className="text-[10px] text-muted-foreground">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function EscalatedCallScreen() {
  return (
    <div className="space-y-3">
      <div className="px-1">
        <p className="text-lg font-bold">Escalated call</p>
        <p className="text-[11px] text-muted-foreground">Just now</p>
      </div>

      <Card tone="red">
        <div className="flex gap-3">
          <Bubble>
            <ShieldAlert className="size-5 text-destructive" />
          </Bubble>
          <div className="min-w-0">
            <Eyebrow>Confirmed emergency</Eyebrow>
            <p className="mt-0.5 text-[15px] font-semibold">Calling you now</p>
            <p className="text-[11px] text-muted-foreground">Caller on hold, recording saved</p>
          </div>
        </div>
      </Card>

      <Card className="p-2">
        <ul className="divide-y">
          {[
            { t: "0:00", l: "Calling you now" },
            { t: "0:15", l: "No answer, priority contact tried" },
            { t: "0:40", l: "Recording saved" },
          ].map((e) => (
            <li key={e.t} className="flex items-center gap-3 px-2 py-2.5">
              <span className="w-14 text-[11px] font-semibold text-muted-foreground">{e.t}</span>
              <span className="text-[12px]">{e.l}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-2">
        <div className="flex items-center justify-center px-2 py-1.5">
          <Pillow primary>Mark as handled</Pillow>
        </div>
      </Card>
    </div>
  );
}

function InsightsScreen() {
  const bars = [40, 62, 55, 78, 70, 88, 82];
  return (
    <div className="space-y-3">
      <div className="px-1">
        <p className="text-lg font-bold">Insights</p>
        <p className="text-[11px] text-muted-foreground">Last 7 days</p>
      </div>

      <Card>
        <Eyebrow>Wellness trend</Eyebrow>
        <div className="mt-4 flex h-24 items-end gap-2">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-primary/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <Card tone="green" className="p-3">
          <Eyebrow>Adherence</Eyebrow>
          <p className="mt-1 text-xl font-bold">92%</p>
          <p className="text-[10px] text-muted-foreground">+4% vs last week</p>
        </Card>
        <Card tone="blue" className="p-3">
          <Eyebrow>Avg. sleep</Eyebrow>
          <p className="mt-1 text-xl font-bold">7h 05m</p>
          <p className="text-[10px] text-muted-foreground">Steady</p>
        </Card>
      </div>

      <Card tone="amber">
        <Eyebrow>Response trend</Eyebrow>
        <p className="mt-1 text-[13px] font-semibold leading-snug">41 sec avg · minus 8% vs last week</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Response times are improving across both numbers.
        </p>
      </Card>

      <Card className="p-2">
        <ul className="divide-y">
          {[
            { t: "8:00 AM", l: "Call answered · client" },
            { t: "9:15 AM", l: "Callback scheduled" },
            { t: "11:02 AM", l: "Priority contact called back (12 min)" },
          ].map((e) => (
            <li key={e.t} className="flex items-center gap-3 px-2 py-2.5">
              <span className="w-14 text-[11px] font-semibold text-muted-foreground">{e.t}</span>
              <span className="truncate text-[12px]">{e.l}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function AiCompanionScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 px-1">
        <p className="text-lg font-bold">Ask MyAssistant</p>
        <p className="text-[11px] text-muted-foreground">
          Speaks Hindi, English, and regional Indian languages
        </p>
      </div>

      <div className="flex-1 space-y-2.5 overflow-hidden">
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-[12px] text-foreground shadow-soft">
            What calls did I miss today?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-[12px] text-primary-foreground">
            You had 3 calls. One from a client about tomorrow's delivery, marked urgent.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3 py-2 text-[12px] text-foreground shadow-soft">
            Call the client back
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-[12px] text-primary-foreground">
            Calling now…
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-[24px] border border-border/60 bg-card p-2 shadow-soft">
        <input
          type="text"
          readOnly
          value="Ask or speak…"
          className="min-w-0 flex-1 bg-transparent px-2 text-[13px] text-muted-foreground outline-none"
        />
        <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift">
          <Mic className="size-5" />
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Pillow>Today's calls</Pillow>
        <Pillow>Set a reminder</Pillow>
        <Pillow>Priority contacts</Pillow>
        <Pillow>Read me the summary</Pillow>
      </div>
    </div>
  );
}

function MedicineScreen() {
  return (
    <div className="space-y-3">
      <div className="px-1">
        <p className="text-lg font-bold">Call summary</p>
        <p className="text-[11px] text-muted-foreground">Today, 2:14 PM</p>
      </div>

      <Card tone="blue">
        <div className="flex gap-3">
          <Bubble>
            <PhoneCall className="size-5 text-primary" />
          </Bubble>
          <div className="min-w-0 flex-1">
            <Eyebrow>Delivery partner</Eyebrow>
            <p className="mt-0.5 text-[15px] font-semibold">Asked about tomorrow's pickup</p>
            <p className="text-[11px] text-muted-foreground">Said they will call again after 5pm</p>
            <div className="mt-3 flex gap-2">
              <Pillow primary>Mark handled</Pillow>
              <Pillow>Call back</Pillow>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-2">
        <div className="flex items-center gap-3 px-2 py-1">
          <span className="grid size-9 place-items-center rounded-xl bg-secondary">
            <Users className="size-4 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold">Shared with your team</p>
            <p className="text-[11px] text-muted-foreground">
              2 teammates will see this summary
            </p>
          </div>
        </div>
      </Card>

      <Card tone="green">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white/20 text-success-foreground">
            <Sparkles className="size-5" />
          </span>
          <div>
            <Eyebrow>Calls answered this week</Eyebrow>
            <p className="text-xl font-bold">38 of 40</p>
          </div>
        </div>
      </Card>

      <p className="px-1 pt-1 text-[13px] font-semibold">Related</p>
      <Card className="p-2">
        <ul className="divide-y">
          {[
            { t: "4:00 PM", l: "Scheduled callback" },
            { t: "Tomorrow", l: "Follow-up reminder" },
            { t: "Friday", l: "Weekly summary" },
          ].map((e) => (
            <li key={e.t} className="flex items-center gap-3 px-2 py-2.5">
              <span className="w-14 text-[11px] font-semibold text-muted-foreground">{e.t}</span>
              <span className="truncate text-[12px]">{e.l}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/** The real iOS in-call screen, not an app screen — this is what the caller's phone shows. */
function CallTimer({ live }: { live?: boolean | undefined }) {
  const [sec, setSec] = useState(3);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setSec((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [live]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return <span className="tabular-nums">{mm}:{ss}</span>;
}

export function NativeCallScreen({ minimal, timerKey }: { minimal?: boolean; timerKey?: number }) {
  const topRow: { icon: typeof Mic; label: string }[] = [
    { icon: Volume2, label: "Speaker" },
    { icon: Video, label: "FaceTime" },
    { icon: Mic, label: "Mute" },
  ];
  return (
    <div
      className={`-mx-4 -mb-4 -mt-11 flex h-[calc(100%+3.75rem)] flex-col items-center justify-between text-center ${minimal ? "px-8 pb-12 pt-[104px]" : "px-6 pb-8 pt-20"} text-white`}
      style={{
        backgroundImage:
          minimal
          ? "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 78%, #2a1408), color-mix(in oklch, var(--primary) 50%, #1c120c) 55%, color-mix(in oklch, var(--primary) 32%, #150d09))"
          : "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 65%, black), color-mix(in oklch, var(--primary) 22%, black) 45%, #0a0a0f)",
      }}
    >
      <div>
        <p className={`${minimal ? "text-[20px]" : "text-[13px]"} font-medium text-white/55`}><CallTimer key={timerKey} live={minimal} /></p>
        <p className={`mt-1 ${minimal ? "text-[36px]" : "text-[26px]"} font-semibold tracking-tight`}>MyAssistant</p>
        <p className={`mt-1 ${minimal ? "text-[17px]" : "text-[13px]"} text-white/60`}>+91 98765 43210</p>
        {!minimal && <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Speaking…
        </p>}
      </div>

      {minimal ? <div /> : <div className="w-full space-y-4">
        <p className="mx-auto max-w-[210px] text-[12px] italic leading-relaxed text-white/75">
          "Hi, thanks for calling. They're not free right now, I'm their assistant. Can I get your name and what this is about?"
        </p>
        <div className="mx-auto flex h-8 w-[150px] items-end justify-center gap-[3px]">
          {[4, 7, 3, 8, 5, 2, 6, 4, 7, 3, 5, 8, 4, 2].map((h, i) => (
            <span key={i} className="w-[3px] rounded-full bg-white/70" style={{ height: `${h * 3}px` }} />
          ))}
        </div>
      </div>}

      <div className="w-full space-y-5">
        <div className="grid grid-cols-3 gap-x-6 gap-y-5">
          {topRow.map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-1.5">
              <span className={`grid ${minimal ? "size-[76px] border border-white/25 bg-white/20" : "size-14 bg-white/15"} place-items-center rounded-full`}>
                <a.icon className={minimal ? "size-8" : "size-5"} strokeWidth={1.8} />
              </span>
              <span className={minimal ? "text-[15px] text-white/85" : "text-[10px] text-white/70"}>{a.label}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5">
            <span className={`grid ${minimal ? "size-[76px] border border-white/25 bg-white/20" : "size-14 bg-white/15"} place-items-center rounded-full`}>
              <MoreHorizontal className={minimal ? "size-8" : "size-5"} strokeWidth={1.8} />
            </span>
            <span className={minimal ? "text-[15px] text-white/85" : "text-[10px] text-white/70"}>More</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className={`grid ${minimal ? "size-[76px]" : "size-14"} place-items-center rounded-full bg-destructive`}>
              <PhoneOff className={minimal ? "size-8" : "size-5"} strokeWidth={2} />
            </span>
            <span className={minimal ? "text-[15px] text-white/85" : "text-[10px] text-white/70"}>End</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className={`grid ${minimal ? "size-[76px] border border-white/25 bg-white/20" : "size-14 bg-white/15"} place-items-center rounded-full`}>
              <Grid3x3 className={minimal ? "size-8" : "size-5"} strokeWidth={1.8} />
            </span>
            <span className={minimal ? "text-[15px] text-white/85" : "text-[10px] text-white/70"}>Keypad</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const screens: {
  label: string;
  caption: string;
  platform: Platform;
  chrome?: boolean | undefined;
  role?: Role | undefined;
  tab?: string | undefined;
  statusBarLight?: boolean | undefined;
  node: ReactNode;
}[] = [
  {
    label: "Answering",
    caption: "The real call screen. MyAssistant answers and greets the caller live.",
    platform: "ios",
    chrome: false,
    statusBarLight: true,
    node: <NativeCallScreen />,
  },
  {
    label: "Call Inbox",
    caption: "One card per call, with who called and why.",
    platform: "ios",
    node: <ParentHome />,
  },
  {
    label: "Team Dashboard",
    caption: "See every number at a glance, its status and alerts.",
    platform: "android",
    role: "family",
    tab: "Dashboard",
    node: <FamilyDashboard />,
  },
  {
    label: "Emergency Escalation",
    caption: "A confirmed emergency calls you directly, with recording saved.",
    platform: "ios",
    role: "parent",
    tab: "Calls",
    node: <EscalatedCallScreen />,
  },
  {
    label: "Assistant",
    caption: "Ask in your language. It answers out loud, and can call back for you.",
    platform: "android",
    role: "parent",
    tab: "Assistant",
    node: <AiCompanionScreen />,
  },
  {
    label: "Call Summary",
    caption: "Plain-language notes, marked handled, shared with your team.",
    platform: "ios",
    role: "parent",
    tab: "Calls",
    node: <MedicineScreen />,
  },

];

// Three visible dots map to the first, middle and last screens of the gallery.
const ANCHOR_SCREENS: number[] = [0, 3, 5];


function closestAnchor(screenIndex: number) {
  let closest = 0;
  let minDist = Math.abs(screenIndex - ANCHOR_SCREENS[0]!);
  for (let i = 1; i < ANCHOR_SCREENS.length; i++) {
    const dist = Math.abs(screenIndex - ANCHOR_SCREENS[i]!);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }
  return closest;
}





export function AppScreens() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // Respect the user's motion preference: never auto-advance when reduced motion
  // is requested. Manual navigation (dots, arrows, keys, swipe, drag) still works.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Full-screen preview of a tapped/clicked screen.
  const [selected, setSelected] = useState<number | null>(null);
  const openModal = useCallback((i: number) => {
    // Don't open the modal if the user was dragging/swipe-scrolling.
    if (dragRef.current?.moved) return;
    setSelected(i);
  }, []);
  const closeModal = useCallback(() => setSelected(null), []);

  // Autoplay state lives in refs so the interval never re-renders the carousel.
  const autoPlayRef = useRef(true);
  const pauseTimeoutRef = useRef<number | null>(null);


  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Track the centred card without re-rendering on every scroll frame.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const center = el.scrollLeft + el.clientWidth / 2;
        const kids = Array.from(el.children) as HTMLElement[];
        let best = 0;
        let bestDist = Infinity;
        kids.forEach((kid, i) => {
          const d = Math.abs(kid.offsetLeft + kid.offsetWidth / 2 - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex((prev) => (prev === best ? prev : best));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      const kid = el?.children[i] as HTMLElement | undefined;
      if (!el || !kid) return;
      el.scrollTo({
        left: kid.offsetLeft - (el.clientWidth - kid.offsetWidth) / 2,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion],
  );

  // Manual navigation restarts the timer instead of stopping it, so the dots
  // and arrows always stay connected to the rotating carousel.
  const [navTick, setNavTick] = useState(0);

  // Advance every 4s through the 3 anchor screens (first, middle, last).
  // Disabled entirely when the user prefers reduced motion.
  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      if (!autoPlayRef.current) return;
      setIndex((prev) => {
        const currentDot = closestAnchor(prev);
        const nextDot = (currentDot + 1) % ANCHOR_SCREENS.length;
        const next = ANCHOR_SCREENS[nextDot]!;
        goTo(next);
        return next;
      });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [goTo, navTick, reducedMotion]);


  const pauseAutoPlay = useCallback(() => {
    autoPlayRef.current = false;
    if (pauseTimeoutRef.current) window.clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = window.setTimeout(() => {
      autoPlayRef.current = true;
    }, 8000);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    autoPlayRef.current = true;
    if (pauseTimeoutRef.current) window.clearTimeout(pauseTimeoutRef.current);
  }, []);

  // Jump to a screen from a dot/arrow: select instantly, keep rotating.
  const selectScreen = useCallback(
    (i: number) => {
      resumeAutoPlay();
      setIndex(i);
      setNavTick((t) => t + 1);
      goTo(i);
    },
    [goTo, resumeAutoPlay],
  );

  // Pointer drag-to-scroll (mouse/pen). Touch keeps native momentum scrolling.
  const dragRef = useRef<{ id: number; startX: number; startLeft: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      const el = trackRef.current;
      if (!el) return;
      pauseAutoPlay();
      dragRef.current = { id: e.pointerId, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
      setDragging(true);
      el.style.scrollBehavior = "auto";
      el.style.scrollSnapType = "none";
    },
    [pauseAutoPlay],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag || !el || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    if (!drag.moved) return;
    el.scrollLeft = drag.startLeft - dx;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag || !el) return;
    dragRef.current = null;
    setDragging(false);
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.style.scrollBehavior = "";
    el.style.scrollSnapType = "";
    // Settle onto the nearest screen after a free drag.
    const kids = Array.from(el.children) as HTMLElement[];
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    kids.forEach((kid, i) => {
      const d = Math.abs(kid.offsetLeft + kid.offsetWidth / 2 - center);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setIndex(nearest);
    goTo(nearest);
  }, [goTo]);


  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectScreen(Math.min(index + 1, screens.length - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectScreen(Math.max(index - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      selectScreen(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectScreen(screens.length - 1);
    }
  };

  const handleDotKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentDot = closestAnchor(index);
    let nextDot: number | null = null;
    if (e.key === "ArrowRight") nextDot = currentDot === ANCHOR_SCREENS.length - 1 ? 0 : currentDot + 1;
    else if (e.key === "ArrowLeft") nextDot = currentDot === 0 ? ANCHOR_SCREENS.length - 1 : currentDot - 1;
    else if (e.key === "Home") nextDot = 0;
    else if (e.key === "End") nextDot = ANCHOR_SCREENS.length - 1;
    if (nextDot === null) return;
    e.preventDefault();
    const nextScreen = ANCHOR_SCREENS[nextDot]!;
    selectScreen(nextScreen);
    dotRefs.current[nextDot]?.focus();
  };


  return (
    <section id="screens" className="cv-auto scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:max-w-[1092px] lg:px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[32px] font-bold leading-tight sm:text-5xl lg:text-6xl">
            The actual app.
            <span className="text-muted-foreground"> On iPhone and Android.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Real screens from MyAssistant: what happens when a call comes in, and what you
            see afterward. Same experience on both platforms.
          </p>
        </div>
      </div>

      {/* Track and controls share the same container so they align on desktop. */}
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:max-w-[1092px] lg:px-4">
        <div
          ref={trackRef}
          role="group"
          aria-label="App screen gallery. Swipe, drag, or use arrow keys"
          tabIndex={0}
          onKeyDown={handleKey}
          onPointerEnter={pauseAutoPlay}
          onPointerLeave={resumeAutoPlay}
          onClick={pauseAutoPlay}
          onTouchStart={pauseAutoPlay}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ WebkitOverflowScrolling: "touch" }}
          className={`no-scrollbar mt-8 flex [touch-action:pan-x_pan-y_pinch-zoom] snap-x snap-mandatory select-none gap-4 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto px-0 pb-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:mt-10 sm:gap-5 lg:px-0 lg:pb-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
        {screens.map((s, i) => (
          <div
            key={s.label}
            id={`app-screen-panel-${i}`}
            role="tabpanel"
            aria-label={`${s.label}, ${s.platform === "ios" ? "iPhone" : "Android"}`}
            aria-hidden={i === index ? undefined : true}
            onClick={() => openModal(i)}
            className="flex w-[312px] shrink-0 snap-center cursor-pointer justify-center lg:w-[320px]"
          >
            <PhoneFrame
              label={s.label}
              caption={s.caption}
              platform={s.platform}
              chrome={s.chrome}
              role={s.role}
              tab={s.tab}
              statusBarLight={s.statusBarLight}
            >
              {s.node}
            </PhoneFrame>
          </div>
        ))}
      </div>

      {/* Controls: arrows + pagination dots */}
      <div className="mt-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous screen"
            onClick={() => {
              selectScreen(index === 0 ? screens.length - 1 : index - 1);
            }}
            className="flex size-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-soft outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:size-10"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>

          <div
            className="flex items-center gap-1"
            role="tablist"
            aria-label="App screens"
            onKeyDown={handleDotKey}
          >
            {ANCHOR_SCREENS.map((screenIdx, dotIdx) => {
              const s = screens[screenIdx]!;
              const active = dotIdx === closestAnchor(index);
              return (
                <button
                  key={s.label}
                  type="button"
                  role="tab"
                  ref={(el) => {
                    dotRefs.current[dotIdx] = el;
                  }}
                  aria-selected={active}
                  aria-controls={`app-screen-panel-${screenIdx}`}
                  tabIndex={active ? 0 : -1}
                  aria-label={`Show ${s.label} screen (${dotIdx + 1} of ${ANCHOR_SCREENS.length})`}
                  onClick={() => {
                    selectScreen(screenIdx);
                  }}
                  className="flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-11"
                >
                  <span
                    className={`rounded-full transition-all duration-300 ${
                      active
                        ? "size-2 bg-foreground sm:size-2.5"
                        : "size-1.5 bg-foreground/25 sm:size-2"
                    }`}
                  />
                </button>
              );
            })}
          </div>


          <button
            type="button"
            aria-label="Next screen"
            onClick={() => {
              selectScreen(index === screens.length - 1 ? 0 : index + 1);
            }}
            className="flex size-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-soft outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:size-10"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronLeft className="size-3.5" />
          Swipe or use arrow keys to see more screens
          <ChevronRight className="size-3.5" />
        </p>
      </div>
      </div>

      {/* Full-screen preview modal */}
      {(() => {
        const screen = selected !== null ? screens[selected] : null;
        return (
          <Dialog open={selected !== null} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent
              className="fixed inset-0 z-50 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 flex-col items-center justify-center gap-0 rounded-none border-0 bg-black/90 p-0 backdrop-blur-xl duration-200 motion-reduce:duration-0 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none sm:rounded-none"
              aria-describedby="screen-preview-desc"
            >
              <DialogTitle className="sr-only">
                {screen ? `${screen.label} full-screen preview` : "App screen preview"}
              </DialogTitle>
              <DialogDescription id="screen-preview-desc" className="sr-only">
                Tap the close button or press Escape to exit the full-screen preview.
              </DialogDescription>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close preview"
                className="absolute right-4 top-4 z-50 grid size-11 place-items-center rounded-full bg-white/10 text-white outline-none backdrop-blur transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
              >
                <X className="size-5" />
              </button>

              {screen && (
                <div className="flex flex-col items-center gap-4 px-4">
                  <div className="origin-center scale-[0.85] sm:scale-[1.05] md:scale-[1.25] lg:scale-[1.45]">
                    <PhoneFrame
                      label={screen.label}
                      caption={screen.caption}
                      platform={screen.platform}
                      chrome={screen.chrome}
                      role={screen.role}
                      tab={screen.tab}
                      statusBarLight={screen.statusBarLight}
                    >
                      {screen.node}
                    </PhoneFrame>
                  </div>
                  <div className="text-center text-white">
                    <p className="text-lg font-semibold">{screen.label}</p>
                    <p className="text-sm text-white/70">{screen.caption.replace(" — ", " - ")}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}
    </section>
  );
}
