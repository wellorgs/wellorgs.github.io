import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { exportWaitlistCsv } from "@/lib/waitlist-export.functions";

export const Route = createFileRoute("/admin/export")({
  component: ExportPage,
  head: () => ({
    meta: [
      { title: "Export waitlist | myFamily365" },
      { name: "description", content: "Download myFamily365 waitlist signups as a CSV file." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Export waitlist | myFamily365" },
      { property: "og:description", content: "Download myFamily365 waitlist signups as a CSV file." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ExportPage() {
  const runExport = useServerFn(exportWaitlistCsv);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passcode.trim() || loading) return;
    setLoading(true);
    try {
      const result = await runExport({ data: { passcode } });
      if (!result.ok) {
        toast.error("Incorrect passcode");
        return;
      }
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `myfamily-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${result.count} signup${result.count === 1 ? "" : "s"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col justify-center px-6 py-24">
        <h1 className="sr-only">Export waitlist signups</h1>
        <Card className="rounded-3xl border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Export waitlist</CardTitle>
            <CardDescription>
              Enter the admin passcode to download every signup as a CSV with name, email, phone and
              join date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Admin passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  autoComplete="current-password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-2xl"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl">
                {loading ? "Preparing CSV…" : "Download CSV"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
