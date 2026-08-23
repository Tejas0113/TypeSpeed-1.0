import React from 'react';
import { Keyboard } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="main-footer"
      className="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-950/60 py-10 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-neutral-900 dark:text-white">TypeSpeed</span>
          </div>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Type faster. Type smarter.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <button
            type="button"
            onClick={() => scrollTo('typing-test-section')}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Test
          </button>
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('faq')}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-neutral-400 dark:text-neutral-500">
          © 2026 TypeSpeed. Built for better typing.
        </div>
      </div>
    </footer>
  );
};
