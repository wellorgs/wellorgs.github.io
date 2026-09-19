/**
 * Browser-safe email domain checks shared by the waitlist form and server fn.
 * Goal: accept real mailbox providers (gmail, yahoo, outlook, work domains)
 * and reject nonsense / typo'd domains with a helpful message.
 */

/** Commonly used consumer providers — always accepted. */
export const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "rocketmail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "zohomail.in",
  "gmx.com",
  "gmx.de",
  "mail.com",
  "yandex.com",
  "fastmail.com",
  "hey.com",
  "rediffmail.com",
  "hotmail.fr",
  "web.de",
  "comcast.net",
  "verizon.net",
  "sbcglobal.net",
  "btinternet.com",
  "bigpond.com",
  "shaw.ca",
  "rogers.com",
] as const;

const COMMON = new Set<string>(COMMON_EMAIL_DOMAINS);

/** Frequent typos → the provider the visitor meant. */
const TYPO_MAP: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.comm": "gmail.com",
  "yahho.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloook.com": "outlook.com",
  "icloud.co": "icloud.com",
  "iclould.com": "icloud.com",
  "protonmai.com": "protonmail.com",
};

/** TLDs we treat as plausible for a real business / personal domain. */
const ALLOWED_TLDS = new Set([
  "com","net","org","co","io","ai","app","dev","me","in","us","uk","ca","au","nz","ie",
  "de","fr","es","it","nl","se","no","fi","dk","pl","pt","ch","at","be","cz","gr",
  "sg","my","ph","id","jp","kr","cn","hk","tw","ae","sa","qa","il","tr","za","ng","ke",
  "br","mx","ar","cl","co.in","co.uk","com.au","co.nz","com.br","edu","gov","ac","biz",
  "info","tech","store","online","cloud","group","health","care","life","email","site",
]);

function tldOf(domain: string) {
  const parts = domain.split(".");
  const last2 = parts.slice(-2).join(".");
  if (ALLOWED_TLDS.has(last2)) return last2;
  return parts[parts.length - 1] ?? "";
}

export type DomainCheck =
  | { ok: true }
  | { ok: false; reason: "invalid" | "typo" | "nonsense"; message: string; suggestion?: string };

const GENERIC_MESSAGE =
  "Please use a verified email domain (like gmail.com, yahoo.com, outlook.com or your work email).";

export function checkEmailDomain(email: string): DomainCheck {
  const normalized = email.trim().toLowerCase();
  const domain = normalized.split("@")[1] ?? "";

  if (!domain || !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
    return { ok: false, reason: "invalid", message: "Please enter a valid email address." };
  }

  if (COMMON.has(domain)) return { ok: true };

  const suggestion = TYPO_MAP[domain];
  if (suggestion) {
    return {
      ok: false,
      reason: "typo",
      message: `Did you mean @${suggestion}? Please use a verified email domain.`,
      suggestion,
    };
  }

  const tld = tldOf(domain);
  if (!ALLOWED_TLDS.has(tld)) {
    return { ok: false, reason: "nonsense", message: GENERIC_MESSAGE };
  }

  // Gibberish heuristics on the domain label (e.g. "asdkjhqwe.com", "test.com").
  const label = domain.slice(0, domain.length - tld.length - 1).split(".").pop() ?? "";
  const junk =
    label.length < 2 ||
    label.length > 40 ||
    /^(test|asdf|qwerty|abc|xyz|aaa|example|nonsense|fake|dummy|nothing|noemail|none)$/.test(label) ||
    /(.)\1{3,}/.test(label) ||
    !/[aeiou]/.test(label.replace(/[^a-z]/g, "")) ||
    /[bcdfghjklmnpqrstvwxz]{6,}/.test(label);

  if (junk) return { ok: false, reason: "nonsense", message: GENERIC_MESSAGE };

  return { ok: true };
}
