export type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "assistyai.cookie-consent";
export const CONSENT_CHANGED = "assistyai:consent-changed";
export const OPEN_CONSENT = "assistyai:open-consent";

export function loadConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = {
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGED, { detail: choice }));
  return choice;
}

/** Reopen the preferences panel from anywhere, for example the footer link. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT));
}

export function hasAnalyticsConsent() {
  return loadConsent()?.analytics === true;
}
