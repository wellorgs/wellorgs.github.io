import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const frame = useRef<number | null>(null);
  const visibleRef = useRef(false);

  const evaluate = useCallback(() => {
    frame.current = null;
    const hero = document.getElementById("hero");
    const heroBottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0;

    // Hide whenever a real waitlist form is on (or near) the screen.
    let nearForm = false;
    for (const el of document.querySelectorAll("[id='waitlist']")) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120 && rect.bottom > -120) {
        nearForm = true;
        break;
      }
    }

    const next = window.scrollY > heroBottom && !nearForm;
    if (next !== visibleRef.current) {
      visibleRef.current = next;
      setVisible(next);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [dismissed, evaluate]);

  const shown = visible && !dismissed;

  return (
    <div
      role="region"
      aria-label="Request Early Access"
      aria-hidden={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background md:hidden",
        "transform-gpu transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none",
        "pb-[env(safe-area-inset-bottom)]",
        shown ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
        {/* PRICING PENDING - "First 7 days free, no card needed" line removed until pricing is finalised. Original:
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">Request Early Access</p>
          <span className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight text-foreground">
            <Sparkles className="animate-spark size-3 shrink-0 text-primary" strokeWidth={2.2} />
            <span className="truncate">First 7 days free, no card needed</span>
          </span>
        </div>
        (also re-add Sparkles to the lucide-react import) */}

        <a
          href="#waitlist"
          tabIndex={shown ? undefined : -1}
          className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background"
        >
          Request Early Access
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss early access bar"
          tabIndex={shown ? undefined : -1}
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
