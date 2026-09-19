import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getConsentCopy } from "@/lib/consent-copy";
import {
  CONSENT_CHANGED,
  OPEN_CONSENT,
  loadConsent,
  saveConsent,
} from "@/lib/consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [status, setStatus] = useState("");

  const copy = getConsentCopy();
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const existing = loadConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setHasChoice(true);
    } else {
      setOpen(true);
    }

    const reopen = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setAnalytics(loadConsent()?.analytics ?? false);
      setHasChoice(Boolean(loadConsent()));
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT, reopen);
  }, []);

  // Move focus into the banner so keyboard and screen reader users land on it.
  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setShowDetails(false);
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target && document.contains(target)) target.focus();
  }, []);

  const decide = useCallback(
    (value: boolean) => {
      saveConsent(value);
      setAnalytics(value);
      setHasChoice(true);
      setStatus(value ? copy.savedAccepted : copy.savedRejected);
      close();
    },
    [close, copy.savedAccepted, copy.savedRejected],
  );

  // Escape dismisses the panel only once a choice already exists, so the
  // first-visit banner cannot be skipped without making a decision.
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape" && hasChoice) {
        event.stopPropagation();
        close();
      }
    },
    [close, hasChoice],
  );

  return (
    <>
      <div aria-live="polite" role="status" className="sr-only">
        {status}
      </div>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descId}
          onKeyDown={onKeyDown}
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
        >
          <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-xl sm:p-5">
            <div className={showDetails ? "" : "md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-6"}>
              <div className="min-w-0">
                <h2
                  id={titleId}
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-base font-semibold text-foreground outline-none"
                >
                  {copy.title}
                </h2>
                <p id={descId} className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  {copy.description}
                </p>
              </div>

            {showDetails ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/60 p-3.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{copy.necessaryTitle}</p>
                    <p className="text-xs text-muted-foreground">{copy.necessaryBody}</p>
                  </div>
                  <Switch checked disabled aria-label={copy.necessarySwitchLabel} />
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/60 p-3.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{copy.analyticsTitle}</p>
                    <p className="text-xs text-muted-foreground">{copy.analyticsBody}</p>
                  </div>
                  <Switch
                    checked={analytics}
                    onCheckedChange={setAnalytics}
                    aria-label={copy.analyticsSwitchLabel}
                  />
                </div>
              </div>
            ) : null}

              <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:justify-end md:mt-0">
              {showDetails ? (
                <Button
                  variant="ghost"
                  onClick={() => decide(analytics)}
                  className="min-h-11 px-2 text-xs sm:order-1 sm:px-4 sm:text-sm"
                >
                  {copy.save}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDetails(true);
                    setStatus(copy.detailsOpened);
                  }}
                  aria-expanded={showDetails}
                  className="min-h-11 px-2 text-xs sm:order-1 sm:px-4 sm:text-sm"
                >
                  {copy.manage}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => decide(false)}
                className="min-h-11 px-2 text-xs sm:order-2 sm:px-4 sm:text-sm"
              >
                {copy.reject}
              </Button>
              <Button onClick={() => decide(true)} className="min-h-11 px-2 text-xs sm:order-3 sm:px-4 sm:text-sm">
                {copy.accept}
              </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


/** Small helper so other components can react to consent changes. */
export function useAnalyticsConsent() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(loadConsent()?.analytics ?? false);
    const onChange = () => setAllowed(loadConsent()?.analytics ?? false);
    window.addEventListener(CONSENT_CHANGED, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED, onChange);
  }, []);
  return allowed;
}
