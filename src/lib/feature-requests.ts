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
  {
    id: "fr-13",
    title: "Take orders and bookings by phone",
    detail: "Assisty collects the details for an order or booking and sends me a ready-to-confirm summary.",
    category: "Calls",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-14",
    title: "Different greeting for each number",
    detail: "A different opening line for my clinic line, my personal line and my business line.",
    category: "Calls",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-15",
    title: "Warm handover with call context",
    detail: "When I take over a live call, Assisty first tells me who it is and why they called.",
    category: "Calls",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-16",
    title: "Daily digest of missed calls",
    detail: "One short message each evening with every call I missed, sorted by what needs a reply.",
    category: "Summaries",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-17",
    title: "Follow-up reminders from calls",
    detail: "If a caller asks for a callback, Assisty adds a reminder for me with the details.",
    category: "Summaries",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-18",
    title: "Tag and sort calls by topic",
    detail: "Calls labelled as billing, appointment, sales or support, so I can filter my call list.",
    category: "Summaries",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-19",
    title: "Always reach me for certain words",
    detail: "Tell Assisty names and keywords that should always get through to me straight away.",
    category: "Escalation",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-20",
    title: "Repeat-caller alert",
    detail: "If the same number calls several times in a row, treat it as more urgent.",
    category: "Escalation",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-21",
    title: "Backup contact in an emergency",
    detail: "If I can't be reached in an emergency, Assisty tries a second person I choose.",
    category: "Escalation",
    status: "planned",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-22",
    title: "Choose my summary language",
    detail: "Get every summary in my own language, whatever language the caller spoke.",
    category: "Languages",
    status: "in-progress",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-23",
    title: "Better with Indian names and places",
    detail: "Handle names, addresses and landmarks spoken aloud in different accents more accurately.",
    category: "Languages",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-24",
    title: "Summaries to email or Slack",
    detail: "Send each call summary to my email or a Slack channel as well as the app.",
    category: "Integrations",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-25",
    title: "WhatsApp confirmation to the caller",
    detail: "After a call, send the caller a short confirmation message on WhatsApp.",
    category: "Integrations",
    status: "exploring",
    votes: 0,
    author: "Assisty team",
    ago: "Roadmap idea",
  },
  {
    id: "fr-26",
    title: "Zapier and webhooks",
    detail: "Trigger my own automations from every call, without writing code.",
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
