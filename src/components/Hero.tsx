import React from 'react';
import { ArrowDown, Zap, ShieldCheck, Sparkles, Command } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section id="hero-section" className="pt-10 pb-8 sm:pt-14 sm:pb-12 text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Subtle Pill Tagline */}
        <div
          id="hero-tagline-badge"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-neutral-200/70 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-300/60 dark:border-neutral-700/60 mb-5 transition-transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Type faster. Type smarter.</span>
        </div>

        {/* Main Heading */}
        <h1
          id="hero-main-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15] mb-4"
        >
          How fast can you <span className="underline decoration-emerald-500 decoration-wavy decoration-2 underline-offset-8">type?</span>
        </h1>

        {/* Supporting Text */}
        <p
          id="hero-supporting-text"
          className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mb-7 font-normal leading-relaxed"
        >
          Test your typing speed, accuracy, and consistency in seconds with standard real-time WPM metrics.
        </p>

        {/* CTA & Privacy notice */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
          <button
            id="hero-start-cta-btn"
            type="button"
            onClick={onStartClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Start Typing</span>
            <ArrowDown className="w-4 h-4 ml-0.5 animate-bounce" />
          </button>
        </div>

        {/* Micro Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            No sign-up required
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-neutral-400" />
            100% Client-side privacy
          </span>
        </div>
      </div>
    </section>
  );
};
