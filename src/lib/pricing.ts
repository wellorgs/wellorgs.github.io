export type CurrencyCode = "INR" | "USD" | "GBP" | "EUR" | "AED" | "AUD" | "CAD" | "SGD";

export type PlanKey = "free" | "premium" | "familyPlus" | "nri";

/** Explicit monthly + yearly price so we never show computed, unnatural numbers. */
export type PlanPrice = { monthly: number; yearly: number };

export type Region = {
  code: string; // ISO country
  country: string;
  flag: string;
  currency: CurrencyCode;
  symbol: string;
  prices: Record<PlanKey, PlanPrice> & { foundingPremium: PlanPrice };
};

/**
 * Single source of truth for pricing. Update the numbers here and every
 * surface (cards, NRI plan, comparison table, CTA copy) follows automatically.
 */
export const regions: Region[] = [
  {
    code: "IN",
    country: "India",
    flag: "🇮🇳",
    currency: "INR",
    symbol: "₹",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 249, yearly: 2249 },
      familyPlus: { monthly: 599, yearly: 5399 },
      nri: { monthly: 1499, yearly: 14999 },
      foundingPremium: { monthly: 199, yearly: 1799 },
    },
  },
  {
    code: "US",
    country: "United States",
    flag: "🇺🇸",
    currency: "USD",
    symbol: "$",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 3.99, yearly: 32.99 },
      familyPlus: { monthly: 8.99, yearly: 74.99 },
      nri: { monthly: 17.99, yearly: 149.99 },
      foundingPremium: { monthly: 2.99, yearly: 24.99 },
    },
  },
  {
    code: "GB",
    country: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    symbol: "£",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 3.49, yearly: 28.99 },
      familyPlus: { monthly: 7.99, yearly: 65.99 },
      nri: { monthly: 14.99, yearly: 124.99 },
      foundingPremium: { monthly: 2.49, yearly: 20.99 },
    },
  },
  {
    code: "EU",
    country: "Europe",
    flag: "🇪🇺",
    currency: "EUR",
    symbol: "€",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 3.99, yearly: 32.99 },
      familyPlus: { monthly: 8.99, yearly: 74.99 },
      nri: { monthly: 16.99, yearly: 141.99 },
      foundingPremium: { monthly: 2.99, yearly: 24.99 },
    },
  },
  {
    code: "AE",
    country: "UAE",
    flag: "🇦🇪",
    currency: "AED",
    symbol: "AED ",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 14, yearly: 119 },
      familyPlus: { monthly: 32, yearly: 269 },
      nri: { monthly: 65, yearly: 545 },
      foundingPremium: { monthly: 10, yearly: 89 },
    },
  },
  {
    code: "SG",
    country: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    symbol: "S$",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 5.9, yearly: 48.9 },
      familyPlus: { monthly: 12.9, yearly: 106.9 },
      nri: { monthly: 24.9, yearly: 206.9 },
      foundingPremium: { monthly: 3.9, yearly: 32.9 },
    },
  },
  {
    code: "AU",
    country: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    symbol: "A$",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 5.99, yearly: 49.99 },
      familyPlus: { monthly: 13.99, yearly: 116.99 },
      nri: { monthly: 27.99, yearly: 232.99 },
      foundingPremium: { monthly: 3.99, yearly: 33.99 },
    },
  },
  {
    code: "CA",
    country: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    symbol: "C$",
    prices: {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 5.49, yearly: 45.99 },
      familyPlus: { monthly: 12.99, yearly: 107.99 },
      nri: { monthly: 24.99, yearly: 206.99 },
      foundingPremium: { monthly: 3.99, yearly: 32.99 },
    },
  },
];

export const defaultRegion = regions[0]!;

export function formatPrice(region: Region, amount: number) {
  if (amount === 0) return `${region.symbol}0`;
  const hasDecimals = !Number.isInteger(amount);
  return `${region.symbol}${amount.toFixed(hasDecimals ? 2 : 0)}`;
}

const EU_COUNTRIES = new Set([
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "IE", "IT", "LT", "LU",
  "LV", "MT", "NL", "PT", "SI", "SK", "HR", "BG", "CZ", "DK", "HU", "PL", "RO",
  "SE", "NO", "CH", "IS", "LI",
]);

/** Countries that price most naturally in one of our existing currencies. */
const CURRENCY_PROXY: Record<string, string> = {
  // Gulf, priced in AED
  SA: "AE", QA: "AE", KW: "AE", OM: "AE", BH: "AE",
  // Sterling area
  IE: "EU", JE: "GB", GG: "GB", IM: "GB",
  // Dollar-comfortable markets
  MX: "US", PH: "US", NG: "US", KE: "US", ZA: "US", BR: "US", AR: "US",
  ID: "US", VN: "US", TH: "US", JP: "US", KR: "US", TW: "US", HK: "US",
  CN: "US", IL: "US", TR: "US", EG: "US", PK: "US", BD: "US", LK: "US", NP: "US",
  MY: "SG", NZ: "AU",
};

/** Map any ISO country code to the closest region we price in. */
export function regionForCountry(code: string | null | undefined): Region | null {
  if (!code) return null;
  const cc = code.toUpperCase();
  const exact = regions.find((r) => r.code === cc);
  if (exact) return exact;
  if (EU_COUNTRIES.has(cc)) return regions.find((r) => r.code === "EU")!;
  const proxy = CURRENCY_PROXY[cc];
  if (proxy) return regions.find((r) => r.code === proxy) ?? null;
  return null;
}

/** Best-effort country detection from the browser (locale + timezone), no network call. */
export function detectRegion(): Region {
  if (typeof window === "undefined") return defaultRegion;

  const candidates: string[] = [];

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const tzMap: Record<string, string> = {
      "Asia/Kolkata": "IN",
      "Asia/Calcutta": "IN",
      "Asia/Dubai": "AE",
      "Asia/Singapore": "SG",
    };
    if (tzMap[tz]) candidates.push(tzMap[tz]!);
    const tzCountry: Record<string, string> = {
      "Asia/Manila": "PH",
      "Asia/Karachi": "PK",
      "Asia/Dhaka": "BD",
      "Asia/Colombo": "LK",
      "Asia/Kathmandu": "NP",
      "Asia/Riyadh": "SA",
      "Asia/Qatar": "QA",
      "Asia/Kuwait": "KW",
      "Asia/Muscat": "OM",
      "Asia/Bahrain": "BH",
      "Asia/Tokyo": "JP",
      "Asia/Seoul": "KR",
      "Asia/Hong_Kong": "HK",
      "Asia/Kuala_Lumpur": "MY",
      "Africa/Lagos": "NG",
      "Africa/Nairobi": "KE",
      "Africa/Johannesburg": "ZA",
    };
    if (tzCountry[tz]) candidates.push(tzCountry[tz]!);
    if (tz.startsWith("America/Toronto") || tz.startsWith("America/Vancouver") ||
        tz.startsWith("America/Edmonton") || tz.startsWith("America/Winnipeg") ||
        tz.startsWith("America/Halifax") || tz.startsWith("America/St_Johns")) {
      candidates.push("CA");
    }
    if (tz.startsWith("Pacific/Auckland")) candidates.push("NZ");
    if (tz.startsWith("America/")) candidates.push("US");
    if (tz.startsWith("Australia/")) candidates.push("AU");
    if (tz.startsWith("Europe/London")) candidates.push("GB");
    if (tz.startsWith("Europe/")) candidates.push("EU");
  } catch {
    /* ignore */
  }

  for (const locale of navigator.languages ?? [navigator.language]) {
    const part = locale?.split("-")[1]?.toUpperCase();
    if (part) candidates.push(part);
  }

  for (const code of candidates) {
    const match = regionForCountry(code);
    if (match) return match;
  }

  return defaultRegion;
}

const STORAGE_KEY = "myfamily.region";

export function loadStoredRegion(): Region | null {
  if (typeof window === "undefined") return null;
  try {
    const code = window.localStorage.getItem(STORAGE_KEY);
    return regions.find((r) => r.code === code) ?? null;
  } catch {
    return null;
  }
}

export function storeRegion(region: Region) {
  try {
    window.localStorage.setItem(STORAGE_KEY, region.code);
  } catch {
    /* ignore */
  }
}

/* ---------- billing cycle ---------- */

export type BillingCycle = "monthly" | "yearly";

function tidy(amount: number) {
  return Math.round(amount * 100) / 100;
}

/** Amount actually charged per billing period. */
export function cycleAmount(price: PlanPrice, cycle: BillingCycle) {
  return cycle === "monthly" ? price.monthly : price.yearly;
}

/** Effective per-month amount for a cycle (used for "≈ x/mo" copy). */
export function perMonthAmount(price: PlanPrice, cycle: BillingCycle) {
  if (price.monthly === 0) return 0;
  return cycle === "monthly" ? price.monthly : tidy(price.yearly / 12);
}

/** How much a yearly plan saves vs paying monthly, in percent. */
export function yearlySavingsPercent(price: PlanPrice) {
  if (price.monthly === 0) return 0;
  return Math.round((1 - price.yearly / (price.monthly * 12)) * 100);
}

export function cycleSuffix(cycle: BillingCycle) {
  return cycle === "monthly" ? "/month" : "/year";
}

/** Headline saving used in the billing toggle copy (based on the Premium plan). */
export const YEARLY_DISCOUNT_PERCENT = yearlySavingsPercent(
  defaultRegion.prices.premium,
);
