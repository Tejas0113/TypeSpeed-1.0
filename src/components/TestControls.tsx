import React from 'react';
import { RotateCcw, Volume2, VolumeX, Shuffle, Play } from 'lucide-react';
import { TestDuration, TestState } from '../types';

interface TestControlsProps {
  duration: TestDuration;
  testState: TestState;
  soundEnabled: boolean;
  onDurationChange: (duration: TestDuration) => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onShufflePassage: () => void;
  onManualStart: () => void;
}

export const TestControls: React.FC<TestControlsProps> = ({
  duration,
  testState,
  soundEnabled,
  onDurationChange,
  onRestart,
  onToggleSound,
  onShufflePassage,
  onManualStart,
}) => {
  const isIdle = testState === 'IDLE';

  return (
    <div
      id="test-controls-bar"
      className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80"
    >
      {/* Duration Selector */}
      <div className="flex items-center gap-1.5 bg-neutral-200/60 dark:bg-neutral-800/70 p-1 rounded-xl border border-neutral-300/40 dark:border-neutral-700/40">
        <span className="text-xs font-semibold px-2 text-neutral-500 dark:text-neutral-400 select-none">
          Time:
        </span>
        {([15, 30, 60] as TestDuration[]).map((dur) => {
          const isSelected = duration === dur;
          return (
            <button
              key={dur}
              id={`duration-btn-${dur}`}
              type="button"
              onClick={() => onDurationChange(dur)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              aria-label={`${dur} seconds duration`}
              aria-pressed={isSelected}
            >
              {dur}s
            </button>
          );
        })}
      </div>

      {/* Right controls: Sound, Refresh, Start/Restart */}
      <div className="flex items-center gap-2">
        {/* Sound toggle */}
        <button
          id="sound-toggle-btn"
          type="button"
          onClick={onToggleSound}
          className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
            soundEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          title={soundEnabled ? 'Disable mechanical key sound' : 'Enable mechanical key sound'}
          aria-label="Toggle typing sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
        </button>

        {/* Shuffle passage (only allowed in IDLE to prevent disorientation) */}
        {isIdle && (
          <button
            id="shuffle-passage-btn"
            type="button"
            onClick={onShufflePassage}
            className="p-2 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="Randomize text passage"
            aria-label="Randomize text passage"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden md:inline">New Text</span>
          </button>
        )}

        {/* Primary Action Button */}
        {isIdle ? (
          <button
            id="start-test-btn"
            type="button"
            onClick={onManualStart}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            aria-label="Start Typing Test"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Test</span>
          </button>
        ) : (
          <button
            id="restart-test-btn"
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-all active:scale-95 cursor-pointer border border-neutral-300/60 dark:border-neutral-700/60"
            aria-label="Restart Typing Test"
            title="Quick shortcut: Tab + Enter or Click"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
