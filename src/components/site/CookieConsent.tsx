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
          className="fixed bottom-3 right-3 z-[60] w-[calc(100%-1.5rem)] max-w-[340px] sm:bottom-4 sm:right-4"
        >
          <div className="w-full rounded-2xl border border-border bg-card p-4">
            <div>
              <div className="min-w-0">
                <h2
                  id={titleId}
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-[15px] font-semibold text-foreground outline-none"
                >
                  {copy.title}
                </h2>
                <p id={descId} className="mt-1 text-xs leading-relaxed text-muted-foreground">
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

              <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              {showDetails ? (
                <Button
                  variant="ghost"
                  onClick={() => decide(analytics)}
                  className="h-9 px-3 text-xs"
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
                  className="h-9 px-3 text-xs"
                >
                  {copy.manage}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => decide(false)}
                className="h-9 px-3 text-xs"
              >
                {copy.reject}
              </Button>
              <Button onClick={() => decide(true)} className="h-9 px-3 text-xs">
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
