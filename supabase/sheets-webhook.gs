// Google Sheet: Extensions -> Apps Script -> paste this -> Deploy -> New deployment -> Web app
// (Execute as: Me, Who has access: Anyone). Copy the /exec URL. No password needed: the long URL is the secret.
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(["Joined at", "Name", "Email", "Phone", "Plan", "Flagged"]);
  const safe = (v) => (/^[=+\-@]/.test(String(v || "")) ? "'" + v : v || "");
  sh.appendRow([d.at, safe(d.name), safe(d.email), safe(d.phone), safe(d.plan), d.flagged ? "yes" : ""]);
  return ContentService.createTextOutput("ok");
}
