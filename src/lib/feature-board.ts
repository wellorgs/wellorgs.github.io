import { supabase } from "@/integrations/supabase/client";
import type { FeatureRequest, FeatureStatus } from "@/lib/feature-requests";

export type BoardIdea = FeatureRequest & { slug: string; createdAt: string };

const VOTER_KEY_STORAGE = "myfamily.board.voter";

/** Stable anonymous key for this browser — no personal data. */
export function getVoterKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(VOTER_KEY_STORAGE);
  if (!key || key.length < 8) {
    key = `v_${crypto.randomUUID().replace(/-/g, "")}`.slice(0, 40);
    window.localStorage.setItem(VOTER_KEY_STORAGE, key);
  }
  return key;
}

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)} min ago`;
  if (diff < day) return `${Math.round(diff / 3_600_000)} hours ago`;
  const days = Math.round(diff / day);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) return `${Math.round(days / 7)} week${days < 14 ? "" : "s"} ago`;
  return `${Math.round(days / 30)} month${days < 60 ? "" : "s"} ago`;
}

type IdeaRow = {
  id: string;
  slug: string;
  title: string;
  detail: string;
  category: string;
  status: string;
  author: string;
  votes: number;
  created_at: string;
};

function toIdea(row: IdeaRow): BoardIdea {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    detail: row.detail,
    category: row.category as FeatureRequest["category"],
    status: row.status as FeatureStatus,
    votes: row.votes,
    author: row.author,
    ago: ago(row.created_at),
    createdAt: row.created_at,
  };
}

export async function fetchBoard(): Promise<{ ideas: BoardIdea[]; votedIds: string[] }> {
  const voterKey = getVoterKey();
  const { getMyVotes } = await import("@/lib/board.functions");
  const [ideasRes, votesRes] = await Promise.all([
    supabase
      .from("feature_ideas")
      .select("id,slug,title,detail,category,status,author,votes,created_at")
      .order("votes", { ascending: false }),
    voterKey
      ? getMyVotes({ data: { voterKey } }).catch(() => ({ votedIds: [] as string[] }))
      : Promise.resolve({ votedIds: [] as string[] }),
  ]);

  if (ideasRes.error) throw ideasRes.error;

  return {
    ideas: (ideasRes.data ?? []).map((row) => toIdea(row as IdeaRow)),
    votedIds: votesRes.votedIds ?? [],
  };
}

/**
 * Live updates: fires whenever any idea row or vote changes, so the board can
 * re-order itself the moment another visitor upvotes something.
 */
export function subscribeBoard(onChange: () => void): () => void {
  const channel = supabase
    .channel("feature-board-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "feature_ideas" },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}





/** Records one vote for this browser. Returns false if already voted. */
export async function castVote(ideaId: string): Promise<boolean> {
  const voter_key = getVoterKey();
  const { error } = await supabase
    .from("feature_votes")
    .insert({ idea_id: ideaId, voter_key });
  if (error) {
    if (error.code === "23505") return false; // already voted
    throw error;
  }
  return true;
}

export async function fetchVotes(ideaId: string): Promise<number> {
  const { data, error } = await supabase
    .from("feature_ideas")
    .select("votes")
    .eq("id", ideaId)
    .maybeSingle();
  if (error) throw error;
  return data?.votes ?? 0;
}

export async function submitIdea(input: {
  title: string;
  detail: string;
  category: FeatureRequest["category"];
  author: string;
}): Promise<BoardIdea> {
  const title = input.title.trim();
  const detail = input.detail.trim() || "No extra detail added.";
  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("feature_ideas")
    .insert({
      slug,
      title,
      detail,
      category: input.category,
      status: "exploring",
      author: input.author.trim() || "Anonymous",
      votes: 0,
    })
    .select("id,slug,title,detail,category,status,author,votes,created_at")
    .single();

  if (error) throw error;
  return toIdea(data as IdeaRow);
}

/** Live votes + whether this browser already voted, for a single idea slug. */
export async function fetchIdeaBySlug(
  slug: string,
): Promise<{ id: string; votes: number; voted: boolean } | null> {
  const { data, error } = await supabase
    .from("feature_ideas")
    .select("id,votes")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;

  let voted = false;
  const voterKey = getVoterKey();
  if (voterKey) {
    try {
      const { getMyVotes } = await import("@/lib/board.functions");
      const res = await getMyVotes({ data: { voterKey } });
      voted = (res.votedIds ?? []).includes(data.id as string);
    } catch {
      voted = false;
    }
  }
  return { id: data.id as string, votes: data.votes as number, voted };
}
