/**
 * First-touch attribution: which link brought this visitor in. Captured once per
 * browser (first visit wins) from ?utm_source=... or the referring site, and sent
 * along with the early-access form so signups can be counted per channel.
 */
const KEY = "assistyai.source";

function fromReferrer(): string {
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host && host !== location.hostname ? `referral:${host}` : "";
  } catch {
    return "";
  }
}

export function captureTrafficSource() {
  try {
    if (window.localStorage.getItem(KEY)) return; // first touch already recorded
    const params = new URLSearchParams(location.search);
    const utm = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    let source = utm ? `${utm}${medium ? `/${medium}` : ""}${campaign ? `/${campaign}` : ""}` : fromReferrer();
    if (!source) source = "direct";
    window.localStorage.setItem(KEY, source.slice(0, 80));
  } catch {
    /* storage blocked, ignore */
  }
}

export function getTrafficSource(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
