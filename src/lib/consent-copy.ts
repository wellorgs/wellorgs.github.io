/**
 * All user-visible cookie consent strings live here so they can be translated
 * later without touching the component. Keys are stable; values are the
 * English (en) source text. To localise, add a sibling dictionary with the
 * same keys and pick it from the active locale.
 */
export type ConsentCopy = {
  regionLabel: string;
  title: string;
  description: string;
  necessaryTitle: string;
  necessaryBody: string;
  necessarySwitchLabel: string;
  analyticsTitle: string;
  analyticsBody: string;
  analyticsSwitchLabel: string;
  manage: string;
  save: string;
  reject: string;
  accept: string;
  close: string;
  savedAccepted: string;
  savedRejected: string;
  detailsOpened: string;
};

export const consentCopyEn: ConsentCopy = {
  regionLabel: "Cookie choices",
  title: "Cookies on Assisty AI",
  description:
    "We use a small number of cookies to keep the site working. With your permission we also measure which pages people read, so we can improve them. You can change this at any time from the Cookie settings link in the footer.",
  necessaryTitle: "Strictly necessary",
  necessaryBody:
    "Needed for the waitlist form, security and spam protection. Always on.",
  necessarySwitchLabel: "Strictly necessary cookies are always on",
  analyticsTitle: "Analytics",
  analyticsBody:
    "Anonymous page views, clicks and scroll heatmaps, with form fields hidden. No personal profiles, no advertising.",
  analyticsSwitchLabel: "Allow analytics cookies",
  manage: "Manage settings",
  save: "Save my choices",
  reject: "Reject analytics",
  accept: "Accept all",
  close: "Close cookie settings",
  savedAccepted: "Analytics cookies allowed. Your choice has been saved.",
  savedRejected: "Analytics cookies turned off. Your choice has been saved.",
  detailsOpened: "Cookie settings expanded.",
};

/** Returns the dictionary for the active locale. English is the only one for now. */
export function getConsentCopy(_locale?: string): ConsentCopy {
  return consentCopyEn;
}
