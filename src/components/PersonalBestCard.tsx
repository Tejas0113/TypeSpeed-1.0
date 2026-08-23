import React from 'react';
import { Award, Target, Zap, RotateCcw } from 'lucide-react';
import { PersonalBest } from '../types';
import { clearPersonalBest } from '../utils/storage';

interface PersonalBestCardProps {
  personalBest: PersonalBest;
  onClearPB?: () => void;
}

export const PersonalBestCard: React.FC<PersonalBestCardProps> = ({ personalBest, onClearPB }) => {
  if (personalBest.highestWpm === 0 && personalBest.testsCompleted === 0) {
    return null;
  }

  const handleReset = () => {
    if (window.confirm('Reset your saved personal best statistics?')) {
      clearPersonalBest();
      if (onClearPB) onClearPB();
    }
  };

  return (
    <div
      id="personal-best-card"
      className="w-full rounded-xl bg-neutral-100/80 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 p-4 transition-all"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Personal Best
          </h3>
        </div>
        <button
          id="clear-pb-btn"
          type="button"
          onClick={handleReset}
          className="text-[11px] text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          title="Reset personal statistics stored locally"
        >
          Reset Stats
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950/70 border border-neutral-200/60 dark:border-neutral-800/60">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-emerald-500 fill-current" /> High WPM
          </span>
          <span className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
            {personalBest.highestWpm}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950/70 border border-neutral-200/60 dark:border-neutral-800/60">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
            <Target className="w-3 h-3 text-blue-500" /> Best Acc
          </span>
          <span className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
            {personalBest.bestAccuracy}%
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950/70 border border-neutral-200/60 dark:border-neutral-800/60">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
            <RotateCcw className="w-3 h-3 text-neutral-400" /> Tests
          </span>
          <span className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
            {personalBest.testsCompleted}
          </span>
        </div>
      </div>
    </div>
  );
};
