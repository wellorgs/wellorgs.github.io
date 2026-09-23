import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Search } from "lucide-react";
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
  voteOnIdea,
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
      { title: "Assisty AI Feature Board: vote on what we build next" },
      {
        name: "description",
        content:
          "A live, public roadmap for Assisty AI. Upvote the features you need most, post your own idea, and follow it from exploring to shipped.",
      },
      { property: "og:title", content: "Assisty AI Feature Board: vote on what we build next" },
      {
        property: "og:description",
        content:
          "Upvote the most requested Assisty AI features and post your own idea on the live board.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://assistyai.in/features" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://assistyai.in/features" }],
  }),
  component: FeatureBoard,
});

const filters: Array<{ key: "all" | FeatureStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "exploring", label: "Exploring" },
  { key: "planned", label: "Planned" },
  { key: "in-progress", label: "In progress" },
  { key: "shipped", label: "Shipped" },
];

const categories = ["All", "Calls", "Summaries", "Escalation", "Languages", "Integrations"] as const;
type CategoryFilter = (typeof categories)[number];

type SortKey = "most-requested" | "newest" | "az";
const sorts: Array<{ key: SortKey; label: string }> = [
  { key: "most-requested", label: "Most requested" },
  { key: "newest", label: "Newest" },
  { key: "az", label: "A-Z" },
];

const statusStyles: Record<FeatureStatus, string> = {
  planned: "text-foreground/70",
  exploring: "text-primary",
  "in-progress": "text-primary",
  shipped: "text-success",
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
  const [mine, setMine] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | FeatureStatus>("all");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<SortKey>("most-requested");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [signup, setSignup] = useState<null | "vote" | "idea" | "gate">(null);
  const [joined, setJoined] = useState(true); // assume joined until we read storage
  const refreshJoined = useCallback(() => setJoined(hasJoinedWaitlist()), []);
  useEffect(refreshJoined, [refreshJoined]);
  const [draft, setDraft] = useState({
    title: "",
    detail: "",
    author: "",
    category: "Calls" as FeatureRequest["category"],
  });

  const load = useCallback(async (silent = false) => {
    try {
      const { ideas, myVotes } = await fetchBoard();
      setRequests(ideas);
      setMine(myVotes);
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

  const vote = async (id: string, dir: 1 | -1) => {
    if (!hasJoinedWaitlist()) {
      setSignup("gate");
      return;
    }
    if (pending) return;
    const before = mine[id] ?? 0;
    const next = before === dir ? 0 : dir;
    const delta = next - before;
    setPending(id);
    // Optimistic update.
    setMine((v) => ({ ...v, [id]: next }));
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, votes: r.votes + delta } : r)));
    try {
      await voteOnIdea(id, next as 1 | -1 | 0);
      void load(true);
    } catch {
      setMine((v) => ({ ...v, [id]: before }));
      setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, votes: r.votes - delta } : r)));
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
      setDraft({ title: "", detail: "", author: "", category: "Calls" });
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
          <h1 className="mx-auto max-w-3xl text-[30px] font-bold leading-[1.08] sm:text-5xl">
            What should we build next?{" "}
            <span className="text-muted-foreground">Upvote what you need most.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Early beta: we are testing these with a small group. Early-access members can upvote, downvote and post ideas.
          </p>
        </header>

        {!joined && <BoardSignupCard className="mt-8" />}



        {/* Controls */}
        <div className="sticky top-16 z-30 mt-10 rounded-xl bg-background p-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search requests"
                aria-label="Search feature requests"
                className="h-12 rounded-2xl border-transparent bg-card pl-11"
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="h-12 rounded-2xl px-6 font-semibold"
                  onClick={(e) => {
                    if (!hasJoinedWaitlist()) {
                      e.preventDefault();
                      setSignup("gate");
                    }
                  }}
                >
                  <Plus className="size-4" />
                  Post an idea
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request a feature</DialogTitle>
                  <DialogDescription>
                    Tell us what would make Assisty work better for you.
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
                    : "bg-card text-muted-foreground hover:text-foreground",
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
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    category === c
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
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
                className="h-9 rounded-full bg-card px-3 text-xs font-medium text-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
              className="font-medium text-primary hover:underline"
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
                "flex gap-4 rounded-xl bg-card p-5 transition-all duration-300",
                climbers[r.id] && "ring-2 ring-primary/40",
              )}
            >

              <div
                className="flex w-14 shrink-0 flex-col items-center self-start rounded-2xl bg-muted py-1"
                role="group"
                aria-label={`Vote on ${r.title}, ${r.votes} votes`}
              >
                <button
                  onClick={() => void vote(r.id, 1)}
                  disabled={pending === r.id}
                  aria-pressed={mine[r.id] === 1}
                  aria-label={mine[r.id] === 1 ? `Remove upvote from ${r.title}` : `Upvote ${r.title}`}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-xl transition-colors active:scale-95",
                    mine[r.id] === 1 ? "text-primary" : "text-foreground/60 hover:text-primary",
                  )}
                >
                  {pending === r.id ? <Loader2 className="size-5 animate-spin" /> : <ChevronUp className="size-5" strokeWidth={2.4} />}
                </button>
                <span className="text-sm font-semibold tabular-nums">{r.votes.toLocaleString()}</span>
                <button
                  onClick={() => void vote(r.id, -1)}
                  disabled={pending === r.id}
                  aria-pressed={mine[r.id] === -1}
                  aria-label={mine[r.id] === -1 ? `Remove downvote from ${r.title}` : `Downvote ${r.title}`}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-xl transition-colors active:scale-95",
                    mine[r.id] === -1 ? "text-destructive" : "text-foreground/60 hover:text-destructive",
                  )}
                >
                  <ChevronDown className="size-5" strokeWidth={2.4} />
                </button>
              </div>


              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em]">
                  {r.votes > 0 && (rankById.get(r.id) ?? 99) <= 3 && (
                    <span className="text-primary">#{rankById.get(r.id)} most wanted</span>
                  )}
                  {climbers[r.id] && <span className="text-success">Moved up</span>}
                  <span className={statusStyles[r.status]}>{statusLabel[r.status]}</span>
                  <span className="text-muted-foreground">{r.category}</span>
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
                      className="font-medium text-primary hover:underline"
                    >
                      View details ›
                    </Link>
                  )}
                </div>

              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="rounded-xl bg-card p-10 text-center text-muted-foreground">
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
