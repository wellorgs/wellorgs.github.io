const TOKEN = "Ad@22031996";

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.token !== TOKEN) return ContentService.createTextOutput("forbidden");

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Date", "Time (IST)", "Name", "Email", "Phone", "Plan", "Source", "Flagged"]);
  }

  const safe = (v) => (/^[=+\-@]/.test(String(v || "")) ? "'" + v : v || "");
  const t = new Date(d.at);

  sh.appendRow([
    Utilities.formatDate(t, "Asia/Kolkata", "dd MMM yyyy"),
    Utilities.formatDate(t, "Asia/Kolkata", "hh:mm a"),
    safe(d.name),
    safe(d.email),
    safe(d.phone),
    safe(d.plan),
    safe(d.source),
    d.flagged ? "yes" : "",
  ]);

  return ContentService.createTextOutput("ok");
}
