import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Loader2, Plus, Search } from "lucide-react";
import { toast } from "@/lib/toast";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  seedRequests,
  statusLabel,
  requestSlug,
  type FeatureRequest,
  type FeatureStatus,
} from "@/lib/feature-requests";
import {
  castVote,
  fetchBoard,
  submitIdea,
  subscribeBoard,
  type BoardIdea,
} from "@/lib/feature-board";
import { cn } from "@/lib/utils";
import {
  BoardSignupCard,
  BoardSignupDialog,
  hasJoinedWaitlist,
} from "@/components/site/BoardSignupPrompt";


export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "myFamily365 Feature Board: vote on what we build next" },
      {
        name: "description",
        content:
          "A live, public roadmap for myFamily365. Upvote the most requested care features, post your own idea, and follow it from exploring to shipped.",
      },
      { property: "og:title", content: "myFamily365 Feature Board: vote on what we build next" },
      {
        property: "og:description",
        content:
          "Upvote the most requested myFamily365 features and post your own idea on the live board.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://myfamilapp.lovable.app/features" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://myfamilapp.lovable.app/features" }],
  }),
  component: FeatureBoard,
});

const filters: Array<{ key: "all" | FeatureStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "exploring", label: "Exploring" },
  { key: "planned", label: "Planned" },
  { key: "in-progress", label: "In progress" },
  { key: "shipped", label: "Exploring" },
];

const categories = ["All", "Care", "Health", "AI", "Family", "Safety"] as const;
type CategoryFilter = (typeof categories)[number];

type SortKey = "most-requested" | "newest" | "az";
const sorts: Array<{ key: SortKey; label: string }> = [
  { key: "most-requested", label: "Most requested" },
  { key: "newest", label: "Newest" },
  { key: "az", label: "A–Z" },
];

const statusStyles: Record<FeatureStatus, string> = {
  planned: "bg-tint-blue text-foreground/70",
  exploring: "bg-tint-purple text-foreground/70",
  "in-progress": "bg-tint-amber text-foreground/70",
  shipped: "bg-tint-green text-foreground/70",
};

type BoardRow = FeatureRequest & { slug?: string; createdAt?: string };

const seedSlugs = new Set(seedRequests.map((r) => requestSlug(r)));

/** Only the curated ideas have a static detail page. */
function hasDetailPage(r: BoardRow) {
  return seedSlugs.has(r.slug ?? requestSlug(r));
}

const seedFallback: BoardRow[] = seedRequests.map((r) => ({ ...r, slug: requestSlug(r) }));


function FeatureBoard() {
  const [requests, setRequests] = useState<BoardRow[]>(seedFallback);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | FeatureStatus>("all");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<SortKey>("most-requested");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [signup, setSignup] = useState<null | "vote" | "idea">(null);
  const [joined, setJoined] = useState(true); // assume joined until we read storage
  const refreshJoined = useCallback(() => setJoined(hasJoinedWaitlist()), []);
  useEffect(refreshJoined, [refreshJoined]);
  const [draft, setDraft] = useState({
    title: "",
    detail: "",
    author: "",
    category: "Care" as FeatureRequest["category"],
  });

  const load = useCallback(async (silent = false) => {
    try {
      const { ideas, votedIds } = await fetchBoard();
      setRequests(ideas);
      setVoted(Object.fromEntries(votedIds.map((id) => [id, true])));
    } catch {
      if (!silent) toast.error("Could not load the live board. Showing the latest saved list.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    void loadRef.current();
    // Keep counts live while the tab is open.
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadRef.current(true);
    }, 8_000);
    // Push updates: re-rank the moment anyone else votes.
    const unsubscribe = subscribeBoard(() => void loadRef.current(true));
    return () => {
      window.clearInterval(timer);
      unsubscribe();
    };
  }, []);

  /** Global rank by votes, independent of the current filters. */
  const rankById = useMemo(() => {
    const ordered = [...requests].sort(
      (a, b) => b.votes - a.votes || a.title.localeCompare(b.title),
    );
    return new Map(ordered.map((r, i) => [r.id, i + 1]));
  }, [requests]);

  // Highlight ideas that just climbed the board.
  const prevRanks = useRef<Map<string, number>>(new Map());
  const [climbers, setClimbers] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const previous = prevRanks.current;
    if (previous.size) {
      const moved: Record<string, boolean> = {};
      rankById.forEach((rank, id) => {
        const before = previous.get(id);
        if (before !== undefined && rank < before) moved[id] = true;
      });
      if (Object.keys(moved).length) {
        setClimbers(moved);
        window.setTimeout(() => setClimbers({}), 4000);
      }
    }
    prevRanks.current = rankById;
  }, [rankById]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = requests
      .map((r, index) => ({ r, index }))
      .filter(({ r }) => (filter === "all" ? true : r.status === filter))
      .filter(({ r }) => (category === "All" ? true : r.category === category))
      .filter(({ r }) => (q ? (r.title + r.detail).toLowerCase().includes(q) : true));

    list.sort((a, b) => {
      if (sort === "newest") {
        if (a.r.createdAt && b.r.createdAt) {
          return new Date(b.r.createdAt).getTime() - new Date(a.r.createdAt).getTime();
        }
        return a.index - b.index;
      }
      if (sort === "az") return a.r.title.localeCompare(b.r.title);
      return b.r.votes - a.r.votes || a.r.title.localeCompare(b.r.title);
    });

    return list.map(({ r }) => r);
  }, [requests, filter, category, sort, query]);


  const isDefaultView =
    filter === "all" && category === "All" && sort === "most-requested" && !query.trim();

  const upvote = async (id: string) => {
    if (voted[id] || pending) return;
    setPending(id);
    // Optimistic bump.
    setVoted((v) => ({ ...v, [id]: true }));
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)));
    try {
      const added = await castVote(id);
      if (!added) toast("You already voted for this one");
      if (added && !hasJoinedWaitlist()) setSignup("vote");
      void load(true);
    } catch {
      setVoted((v) => ({ ...v, [id]: false }));
      setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, votes: r.votes - 1 } : r)));
      toast.error("Couldn't record your vote. Try again.");
    } finally {
      setPending(null);
    }
  };

  const submit = async () => {
    if (draft.title.trim().length < 5) {
      toast.error("Give your idea a slightly longer title");
      return;
    }
    setSubmitting(true);
    try {
      const created: BoardIdea = await submitIdea({
        title: draft.title,
        detail: draft.detail,
        category: draft.category,
        author: draft.author || "You",
      });
      setRequests((r) => [created, ...r]);
      await castVote(created.id).catch(() => false);
      setDraft({ title: "", detail: "", author: "", category: "Care" });
      setOpen(false);
      toast.success("Idea posted to the board", {
        description: "We review new requests every Monday.",
      });
      if (!hasJoinedWaitlist()) setSignup("idea");
      void load(true);
    } catch {
      toast.error("Couldn't post your idea. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalVotes = requests.reduce((s, r) => s + r.votes, 0);


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 pb-4 pt-10 sm:px-5 sm:pt-14">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-soft">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            Live board · {loading ? "syncing…" : `${totalVotes.toLocaleString()} votes`}
          </span>
          <h1 className="mt-6 text-[30px] font-bold leading-[1.08] sm:text-5xl">
            What should we build next?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
            The myFamily365 roadmap is public. Upvote the requests you need most. The
            top ideas go into the next release.
          </p>
        </header>

        {!joined && <BoardSignupCard className="mt-8" />}



        {/* Controls */}
        <div className="sticky top-16 z-30 mt-10 rounded-3xl border border-border/60 bg-background/80 p-2 backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search requests"
                aria-label="Search feature requests"
                className="h-12 rounded-2xl border-transparent bg-card pl-11 shadow-soft"
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 rounded-2xl px-6 font-semibold shadow-soft">
                  <Plus className="size-4" />
                  Post an idea
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request a feature</DialogTitle>
                  <DialogDescription>
                    Tell us what would make caring for your parents easier.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Short title"
                    aria-label="Feature title"
                    className="h-12 rounded-2xl"
                  />
                  <Textarea
                    value={draft.detail}
                    onChange={(e) => setDraft({ ...draft, detail: e.target.value })}
                    placeholder="What problem does it solve?"
                    aria-label="Feature detail"
                    rows={4}
                    className="rounded-2xl"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={draft.author}
                      onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                      placeholder="Your name (optional)"
                      aria-label="Your name"
                      className="h-12 flex-1 rounded-2xl"
                    />
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          category: e.target.value as FeatureRequest["category"],
                        })
                      }
                      aria-label="Category"
                      className="h-12 rounded-2xl border border-input bg-background px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {categories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => void submit()}
                    disabled={submitting}
                    className="h-12 w-full rounded-2xl font-semibold"
                  >
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                    {submitting ? "Posting…" : "Post to board"}
                  </Button>
                </DialogFooter>

              </DialogContent>
            </Dialog>
          </div>

          <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground shadow-soft hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-2 px-1 pb-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    category === c
                      ? "border-foreground/80 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c === "All" ? "All categories" : c}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <label htmlFor="board-sort" className="text-xs text-muted-foreground">
                Sort
              </label>
              <select
                id="board-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground shadow-soft outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sorts.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 px-1 text-sm text-muted-foreground">
          <p aria-live="polite">
            {visible.length} {visible.length === 1 ? "idea" : "ideas"}
            {!isDefaultView ? (visible.length === 1 ? " matches your filters" : " match your filters") : ""}
          </p>
          {!isDefaultView && (
            <button
              onClick={() => {
                setFilter("all");
                setCategory("All");
                setSort("most-requested");
                setQuery("");
              }}
              className="font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Reset
            </button>
          )}
        </div>


        {/* Board */}
        <ul className="mt-3 space-y-3">
          {visible.map((r) => (
            <li
              key={r.id}
              className={cn(
                "flex gap-4 rounded-3xl bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
                climbers[r.id] && "ring-2 ring-primary/40",
              )}
            >

              <button
                onClick={() => void upvote(r.id)}
                disabled={!!voted[r.id] || pending === r.id}
                aria-pressed={!!voted[r.id]}
                aria-label={
                  voted[r.id]
                    ? `You upvoted ${r.title}, ${r.votes} votes`
                    : `Upvote ${r.title}, ${r.votes} votes`
                }
                className={cn(
                  "flex h-[68px] w-14 shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-200 disabled:cursor-default",
                  voted[r.id]
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/60 text-foreground/70 hover:-translate-y-0.5 hover:border-primary/40 active:scale-95",
                )}
              >
                {pending === r.id ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ChevronUp className="size-5" strokeWidth={2.4} />
                )}
                <span className="text-sm font-semibold tabular-nums">
                  {r.votes.toLocaleString()}
                </span>
              </button>


              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {(rankById.get(r.id) ?? 99) <= 3 && (
                    <span className="rounded-full bg-tint-amber px-2.5 py-1 text-xs font-semibold">
                      #{rankById.get(r.id)} most wanted
                    </span>
                  )}
                  {climbers[r.id] && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2.5 py-1 text-xs font-semibold">
                      <ChevronUp className="size-3" strokeWidth={3} />
                      Moved up
                    </span>
                  )}

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      statusStyles[r.status],
                    )}
                  >
                    {statusLabel[r.status]}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {r.category}
                  </span>
                </div>
                <h2 className="mt-2.5 text-[17px] font-semibold leading-snug">
                  {hasDetailPage(r) ? (
                    <Link
                      to="/features/$slug"
                      params={{ slug: r.slug ?? requestSlug(r) }}
                      className="transition-colors hover:text-primary"
                    >
                      {r.title}
                    </Link>
                  ) : (
                    r.title
                  )}
                </h2>
                <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                  {r.detail}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {r.author} · {r.ago}
                  </span>
                  {hasDetailPage(r) && (
                    <Link
                      to="/features/$slug"
                      params={{ slug: r.slug ?? requestSlug(r) }}
                      className="font-medium text-foreground/70 transition-colors hover:text-primary"
                    >
                      View details →
                    </Link>
                  )}
                </div>

              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="rounded-3xl bg-card p-10 text-center text-muted-foreground shadow-soft">
              No requests match that yet. Be the first to post one.
            </li>
          )}
        </ul>
      </main>

      <BoardSignupDialog
        open={signup !== null}
        onOpenChange={(next) => {
          if (!next) {
            setSignup(null);
            refreshJoined();
          }
        }}
        reason={signup ?? "vote"}
      />


      <SiteFooter />
    </div>
  );
}
