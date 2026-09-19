import { HelpCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "Why is it called myFamily365?",
    answer:
      "Because worry doesn't take days off. myFamily365 is built to keep you sure about your parents all 365 days. An SOS that keeps calling until someone answers on the worst night, and one calm line every other morning telling you they are okay.",
  },
  {
    question: "When will myFamily365 launch?",
    answer:
      "We are opening early access in batches to the first 100 families on the waitlist. Joining now locks in your founding price and puts you at the front of the line.",
  },
  {
    question: "Is the free plan really free forever?",
    answer:
      "Yes. The Free plan covers one parent and one family contact, with medicine reminders, the daily “they’re okay” ping and a one-contact SOS. No expiry, no hidden charges.",
  },
  {
    question: "What does “founding member pricing” mean?",
    answer:
      "Founding members who join the waitlist keep Premium at ₹199/month for life instead of ₹299/month. The discount stays as long as your account is active, and Global Care members lock their rate the same way.",
  },
  {
    question: "I live in a different country from my parents. What do I get?",
    answer:
      "The Global Care plan (about $18 / ₹1,499 a month) is built exactly for that, whether your parent is in India, the Philippines, Nigeria, Poland or the next country over. In an emergency, you reach out to your dedicated care manager and they call your parent, then the listed neighbour or caregiver, then the local ambulance or police if needed. Alerts arrive in your timezone, the app works in 20+ languages, and if you need something custom, such as several parents or siblings in different countries, tell us on the waitlist form.",
  },
  {
    question: "Does this only work for Indian parents?",
    answer:
      "No. myFamily365 works anywhere your parent has a phone and a data connection. India is where we started and where our pricing is set in rupees, but the medicine reminders, fall detection, daily ping and SOS chain run the same way for a parent in Manila, Lagos, Warsaw, Lisbon or Nairobi. You pay in your own currency and see prices converted for your country.",
  },
  {
    question: "Where are the people who actually respond?",
    answer:
      "On Free and Premium, the first responders are the people closest to your parent: the family circle, then the neighbour or caregiver your parent lists in the app. On Global Care, you reach out to a dedicated care manager in your parent's country and timezone. They call your parent, then the neighbour or caregiver, then the local ambulance or police if nobody answers. Our support team covers the rest of the clock, so there is a person awake whenever the alert goes out.",
  },
  {
    question: "What if you do not have a care manager in my parent's city yet?",
    answer:
      "We tell you before you pay. During onboarding we ask where your parent lives, and if we do not have a care manager in that area yet, we say so and set up the escalation around the neighbour or caregiver you nominate instead, at a reduced rate. We are adding new cities as families join, and waitlist signups decide the order.",
  },
  {
    question: "Which languages does the app support?",
    answer:
      "More than 20 languages and dialects. Your parent sees the app, reminders and voice prompts in the language they are comfortable with, while you use it in yours on your own phone. The AI companion talks and listens in the same set of languages, so your parent can speak naturally instead of tapping through menus.",
  },
  {
    question: "How does escalation work across timezones?",
    answer:
      "Every alert is timestamped in both places. The chain starts immediately in your parent's timezone and does not wait for your morning. You still get the call and the notification wherever you are, but if you are asleep the chain simply moves on to the next person rather than stalling. Daily pings are the opposite: you choose the hour you want them in your own timezone.",
  },
  {
    question: "Does the SOS work when my parent travels or moves country?",
    answer:
      "Yes. Location, emergency numbers and the local escalation contacts update to wherever the phone is. If your parent visits you abroad for three months, the app follows them, and calls the emergency service of the country they are actually in.",
  },
  {
    question: "Can I pay from abroad and have my parent use it at home?",
    answer:
      "That is the normal setup. You pay in USD, AED, GBP, EUR, CAD, AUD or SGD from your own card, and your parent uses the app for free on their phone with nothing to set up on their side beyond the invite. Billing, receipts and support all come to you.",
  },

  {
    question: "What actually happens when the SOS is pressed?",
    answer:
      "On Free and Premium, the alert goes to your family circle with live location and emergency audio recording. On Global Care, you reach out to your dedicated care manager and they call your parent, then the listed neighbour or caregiver, then the ambulance or police in your parent's area if nobody answers. You see who answered, not just who was notified.",
  },
  {
    question: "Will my parent's data stay private?",
    answer:
      "Absolutely. Health, reports and location data are encrypted, shared only inside your invited family circle, and never sold. You control who sees what.",
  },
  {
    question: "Can I suggest a feature?",
    answer:
      "Yes, our roadmap is public. Post ideas, upvote what others need, and track features as they move from Exploring to Shipped on the live feature board.",
  },
];


export function FaqSection() {
  return (
    <section id="faq" className="cv-auto scroll-mt-24 mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-5">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft">
          <HelpCircle className="size-4 text-primary" strokeWidth={2} />
          Questions & answers
        </span>
        <h2 className="mt-5 text-[28px] font-bold leading-tight sm:text-[40px]">
          Still thinking it over?
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Everything you need to know before joining the waitlist.
        </p>
      </div>

      <div className="mt-10 rounded-4xl bg-card p-2 shadow-soft">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border px-4 last:border-b-0 sm:px-6"
            >
              <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

    </section>
  );
}
