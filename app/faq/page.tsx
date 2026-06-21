"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const faqs = [
  { question: 'How does mini‑tuition work?', answer: 'Students create a request, tutors receive it in real‑time, and can accept or decline. Once accepted, a tutoring session is scheduled through the platform.' },
  { question: 'What video size is allowed for tutor intro videos?', answer: 'Up to 50 MB (approximately 2 minutes). Larger files will be rejected.' },
  { question: 'Is there a payment gateway?', answer: 'Payment integration is planned for a later release. Currently, sessions are free.' },
  { question: 'How can I contact support?', answer: 'Email us at support@mini‑tuition.com or use the live chat in the dashboard.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="mb-8 text-4xl font-bold text-primary-600 text-center">Frequently Asked Questions</h1>
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <button
              onClick={() => toggle(i)}
              className="flex w-full justify-between text-left font-medium text-primary-600"
            >
              {faq.question}
              <span>{openIndex === i ? '-' : '+'}</span>
            </button>
            {openIndex === i && (
              <p className="mt-2 text-foreground">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
