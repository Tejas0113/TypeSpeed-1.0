import React from 'react';
import { Keyboard, Zap, Award } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { PersonalBest } from '../types';

interface HeaderProps {
  personalBest?: PersonalBest;
  onScrollToTest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ personalBest, onScrollToTest }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-50/90 dark:bg-neutral-950/90 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          id="header-brand-link"
          href="#typing-test-section"
          onClick={(e) => {
            if (onScrollToTest) {
              e.preventDefault();
              onScrollToTest();
            }
          }}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1 py-0.5"
        >
          <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Keyboard className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
              TypeSpeed
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-6" aria-label="Main Navigation">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <a
              id="nav-link-test"
              href="#typing-test-section"
              onClick={(e) => scrollToSection(e, 'typing-test-section')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Test
            </a>
            <a
              id="nav-link-how-it-works"
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              id="nav-link-faq"
              href="#faq"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Quick PB Badge (if available) */}
          {personalBest && personalBest.highestWpm > 0 && (
            <div
              id="header-pb-badge"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
              title={`Personal Best: ${personalBest.highestWpm} WPM (${personalBest.bestAccuracy}% Acc)`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>PB: {personalBest.highestWpm} WPM</span>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <ThemeToggle id="header-theme-toggle" />
          </div>
        </nav>
      </div>
    </header>
  );
};
