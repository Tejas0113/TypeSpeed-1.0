import React, { useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TypingTest } from './components/TypingTest';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export default function App() {
  const scrollToTest = useCallback(() => {
    const testEl = document.getElementById('typing-test-section');
    if (testEl) {
      testEl.scrollIntoView({ behavior: 'smooth' });
    }
    // Also focus hidden input for immediate typing
    setTimeout(() => {
      const inputEl = document.getElementById('typing-hidden-input') as HTMLTextAreaElement | null;
      inputEl?.focus();
    }, 300);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-300">
      {/* Navigation Header */}
      <Header onScrollToTest={scrollToTest} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Minimal Hero Section */}
        <Hero onStartClick={scrollToTest} />

        {/* Core Typing Test Section */}
        <TypingTest />

        {/* Educational / Value Sections */}
        <HowItWorks />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
