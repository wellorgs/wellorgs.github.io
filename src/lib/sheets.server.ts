/**
 * Appends a waitlist signup to the connected Google Sheet through the
 * Lovable connector gateway. Never throws — a Sheets failure must not
 * break the signup, but the outcome is reported back to the caller.
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const DEFAULT_SPREADSHEET_ID = "";
const RANGE = "Sheet1!A:F";

export type SheetSyncResult =
  | { synced: true }
  | { synced: false; reason: "not-configured" | "request-failed" | "network-error" };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function appendSignupToSheet(row: {
  name: string;
  email: string;
  phone: string;
  plan: string;
  flagged: boolean;
}): Promise<SheetSyncResult> {
  const lovableKey = process.env['LOVABLE_API_KEY'];
  const connectionKey = process.env['GOOGLE_SHEETS_API_KEY'];
  const spreadsheetId =
    process.env['WAITLIST_SPREADSHEET_ID']?.trim() || DEFAULT_SPREADSHEET_ID;

  if (!lovableKey || !connectionKey) {
    console.error("[waitlist] sheets sync skipped: connector env vars missing");
    return { synced: false, reason: "not-configured" };
  }

  const url =
    `${GATEWAY_URL}/spreadsheets/${spreadsheetId}/values/${RANGE}:append` +
    `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const body = JSON.stringify({
    values: [
      [
        new Date().toISOString(),
        row.name,
        row.email,
        row.phone || "",
        row.flagged ? "yes" : "no",
        row.plan || "",
      ],
    ],
  });

  // Two attempts: transient gateway/quota errors (429/5xx) get one retry.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": connectionKey,
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.ok) return { synced: true };

      const errorBody = await res.text();
      console.error(`[waitlist] sheets append failed [${res.status}]: ${errorBody}`);

      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt === 1) return { synced: false, reason: "request-failed" };
      await sleep(600);
    } catch (err) {
      console.error("[waitlist] sheets sync error", err);
      if (attempt === 1) return { synced: false, reason: "network-error" };
      await sleep(600);
    }
  }

  return { synced: false, reason: "request-failed" };
}
