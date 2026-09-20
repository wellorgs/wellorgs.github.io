import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { VOICE_INTRO } from "@/components/site/voiceIntroData";

const base = import.meta.env.BASE_URL;

export function VoiceIntro() {
  const [lang, setLang] = useState<(typeof VOICE_INTRO)[number]>(VOICE_INTRO[0]);
  const [muted, setMuted] = useState(true);
  const [shown, setShown] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const t0 = useRef(0);
  const mutedRef = useRef(true);
  mutedRef.current = muted;

  const words = lang.text.split(/\s+/);

  // Muted: transcript runs on its own clock and loops. Unmuted: the audio's currentTime drives it,
  // so the words follow the voice (word times come from the audio's pauses, see voiceIntroData).
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.src = `${base}audio/intro-${lang.id}.mp3`;
    t0.current = performance.now();
    setShown(0);
    if (!mutedRef.current) void a.play().catch(() => {});
    let raf = 0;
    const tick = () => {
      let t = (performance.now() - t0.current) / 1000;
      if (mutedRef.current) {
        if (t > lang.dur + 1.5) t0.current = performance.now();
      } else t = a.currentTime;
      setShown(lang.ends.filter((e) => e <= t + 0.05).length);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lang]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    t0.current = performance.now();
    if (muted) {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } else a.pause();
    setMuted(!muted);
  };

  return (
    <div className="relative mx-auto mt-10 max-w-3xl rounded-xl bg-card p-5 text-left sm:mt-14 sm:p-8">
      <audio ref={audio} playsInline preload="auto" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Language">
          {VOICE_INTRO.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={l.id === lang.id}
              onClick={() => setLang(l)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                l.id === lang.id ? "bg-primary text-primary-foreground" : "bg-background text-foreground/80 hover:bg-tint-purple"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={!muted}
          className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {muted ? "Tap to play" : "Sound on"}
        </button>
      </div>

      {muted && (
        <div aria-hidden className="pointer-events-none absolute -top-14 right-4 hidden items-end gap-1 sm:flex">
          <span className="w-40 -rotate-3 text-right text-[22px] leading-[1.05] text-foreground/75" style={{ fontFamily: "Caveat, cursive" }}>
            Turn the sound on, see how Assisty speaks
          </span>
          <svg width="46" height="50" viewBox="0 0 46 50" fill="none" className="mb-[-14px] text-foreground/60">
            <path d="M4 4 C 6 28, 20 40, 40 42 M32 36 L40 42 L31 47" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <p lang={lang.id === "hinglish" ? "en" : lang.id} className="mt-6 min-h-[10rem] text-xl font-semibold leading-relaxed sm:min-h-[8rem] sm:text-2xl">
        {words.map((w, i) => (
          <span key={i} className={`transition-colors duration-200 ${i < shown ? "text-foreground" : "text-foreground/20"}`}>
            {w}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
