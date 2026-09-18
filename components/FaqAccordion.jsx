'use client';

import { useState } from 'react';

const FAQS = [
  {
    question: 'Does Veil send my screen content or sensitive data to external servers?',
    answer: 'No. Veil is 100% local-first. All DOM inspection, element selection, TreeWalker scanning, and blur rendering happen strictly inside your local browser instance. We have zero backend analytics, zero AI servers ingesting your screen, and zero telemetry. What happens on your screen stays on your device.'
  },
  {
    question: 'How does Veil protect my screen during live Zoom or Google Meet calls?',
    answer: 'When you share your screen or record with Loom, video conferencing software captures the rendered pixels of your browser window. Because Veil applies CSS blur filters directly to DOM elements before pixels are rendered to the display pipeline, your video stream captures the blurred view. There is no post-production editing required.'
  },
  {
    question: 'Will Veil slow down my browser or cause lag during video calls?',
    answer: 'No. Veil is engineered for high performance. It uses hardware-accelerated CSS filter pipelines, batched MutationObserver processing via requestAnimationFrame, and throttled DOM traversal. Even on complex web apps like Salesforce, Notion, or Stripe with thousands of nodes, CPU overhead is imperceptible (average 0.2ms latency).'
  },
  {
    question: 'What types of sensitive data does Veil automatically recognize?',
    answer: 'Automated PII detection covers standard email addresses, 15-16 digit credit/debit card PANs (Visa, Mastercard, Amex, Discover), international and regional phone numbers, API keys (Stripe, GitHub, AWS, Bearer tokens), financial figures/ARR metrics, IBANs, and street addresses. You can toggle each category independently.'
  },
  {
    question: 'Can I blur custom words, project codenames, or regex patterns?',
    answer: 'Yes! Veil supports custom keyword lists (e.g. client names, internal codenames, partner brands) and custom regular expressions (e.g. /INV-\\d{4}/, /CUS-[A-Z0-9]+/). Any text matching your rules is automatically masked everywhere on the page.'
  },
  {
    question: 'Do my configured blur rules persist when I reload or navigate pages?',
    answer: 'Yes. Veil saves your configured rules per domain and URL path in your browser storage. Our pre-paint anti-flicker stylesheet injects rules at the document_start loading stage, ensuring sensitive elements are veiled before the browser renders them to the screen.'
  },
  {
    question: 'What happens if I need to quickly reveal data to verify something?',
    answer: 'Veil includes a single-click Master Kill Switch (or Alt+Shift+U / Cmd+Shift+V shortcut). Toggling it instantly unblurs all protected elements so you can read what you need. Clicking Restore re-applies all blurs in 0 milliseconds with complete fidelity.'
  },
  {
    question: 'How does the Lifetime License work?',
    answer: 'Unlike competitors that charge $5 to $15 every month, Veil offers a one-time Personal Lifetime License that supports up to 3 browsers with unlimited domains, rules, and updates forever.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="v-faq-container">
      <div className="v-faq-list">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`v-faq-card ${isOpen ? 'active' : ''}`}
            >
              <button
                type="button"
                className="v-faq-trigger"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
              >
                <span className="v-faq-q-text">{faq.question}</span>
                <span className={`v-faq-chevron ${isOpen ? 'open' : ''}`}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="v-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
