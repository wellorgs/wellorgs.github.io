export type FeatureStatus = "planned" | "exploring" | "in-progress" | "shipped";

export type FeatureRequest = {
  id: string;
  title: string;
  detail: string;
  category: "Calls" | "Summaries" | "Escalation" | "Languages" | "Integrations";
  status: FeatureStatus;
  votes: number;
  author: string;
  ago: string;
};

export const statusLabel: Record<FeatureStatus, string> = {
  planned: "Planned",
  exploring: "Exploring",
  "in-progress": "In progress",
  shipped: "Shipped",
};

export const seedRequests: FeatureRequest[] = [
  {
    id: "fr-1",
    title: "Let callers book a time with me",
    detail: "Assisty offers the caller a slot from my calendar and sends me the confirmation with the summary.",
    category: "Calls",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-2",
    title: "Transfer the live call to me",
    detail: "If a caller says they need me personally, Assisty rings me and hands the call over without dropping it.",
    category: "Calls",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-3",
    title: "Spam and sales call filtering",
    detail: "Recognise cold sales calls and spam, end them politely, and keep them out of my summaries.",
    category: "Calls",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-4",
    title: "Greeting in my own voice",
    detail: "Let me record a short greeting so callers hear me first, then Assisty takes over.",
    category: "Calls",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-5",
    title: "Searchable call history",
    detail: "Search past calls by name, number or what was said, and jump straight to the recording.",
    category: "Summaries",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-6",
    title: "Shared inbox for a front desk",
    detail: "A clinic or office team should see the same call summaries and mark them handled.",
    category: "Summaries",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-7",
    title: "Summaries on WhatsApp too",
    detail: "A short WhatsApp message after each call, in addition to the app push notification.",
    category: "Summaries",
    status: "in-progress",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-8",
    title: "Quiet hours for escalation",
    detail: "Set hours when only my priority contacts can reach me by phone, and everything else waits for the summary.",
    category: "Escalation",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-9",
    title: "Different priority lists by number",
    detail: "Family on my personal line, key clients on my business line, each with their own retry rules.",
    category: "Escalation",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-10",
    title: "More regional languages and dialects",
    detail: "Better handling of mixed speech like Hinglish, and the smaller regional languages my callers use.",
    category: "Languages",
    status: "in-progress",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-11",
    title: "Calendar check before answering",
    detail: "Assisty checks my calendar so it can say when I am free to call back.",
    category: "Integrations",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-12",
    title: "Send new leads to my CRM",
    detail: "Push caller details and the reason for the call into the tools I already use.",
    category: "Integrations",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Stable, shareable slug for a request: readable title + short id suffix. */
export function requestSlug(request: Pick<FeatureRequest, "id" | "title">) {
  return `${slugify(request.title)}-${request.id.replace(/^fr-/, "")}`;
}

export function findRequestBySlug(
  slug: string,
  requests: FeatureRequest[] = seedRequests,
) {
  return requests.find((r) => requestSlug(r) === slug);
}
