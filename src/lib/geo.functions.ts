import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

/**
 * Best-effort ISO country of the visitor, read from edge/CDN geo headers.
 * Returns null when the platform does not provide one (local dev, unknown).
 */
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  const headers = [
    "cf-ipcountry",
    "x-vercel-ip-country",
    "x-nf-client-connection-country",
    "x-country-code",
    "x-geo-country",
  ];

  for (const name of headers) {
    const value = getRequestHeader(name);
    if (value && value.length === 2 && value !== "XX" && value !== "T1") {
      return { country: value.toUpperCase() };
    }
  }

  return { country: null as string | null };
});
