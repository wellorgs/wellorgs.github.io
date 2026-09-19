import { memo, useCallback, useEffect, useRef, useState } from "react";
import { BellRing, Mic, Phone, RotateCcw, Sparkles } from "lucide-react";

type Turn = {
  id: number;
  role: "user" | "ai";
  text: string;
  actions?: { icon: typeof Phone; label: string }[] | undefined;
};

type Script = {
  key: "1" | "2" | "3";
  prompt: string;
  reply: string;
  actions?: { icon: typeof Phone; label: string }[] | undefined;
};

const SCRIPTS: Script[] = [
  {
    key: "1",
    prompt: "Hi, is this the right number for the Main Street listing?",
    reply:
      "Yes, this is the right number. They are not available right now, I am their assistant. Can I get your name and what this is about?",
    actions: [
      { icon: BellRing, label: "Log the call" },
      { icon: Phone, label: "Notify owner" },
    ],
  },
  {
    key: "2",
    prompt: "There's a gas leak, I need to reach them right now.",
    reply:
      "I understand, this sounds urgent. Please hold for a moment while I call them directly to relay this.",
    actions: [
      { icon: Phone, label: "Calling now" },
      { icon: Sparkles, label: "Emergency confirmed" },
    ],
  },
  {
    key: "3",
    prompt: "Can we continue in Marathi?",
    reply:
      "Of course, switching to Marathi now. Go ahead, tell me what you need.",
    actions: [{ icon: BellRing, label: "Language switched" }],
  },
];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-card p-5 shadow-soft ${className}`}>{children}</div>;
}

function CompanionDemoImpl() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const usedRef = useRef<string[]>([]);
  const busy = listening || typing;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idRef = useRef(0);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const run = useCallback(
    (script: Script) => {
      if (busy) return;
      clearTimers();
      setListening(true);
      if (!usedRef.current.includes(script.key)) usedRef.current.push(script.key);

      timers.current.push(
        setTimeout(() => {
          setListening(false);
          setTurns((t) => [
            ...t,
            { id: ++idRef.current, role: "user", text: script.prompt },
          ]);
          setTyping(true);
        }, 1500),
        setTimeout(() => {
          setTyping(false);
          setTurns((t) => [
            ...t,
            { id: ++idRef.current, role: "ai", text: script.reply, actions: script.actions },
          ]);
        }, 3100),
      );
    },
    [busy],
  );

  const next = useCallback(() => {
    const pick = SCRIPTS.find((s) => !usedRef.current.includes(s.key)) ?? SCRIPTS[0]!;
    run(pick);
  }, [run]);

  const reset = useCallback(() => {
    clearTimers();
    setTurns([]);
    usedRef.current = [];
    setListening(false);
    setTyping(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /input|textarea|select/i.test(el.tagName))) return;
      const k = e.key.toLowerCase();
      const script = SCRIPTS.find((s) => s.key === e.key);
      if (script) {
        e.preventDefault();
        run(script);
      } else if (k === "m") {
        e.preventDefault();
        next();
      } else if (k === "r") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, next, reset]);

  return (
    <div className="space-y-3">
      {/* Mic bar */}
      <Panel className="flex items-center gap-4 overflow-hidden">
        <button
          type="button"
          onClick={next}
          disabled={busy}
          aria-label={listening ? "Listening" : "Tap to talk to MyAssistant"}
          className="relative flex size-14 shrink-0 items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-95 disabled:cursor-not-allowed"
        >
          {listening && (
            <>
              <span className="animate-mic-ring absolute inset-0 rounded-full bg-tint-purple" />
              <span
                className="animate-mic-ring absolute inset-0 rounded-full bg-tint-purple"
                style={{ animationDelay: "1.2s" }}
              />
            </>
          )}
          <span className="relative flex size-12 items-center justify-center rounded-full bg-tint-purple">
            <Mic className="size-5 text-foreground/80" strokeWidth={2} />
          </span>
        </button>

        <div className="flex h-8 flex-1 items-center gap-1">
          {[0.9, 0.5, 1, 0.65, 0.35, 0.8, 0.5, 1, 0.6, 0.4, 0.85, 0.55].map((h, i) => (
            <span
              key={i}
              className={`eq-bar w-[3px] rounded-full bg-foreground/25 ${listening ? "animate-eq" : ""}`}
              style={
                {
                  "--eq-peak": h,
                  animationDelay: `${i * 0.09}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {listening ? "Listening…" : typing ? "Thinking…" : "Tap to talk"}
        </span>
      </Panel>

      {/* Transcript */}
      <div className="space-y-3">
        {turns.length === 0 && !busy && (
          <Panel className="text-center">
            <p className="text-sm text-muted-foreground">
              Tap the mic or pick a line to hear how MyAssistant answers a call.
            </p>
          </Panel>
        )}

        {turns.map((t) =>
          t.role === "user" ? (
            <Panel key={t.id} className="seq-in ml-auto w-[85%]">
              <p className="text-[15px]">“{t.text}”</p>
            </Panel>
          ) : (
            <div key={t.id} className="seq-in space-y-3">
              <Panel className="w-[92%] bg-tint-purple">
                <p className="text-[15px] leading-relaxed">{t.text}</p>
              </Panel>
              {t.actions && (
                <div className="flex gap-3">
                  {t.actions.map((a) => (
                    <Panel key={a.label} className="flex flex-1 items-center gap-2">
                      <a.icon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{a.label}</span>
                    </Panel>
                  ))}
                </div>
              )}
            </div>
          ),
        )}

        {typing && (
          <Panel className="seq-in flex w-fit items-center gap-1.5 bg-tint-purple py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="animate-dot size-1.5 rounded-full bg-foreground/60"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">MyAssistant is typing</span>
          </Panel>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {SCRIPTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => run(s)}
            disabled={busy}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-soft transition-colors hover:bg-tint-purple disabled:opacity-50"
          >
            <span className="mr-1.5 text-muted-foreground">{s.key}</span>
            {s.prompt.length > 30 ? `${s.prompt.slice(0, 30)}…` : s.prompt}
          </button>
        ))}
        {turns.length > 0 && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Keyboard: press <kbd className="font-medium">M</kbd> for mic,{" "}
        <kbd className="font-medium">1–3</kbd> to send a message,{" "}
        <kbd className="font-medium">R</kbd> to reset.
      </p>
    </div>
  );
}

const CompanionDemo = memo(CompanionDemoImpl);
export default CompanionDemo;
