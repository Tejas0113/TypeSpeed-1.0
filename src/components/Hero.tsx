import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Sparkles, Command, UserPlus, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onStartClick: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onOpenAuth }) => {
  const { user } = useAuth();

  return (
    <section id="hero-section" className="pt-12 pb-12 sm:pt-18 sm:pb-16 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Subtle Pill Tagline */}
        <div
          id="hero-tagline-badge"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-6 transition-transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time WPM • Global Leaderboards • Cloud Sync</span>
        </div>

        {/* Main Heading */}
        <h1
          id="hero-main-heading"
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-5"
        >
          Master your keystrokes.{' '}
          <span className="block mt-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
            Accelerate your typing.
          </span>
        </h1>

        {/* Supporting Text */}
        <p
          id="hero-supporting-text"
          className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8 font-normal leading-relaxed"
        >
          Test your typing velocity and precision with instant real-time metrics, track every test in your personal cloud history, and compete against the fastest typists worldwide.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8 w-full max-w-md">
          <button
            id="hero-start-cta-btn"
            type="button"
            onClick={onStartClick}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-lg shadow-emerald-600/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Enter Typing Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!user && onOpenAuth && (
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-500" />
              <span>Create Free Account</span>
            </button>
          )}
        </div>

        {/* Micro Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            No installation required
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Live Cloud Leaderboards
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-purple-500" />
            15s, 30s & 60s Sprint Modes
          </span>
        </div>
      </div>
    </section>
  );
};
