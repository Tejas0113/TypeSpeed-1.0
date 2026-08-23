import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, CheckCircle2, XCircle, Clock, Zap, Target, Sparkles, TrendingUp } from 'lucide-react';
import { TestStats, PersonalBest } from '../types';
import { getPerformanceRating } from '../utils/typingCalculations';

interface ResultsProps {
  stats: TestStats;
  personalBest: PersonalBest;
  isNewRecord: boolean;
  onTryAgain: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  stats,
  personalBest,
  isNewRecord,
  onTryAgain,
}) => {
  const rating = getPerformanceRating(stats.wpm, stats.accuracy);

  useEffect(() => {
    // Fire celebratory confetti if high accuracy or new record
    try {
      if (isNewRecord || (stats.wpm >= 60 && stats.accuracy >= 90)) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
        });
      }
    } catch {
      // safe fallback
    }
  }, [isNewRecord, stats.wpm, stats.accuracy]);

  return (
    <div
      id="test-results-panel"
      className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-md transition-all animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header with Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              {stats.duration}s Session
            </span>
            {isNewRecord && (
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full animate-bounce">
                <Sparkles className="w-3 h-3 fill-current" />
                New Personal Best!
              </span>
            )}
          </div>
          <h2 id="results-heading" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Test Complete
          </h2>
        </div>

        {/* Performance Assessment Box */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 self-start sm:self-auto">
          <Award className="w-5 h-5 text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">{rating.title}</span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{rating.message}</span>
          </div>
        </div>
      </div>

      {/* Main Big Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {/* WPM */}
        <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span>Speed (WPM)</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
            {stats.wpm}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Raw: {stats.rawWpm} WPM
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <Target className="w-4 h-4" />
            <span>Accuracy</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
            {stats.accuracy}%
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            {stats.accuracy >= 95 ? 'Exceptional' : stats.accuracy >= 90 ? 'Solid' : 'Keep practicing'}
          </span>
        </div>

        {/* Correct Characters */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Correct Chars</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
            {stats.correctChars}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            of {stats.totalChars} total
          </span>
        </div>

        {/* Errors & Incorrect */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Errors</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
            {stats.errors}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {stats.incorrectChars} incorrect left
          </span>
        </div>
      </div>

      {/* Personal Best Snapshot */}
      <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm mb-6">
        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Personal Best:</span>
          <span className="font-bold text-neutral-900 dark:text-white">
            {personalBest.highestWpm} WPM
          </span>
          <span className="text-neutral-400">({personalBest.bestAccuracy}% Acc)</span>
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Tests Completed: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{personalBest.testsCompleted}</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          id="results-try-again-btn"
          type="button"
          onClick={onTryAgain}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
