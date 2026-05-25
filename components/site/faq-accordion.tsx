"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How do I book a date?",
    answer:
      "Send an inquiry through the contact page with your wedding date and venue. I'll follow up within 48 hours to schedule a call. Once we're aligned, a signed contract and 25% retainer secures your date.",
  },
  {
    question: "What is the deposit, and is it refundable?",
    answer:
      "A 25% retainer is due at booking and is non-refundable — it removes your date from availability. The remaining balance is due 30 days before the wedding.",
  },
  {
    question: "How long until we receive our photos?",
    answer:
      "Full galleries are delivered within 8–10 weeks of your wedding day. Sneak peeks (20–30 images) are shared within 1 week.",
  },
  {
    question: "Do you travel, and are there travel fees?",
    answer:
      "Yes — I photograph weddings worldwide. Travel within the New York metro area is included. For destinations beyond that, travel costs (flights, accommodation) are billed at cost.",
  },
  {
    question: "Do you provide RAW files?",
    answer:
      "No. RAW files are unfinished negatives — the edited, color-graded images are the final product. Every delivered image has been individually processed and is ready to print.",
  },
  {
    question: "Do we have print rights?",
    answer:
      "Yes. You receive full personal print rights with your gallery, meaning you can print and share your images freely. Commercial use requires written permission.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left gap-4"
          >
            <span className="font-sans text-sm font-normal">{faq.question}</span>
            <ChevronDown
              className={`shrink-0 size-4 text-muted-foreground transition-transform duration-300 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="pb-5">
              <p className="font-sans text-sm font-light leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
