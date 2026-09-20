// Google Sheet: Extensions -> Apps Script -> paste this -> set TOKEN -> Deploy -> New deployment -> Web app
// (Execute as: Me, Who has access: Anyone). Copy the /exec URL.
const TOKEN = "PUT_A_LONG_RANDOM_STRING_HERE"; // same value goes in Cloudflare as WAITLIST_SHEETS_TOKEN

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.token !== TOKEN) return ContentService.createTextOutput("forbidden");
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(["Joined at", "Name", "Email", "Phone", "Plan", "Flagged"]);
  const safe = (v) => (/^[=+\-@]/.test(String(v || "")) ? "'" + v : v || "");
  sh.appendRow([d.at, safe(d.name), safe(d.email), safe(d.phone), safe(d.plan), d.flagged ? "yes" : ""]);
  return ContentService.createTextOutput("ok");
}
