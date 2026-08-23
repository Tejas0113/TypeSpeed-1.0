import React, { useState } from 'react';
import { ChevronDown, Shield, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is WPM and how is it calculated?',
      answer:
        'WPM stands for Words Per Minute. In standardized typing tests, one "word" is standardized as 5 characters (including letters, punctuation, and spaces). The formula used is: WPM = (Correct Characters / 5) / (Elapsed Time in Minutes). This ensures fair comparisons across passages with words of varying lengths.',
    },
    {
      question: 'How is typing accuracy calculated?',
      answer:
        'Typing accuracy measures the percentage of correct characters out of your total typed characters: Accuracy = (Correct Characters / Total Typed Characters) × 100. Backspacing allows you to correct errors, but mistakes still factor into your overall accuracy score.',
    },
    {
      question: 'Do I need to create an account to use TypeSpeed?',
      answer:
        'No account or sign-up is required. You can test your speed immediately. Your personal best scores and recent test metrics are optionally saved locally in your browser storage (localStorage) without any cloud login.',
    },
    {
      question: 'Does TypeSpeed store or transmit what I type?',
      answer:
        'Never. TypeSpeed is 100% client-side. All keystrokes, passage calculations, and timer evaluations happen entirely inside your local browser tab. No keystroke logs, personal data, or text inputs are ever sent to any remote server or third-party service.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-14 sm:py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Everything you need to know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                id={`faq-item-${index}`}
                className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-5 pb-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Privacy Note Callout */}
        <div className="mt-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900 dark:text-neutral-200 font-semibold">Privacy Pledge: </strong>
            Your keystrokes and metrics remain strictly confidential in your browser. We never track, record, or transmit typed data.
          </div>
        </div>
      </div>
    </section>
  );
};
