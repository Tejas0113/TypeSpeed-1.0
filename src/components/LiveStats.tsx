import React from 'react';
import { Clock, Activity, Target, AlertCircle } from 'lucide-react';
import { TestStats, TestState } from '../types';

interface LiveStatsProps {
  stats: TestStats;
  testState: TestState;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ stats, testState }) => {
  const isRunning = testState === 'RUNNING';

  return (
    <div
      id="live-stats-bar"
      className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 transition-all"
    >
      {/* Time Remaining */}
      <div id="stat-time" className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-50/80 dark:bg-neutral-950/60 border border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Time</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${
            isRunning && stats.timeRemaining <= 5
              ? 'text-rose-600 dark:text-rose-400 animate-pulse'
              : 'text-neutral-900 dark:text-white'
          }`}>
            {testState === 'IDLE' ? `${stats.duration}` : stats.timeRemaining}
          </span>
          <span className="text-xs font-semibold text-neutral-400">s</span>
        </div>
      </div>

      {/* WPM */}
      <div id="stat-wpm" className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-50/80 dark:bg-neutral-950/60 border border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>WPM</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums tracking-tight">
            {stats.wpm}
          </span>
        </div>
      </div>

      {/* Accuracy */}
      <div id="stat-accuracy" className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-50/80 dark:bg-neutral-950/60 border border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <Target className="w-3.5 h-3.5 text-blue-500" />
          <span>Accuracy</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums tracking-tight">
            {stats.accuracy}
          </span>
          <span className="text-xs font-semibold text-neutral-400">%</span>
        </div>
      </div>

      {/* Errors / Keystrokes (Hidden on very small screens, visible on sm+) */}
      <div id="stat-errors" className="hidden sm:flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-50/80 dark:bg-neutral-950/60 border border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Errors</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${stats.errors > 0 ? 'text-rose-500' : 'text-neutral-900 dark:text-white'}`}>
            {stats.errors}
          </span>
          <span className="text-xs text-neutral-400">({stats.totalChars} chars)</span>
        </div>
      </div>
    </div>
  );
};
