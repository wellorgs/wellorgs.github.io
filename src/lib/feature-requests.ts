export type FeatureStatus = "planned" | "exploring" | "in-progress" | "shipped";

export type FeatureRequest = {
  id: string;
  title: string;
  detail: string;
  category: "Care" | "Health" | "AI" | "Family" | "Safety";
  status: FeatureStatus;
  votes: number;
  author: string;
  ago: string;
};

export const statusLabel: Record<FeatureStatus, string> = {
  planned: "Planned",
  exploring: "Exploring",
  "in-progress": "In progress",
  shipped: "Exploring",
};

export const seedRequests: FeatureRequest[] = [
  {
    id: "fr-1",
    title: "Fall detection with automatic SOS",
    detail:
      "If mum falls and can't reach her phone, the app should detect it and start the emergency countdown on its own.",
    category: "Safety",
    status: "in-progress",
    votes: 87,
    author: "James O.",
    ago: "2 days ago",
  },
  {
    id: "fr-2",
    title: "Pill box photo scan to build the schedule",
    detail:
      "Point the camera at the strip or prescription and let the app fill in name, dose and timing automatically.",
    category: "Care",
    status: "planned",
    votes: 74,
    author: "Priya S.",
    ago: "5 days ago",
  },
  {
    id: "fr-3",
    title: "Voice reminders in my parent's own language",
    detail:
      "Spoken reminders in Tamil, Marathi and Bengali. Reading English text is the biggest barrier for my dad.",
    category: "AI",
    status: "in-progress",
    votes: 68,
    author: "Deepa R.",
    ago: "1 week ago",
  },
  {
    id: "fr-4",
    title: "Shared sibling notes on each parent",
    detail:
      "So my brother and I don't repeat the same doctor question twice. A simple shared timeline of notes.",
    category: "Family",
    status: "exploring",
    votes: 59,
    author: "Sofia R.",
    ago: "1 week ago",
  },
  {
    id: "fr-5",
    title: "Blood pressure cuff & glucometer sync",
    detail: "Auto-import readings instead of typing them in every morning.",
    category: "Health",
    status: "planned",
    votes: 52,
    author: "Elena M.",
    ago: "2 weeks ago",
  },
  {
    id: "fr-6",
    title: "One-tap video call with a huge button",
    detail:
      "A single giant tile per family member on the parent home screen. No menus, no contact list.",
    category: "Family",
    status: "shipped",
    votes: 46,
    author: "David L.",
    ago: "2 weeks ago",
  },
  {
    id: "fr-7",
    title: "Weekly wellness summary sent to WhatsApp",
    detail:
      "A short Sunday digest: meds taken, steps, sleep, anything that needs attention.",
    category: "Health",
    status: "exploring",
    votes: 38,
    author: "Amara N.",
    ago: "3 weeks ago",
  },
  {
    id: "fr-8",
    title: "Caregiver / helper access with limited permissions",
    detail:
      "Our day nurse should be able to mark medicines as given without seeing private family messages.",
    category: "Care",
    status: "planned",
    votes: 31,
    author: "Farhan Q.",
    ago: "3 weeks ago",
  },
  {
    id: "fr-9",
    title: "AI companion that just chats when she's lonely",
    detail:
      "Not tasks, conversation. Ask about her day, remember what she said yesterday.",
    category: "AI",
    status: "exploring",
    votes: 24,
    author: "Lakshmi V.",
    ago: "1 month ago",
  },
  {
    id: "fr-10",
    title: "Appointment prep checklist with what to carry",
    detail: "Reports, fasting instructions, insurance card, as a tick list before leaving home.",
    category: "Care",
    status: "shipped",
    votes: 17,
    author: "Thomas W.",
    ago: "1 month ago",
  },
  {
    id: "fr-11",
    title: "Time zone aware alerts for family abroad",
    detail:
      "I am in New Jersey and my parents are in Pune. Alerts should know my local time, stay quiet for routine updates at 3am, and still ring loudly for a real emergency.",
    category: "Family",
    status: "in-progress",
    votes: 71,
    author: "Rohan K.",
    ago: "4 days ago",
  },
  {
    id: "fr-12",
    title: "Pay for a parent plan in USD, AED or GBP",
    detail:
      "I live in Dubai and pay for my mother in Chennai. Let me pay in my own currency and keep the parent side free of any payment screen.",
    category: "Care",
    status: "planned",
    votes: 63,
    author: "Ananya S.",
    ago: "1 week ago",
  },
  {
    id: "fr-13",
    title: "Local care manager visit when we cannot fly down",
    detail:
      "A named person near my parents who can check in, go to a hospital visit and call me after. Flying down for every scare is not possible.",
    category: "Care",
    status: "exploring",
    votes: 57,
    author: "Vikram J.",
    ago: "2 weeks ago",
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
