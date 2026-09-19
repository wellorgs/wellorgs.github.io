import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/site/Reveal";

type Call = {
  id: string;
  category: string;
  title: string;
  languages: string[];
  seconds: number;
  alert?: boolean;
  caption?: string;
  /** URL of the recorded call. Without it, playback is simulated so the design can be reviewed. */
  src?: string;
};

// AUDIO PLACEHOLDER - drop each real recording's URL into `src`; durations then follow the file.
const calls: Call[] = [
  { id: "patient", category: "Healthcare", title: "Patient Rescheduling", languages: ["Hindi"], seconds: 74 },
  { id: "court", category: "Legal", title: "Court Date Inquiry", languages: ["English"], seconds: 58 },
  { id: "property", category: "Real Estate", title: "Property Showing Request", languages: ["Hinglish"], seconds: 91 },
  { id: "delivery", category: "Delivery", title: "Directions To Address", languages: ["Marathi"], seconds: 42 },
  {
    id: "escalation",
    category: "Escalation",
    title: "It Can't Wait",
    languages: ["English"],
    seconds: 66,
    alert: true,
    caption: "Assisty checks if it's real, then calls you directly.",
  },
];

const SPEEDS = [1, 1.25, 1.5, 0.75];

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function CallCard({
  call,
  index,
  playing,
  progress,
  speed,
  onToggle,
  onSeek,
  onSpeed,
}: {
  call: Call;
  index: number;
  playing: boolean;
  progress: number;
  speed: number;
  onToggle: () => void;
  onSeek: (ratio: number) => void;
  onSpeed: () => void;
}) {
  const a = call.alert;
  const accent = a ? "text-destructive" : "text-primary";
  return (
    <Reveal
      delay={index * 80}
      className={`flex w-[85vw] max-w-[360px] shrink-0 snap-start flex-col rounded-3xl bg-card p-6 shadow-soft sm:w-[340px] ${
        a ? "border-2 border-destructive" : "border border-border/60"
      }`}
    >
      <p className={`text-sm font-medium ${accent}`}>{call.category}</p>
      <h3 className="mt-3 text-[22px] font-bold leading-tight">{call.title}</h3>
      {call.caption && (
        <p className="mt-2 text-sm leading-snug text-muted-foreground" title={call.caption}>
          {call.caption}
        </p>
      )}

      <div className="mt-auto pt-10">
        <div className="flex flex-wrap gap-2">
          {call.languages.map((l) => (
            <span
              key={l}
              className={`rounded-full border px-3 py-1 text-sm ${
                a ? "border-destructive/40 text-destructive" : "border-primary/40 text-primary"
              }`}
            >
              {l}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={`${playing ? "Pause" : "Play"}: ${call.title}`}
            aria-pressed={playing}
            className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-soft transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              a ? "bg-destructive" : "bg-primary"
            }`}
          >
            {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}
          </button>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(progress * 1000)}
            onChange={(e) => onSeek(Number(e.target.value) / 1000)}
            aria-label={`Seek: ${call.title}`}
            className={`h-1 min-w-0 flex-1 cursor-pointer ${a ? "accent-destructive" : "accent-primary"}`}
          />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {fmt(progress * call.seconds)} / {fmt(call.seconds)}
          </span>
          <button
            type="button"
            onClick={onSpeed}
            aria-label={`Playback speed ${speed}x`}
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${a ? "bg-tint-red text-destructive" : "bg-tint-amber text-primary"}`}
          >
            {speed}x
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export function RealCalls() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [speeds, setSpeeds] = useState<Record<string, number>>({});
  const audios = useRef<Record<string, HTMLAudioElement>>({});
  const scroller = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ ratio: 0.3, start: true, end: false });

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setScroll({
      ratio: (el.scrollLeft + el.clientWidth) / el.scrollWidth,
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  }, [onScroll]);

  const page = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });

  // Simulated playback for calls that have no recording attached yet.
  useEffect(() => {
    if (!playingId) return;
    const call = calls.find((c) => c.id === playingId);
    if (!call || call.src) return;
    const t = setInterval(() => {
      setProgress((p) => {
        const next = (p[playingId] ?? 0) + (0.1 * (speeds[playingId] ?? 1)) / call.seconds;
        if (next >= 1) {
          setPlayingId(null);
          return { ...p, [playingId]: 0 };
        }
        return { ...p, [playingId]: next };
      });
    }, 100);
    return () => clearInterval(t);
  }, [playingId, speeds]);

  useEffect(() => () => Object.values(audios.current).forEach((a) => a.pause()), []);

  const audioFor = (call: Call) => {
    if (!call.src) return undefined;
    let a = audios.current[call.id];
    if (!a) {
      a = new Audio(call.src);
      a.ontimeupdate = () => setProgress((p) => ({ ...p, [call.id]: a!.currentTime / (a!.duration || call.seconds) }));
      a.onended = () => setPlayingId(null);
      audios.current[call.id] = a;
    }
    return a;
  };

  const toggle = (call: Call) => {
    if (playingId) audios.current[playingId]?.pause();
    if (playingId === call.id) {
      setPlayingId(null);
      return;
    }
    const a = audioFor(call);
    if (a) {
      a.playbackRate = speeds[call.id] ?? 1;
      void a.play();
    }
    setPlayingId(call.id);
  };

  const seek = (call: Call, ratio: number) => {
    setProgress((p) => ({ ...p, [call.id]: ratio }));
    const a = audioFor(call);
    if (a && a.duration) a.currentTime = ratio * a.duration;
  };

  const cycleSpeed = (call: Call) => {
    const cur = speeds[call.id] ?? 1;
    const next = SPEEDS[(SPEEDS.indexOf(cur) + 1) % SPEEDS.length] ?? 1;
    setSpeeds((s) => ({ ...s, [call.id]: next }));
    const a = audios.current[call.id];
    if (a) a.playbackRate = next;
  };

  return (
    <section id="screens" className="cv-auto mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-5 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[30px] font-bold leading-[1.08] sm:text-5xl">
          What does Assisty actually say to your callers?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-xl">
          Not a demo. Real calls, real outcomes.
        </p>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Call samples"
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 [scrollbar-width:none] sm:mt-14 [&::-webkit-scrollbar]:hidden"
      >
        {calls.map((c, i) => (
          <CallCard
            key={c.id}
            call={c}
            index={i}
            playing={playingId === c.id}
            progress={progress[c.id] ?? 0}
            speed={speeds[c.id] ?? 1}
            onToggle={() => toggle(c)}
            onSeek={(r) => seek(c, r)}
            onSpeed={() => cycleSpeed(c)}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => page(d)}
            disabled={d === -1 ? scroll.start : scroll.end}
            aria-label={d === -1 ? "Previous calls" : "Next calls"}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-soft transition-opacity disabled:opacity-40"
          >
            {d === -1 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
        ))}
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-foreground/10" aria-hidden>
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${Math.min(100, scroll.ratio * 100)}%` }}
        />
      </div>
    </section>
  );
}
