import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronUp, Link2 } from "lucide-react";
import { toast } from "@/lib/toast";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  findRequestBySlug,
  requestSlug,
  seedRequests,
  statusLabel,
  type FeatureRequest,
  type FeatureStatus,
} from "@/lib/feature-requests";
import { cn } from "@/lib/utils";

const statusStyles: Record<FeatureStatus, string> = {
  planned: "bg-tint-blue text-foreground/70",
  exploring: "bg-tint-purple text-foreground/70",
  "in-progress": "bg-tint-amber text-foreground/70",
  shipped: "bg-tint-green text-foreground/70",
};

const timeline: FeatureStatus[] = ["exploring", "planned", "in-progress", "shipped"];

export const Route = createFileRoute("/features_/$slug")({
  loader: ({ params }): { request: FeatureRequest } => {
    const request = findRequestBySlug(params.slug);
    if (!request) throw notFound();
    return { request };
  },
  head: ({ loaderData, params }) => {
    const r = loaderData?.request;
    const title = r ? `${r.title} | Assisty AI Feature Board` : "Feature idea | Assisty AI";
    const description = r?.detail ?? "A feature idea on the public Assisty AI roadmap.";
    const url = `https://assistyai.in/features/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 sm:px-5 text-center">
        <h1 className="text-3xl font-bold">This idea doesn&apos;t exist</h1>
        <p className="mt-3 text-muted-foreground">
          It may have been merged into another request.
        </p>
        <Button asChild className="mt-8 h-12 rounded-2xl px-6 font-semibold">
          <Link to="/features">Back to the board</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  ),
  component: FeatureDetail,
});

function FeatureDetail() {
  const { request } = Route.useLoaderData() as { request: FeatureRequest };
  const [voted, setVoted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveId, setLiveId] = useState<string | null>(null);
  const [votes, setVotes] = useState(request.votes);
  const [pending, setPending] = useState(false);

  const slug = requestSlug(request);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { fetchIdeaBySlug } = await import("@/lib/feature-board");
      const live = await fetchIdeaBySlug(slug);
      if (!active || !live) return;
      setLiveId(live.id);
      setVotes(live.votes);
      setVoted(live.voted);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const upvote = async () => {
    if (voted || pending || !liveId) return;
    setPending(true);
    setVoted(true);
    setVotes((v) => v + 1);
    try {
      const { castVote } = await import("@/lib/feature-board");
      const added = await castVote(liveId);
      if (!added) {
        setVotes((v) => v - 1);
        toast("You already voted for this one");
      } else {
        toast.success("Upvote counted");
      }
    } catch {
      setVoted(false);
      setVotes((v) => v - 1);
      toast.error("Couldn't record your vote. Try again.");
    } finally {
      setPending(false);
    }
  };

  const related = seedRequests
    .filter((r) => r.id !== request.id && r.category === request.category)
    .slice(0, 3);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied. Share it with anyone.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 pb-8 pt-10 sm:px-5 sm:pt-12">
        <Link
          to="/features"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Feature board
        </Link>

        <article className="mt-6 rounded-3xl bg-card p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                statusStyles[request.status],
              )}
            >
              {statusLabel[request.status]}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {request.category}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.15] sm:text-4xl">
            {request.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {request.detail}
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            Requested by {request.author} · {request.ago}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void upvote()}
              disabled={voted || pending}
              aria-pressed={voted}
              aria-label={voted ? `You upvoted ${request.title}` : `Upvote ${request.title}`}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition-all duration-200 disabled:cursor-default",

                voted
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/60 text-foreground/80 hover:border-primary/40",
              )}
            >
              <ChevronUp className="size-5" strokeWidth={2.4} />
              <span className="tabular-nums">{votes.toLocaleString()}</span>
              <span className="font-medium">{voted ? "upvoted" : "upvote"}</span>
            </button>

            <Button
              variant="secondary"
              onClick={copyLink}
              className="h-12 rounded-2xl px-5 font-semibold"
            >
              {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
              {copied ? "Link copied" : "Copy share link"}
            </Button>
          </div>
        </article>

        <section className="mt-6 rounded-3xl bg-card p-7 sm:p-9">
          <h2 className="text-lg font-semibold">Progress</h2>
          <ol className="mt-5 space-y-4">
            {timeline.map((step) => {
              const reached = timeline.indexOf(request.status) >= timeline.indexOf(step);
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border",
                      reached
                        ? "border-transparent bg-foreground text-background"
                        : "border-border text-transparent",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span
                    className={cn(
                      "text-[15px]",
                      reached ? "font-medium" : "text-muted-foreground",
                    )}
                  >
                    {statusLabel[step]}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {related.length > 0 && (
          <section className="mt-6">
            <h2 className="px-1 text-lg font-semibold">More in {request.category}</h2>
            <ul className="mt-3 space-y-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    to="/features/$slug"
                    params={{ slug: requestSlug(r) }}
                    className="block rounded-3xl bg-card p-5 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <p className="font-semibold leading-snug">{r.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.votes.toLocaleString()} votes · {statusLabel[r.status]}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
