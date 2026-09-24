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
  // so the words follow the voice (word start times in voiceIntroData).
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
      setShown(lang.starts.filter((st) => st <= t + 0.03).length);
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
    <div className="relative mx-auto mt-20 max-w-3xl rounded-xl bg-card p-5 text-left sm:p-8 xl:mt-14">
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
        <div className="relative">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={!muted}
          className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {muted ? "Tap to play" : "Sound on"}
        </button>
          {muted && (
            <div aria-hidden className="pointer-events-none xl:hidden">
              <span
                className="absolute bottom-full right-0 mb-[38px] w-[13rem] -rotate-2 text-right text-[20px] leading-[1.05] text-foreground/75"
                style={{ fontFamily: "Caveat, cursive" }}
              >
                Turn the sound on, see how Assisty speaks
              </span>
              <svg width="156" height="70" viewBox="0 0 156 70" fill="none" className="absolute -left-[104px] -top-[40px] text-foreground/60">
                <path d="M150 4 C 110 -6, 46 6, 44 30 C 42 52, 76 62, 100 58 M91 53.7 L100 58 L93 65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {muted && (
        <div aria-hidden className="pointer-events-none absolute left-full top-8 -ml-7 hidden w-56 items-center gap-1 xl:flex">
          <svg width="64" height="34" viewBox="0 0 64 34" fill="none" className="shrink-0 text-foreground/60">
            <path d="M62 28 C 48 32, 26 30, 8 14 M19 15 L8 14 L11 25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="mt-6 -rotate-3 text-[22px] leading-[1.05] text-foreground/75" style={{ fontFamily: "Caveat, cursive" }}>
            Turn the sound on, see how Assisty speaks
          </span>
        </div>
      )}

      <p lang="en" className="mt-6 min-h-[10rem] text-xl font-semibold leading-relaxed sm:min-h-[8rem] sm:text-2xl">
        {words.map((w, i) => (
          <span key={i} className={`transition-colors duration-200 ${i < shown ? "text-foreground" : "text-foreground/20"}`}>
            {w}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
