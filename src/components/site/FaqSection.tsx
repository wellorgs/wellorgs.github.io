import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";

import { LANGUAGE_COUNT } from "@/siteFacts";

export const faqs = [
  {
    question: "What is Assisty?",
    answer:
      "Assisty AI picks up when you cannot, talks to the caller like a real person, and sends you a calm summary as an app push notification the moment the call ends.",
  },
  {
    question: "How does it answer my calls?",
    answer:
      "It greets the caller naturally, asks who they are and why they are calling, and handles the conversation like a person would, not a robotic menu.",
  },
  {
    question: "Do I need a new number?",
    // FAQ PENDING - confirm iOS vs Android forwarding steps with the product team before shipping
    answer:
      "No, you keep your existing number, so you don't need to give it out again. Behind the scenes, you get a dedicated Assisty number: turn on conditional call forwarding (for when you're busy or don't answer) to that number, and Assisty takes it from there. Setup steps vary slightly by phone and carrier, and the app walks you through it.",
  },
  {
    question: "What does the caller hear?",
    answer:
      "No menus to press through, just a real conversation, in whatever language they are comfortable in.",
  },
  {
    question: "Which languages are supported?",
    answer: `${LANGUAGE_COUNT} languages, including regional. Assisty AI detects the caller's language mid-call and replies in it, without being asked.`,
  },
  {
    question: "Are calls recorded?",
    answer:
      "Yes. Call recording is attached to every summary so you can hear it yourself. Escalation call recordings are kept for the incident record, removable on request.",
  },
  {
    question: "Where are summaries and recordings stored?",
    answer:
      "Call recordings, summaries and contact details are sent over encrypted connections and stored encrypted at rest.",
  },
  {
    question: "Can I listen to the actual call?",
    answer: "Yes. The call recording is attached, so you can hear the actual tone in seconds.",
  },
  {
    question: "Does Assisty call the person back after the call ends?",
    answer: "No. Assisty only handles the call live, in the moment. It doesn't call the original caller back afterward.",
  },
  {
    question: "How does escalation work?",
    answer:
      "Assisty is built to recognize genuine urgency, such as medical emergencies, fire, safety issues, and other time-critical situations, using a broad set of real-world emergency language and scenarios. When it detects a genuine one, it calls you directly. If something just sounds urgent but isn't, Assisty handles it normally instead of interrupting you.",
  },
  {
    question: "Can I choose priority contacts?",
    answer:
      "Yes. Mark someone as a priority contact and Assisty will call you twice if you don't answer. If that still doesn't reach you, it's flagged as an SOS-level alert.",
  },
  {
    question: "Can I turn Assisty off?",
    answer:
      "Add or remove numbers, priority contacts and team members whenever you want, and turn features on or off per number.",
  },
  {
    question: "How is my data protected?",
    answer:
      "Encrypted in transit and at rest, visible only to the people you invite, and never sold, rented or used for ad targeting. Export your data or delete the account whenever you want.",
  },
];

/** Homepage shows only these; the rest live on /faq. */
const TOP = ["What is Assisty?", "Do I need a new number?", "Are calls recorded?", "How does escalation work?"];
export const topFaqs = faqs.filter((f) => TOP.includes(f.question));

export function FaqSection({ all = false }: { all?: boolean }) {
  const list = all ? faqs : topFaqs;
  return (
    <section id="faq" className="cv-auto scroll-mt-24 mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-5">
      <div className="text-center">
        <h2 className="text-[28px] font-bold leading-tight sm:text-[40px]">
          Still thinking it over?{" "}
          <span className="text-muted-foreground">Everything you need to know before requesting early access.</span>
        </h2>
      </div>

      <div className="mt-10 rounded-xl bg-card p-2">
        <Accordion type="single" collapsible className="w-full">
          {list.map((faq, index) => (
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
      {!all && (
        <Link to="/faq" className="mt-5 inline-block text-[15px] font-medium text-primary hover:underline">
          See all FAQs ›
        </Link>
      )}
    </section>
  );
}
