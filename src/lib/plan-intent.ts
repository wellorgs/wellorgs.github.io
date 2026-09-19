/**
 * Remembers which pricing plan a visitor clicked before landing on the
 * waitlist form. Optional signal, never blocks the signup.
 */
const KEY = "myfamily.waitlist.plan";
const EVENT = "myfamily:plan-intent";

export function setPlanIntent(plan: string) {
  try {
    window.sessionStorage.setItem(KEY, plan);
  } catch {
    /* storage blocked, ignore */
  }
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: plan }));
}

export function getPlanIntent(): string {
  try {
    return window.sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearPlanIntent() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: "" }));
}

export function onPlanIntentChange(handler: (plan: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail ?? "");
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
