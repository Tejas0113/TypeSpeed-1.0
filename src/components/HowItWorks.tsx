import React from 'react';
import { Timer, Keyboard, BarChart3 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose your time',
      description: 'Select your preferred test duration: 15s for quick sprints, 30s for standard tests, or 60s for stamina checks.',
      icon: Timer,
    },
    {
      number: '02',
      title: 'Type the passage',
      description: 'Click anywhere and begin typing. The accurate precision timer starts automatically on your first keystroke.',
      icon: Keyboard,
    },
    {
      number: '03',
      title: 'See your results',
      description: 'Review your verified WPM, accuracy percentage, error breakdown, and save your personal best locally.',
      icon: BarChart3,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2">
            A frictionless typing test designed for developers, writers, and keyboard enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`how-it-works-step-${step.number}`}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-500">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
