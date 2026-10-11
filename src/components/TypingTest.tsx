import React, { useEffect, useCallback } from 'react';
import { useTypingTest } from '../hooks/useTypingTest';
import { TestControls } from './TestControls';
import { LiveStats } from './LiveStats';
import { TypingPassage } from './TypingPassage';
import { Results } from './Results';
import { PersonalBestCard } from './PersonalBestCard';

interface TypingTestProps {
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onViewHistory?: () => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({ onOpenAuth, onViewHistory }) => {
  const {
    duration,
    testState,
    passage,
    userInput,
    stats,
    personalBest,
    isNewRecord,
    isCloudSynced,
    soundEnabled,
    setSoundEnabled,
    inputRef,
    handleInputChange,
    resetTest,
    handleDurationChange,
    startTimer,
  } = useTypingTest(30);

  // Global keydown listener for quick restart (Escape)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
        return;
      }
    },
    [resetTest]
  );

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <section id="typing-test-section" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 scroll-mt-20">
      <div className="flex flex-col gap-5">
        {/* Test Controls */}
        <TestControls
          duration={duration}
          testState={testState}
          soundEnabled={soundEnabled}
          onDurationChange={handleDurationChange}
          onRestart={() => resetTest()}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onShufflePassage={() => resetTest()}
          onManualStart={() => {
            inputRef.current?.focus();
            startTimer();
          }}
        />

        {/* Live Statistics */}
        <LiveStats stats={stats} testState={testState} />

        {/* Typing Passage Area OR Results Screen */}
        {testState === 'COMPLETED' ? (
          <Results
            stats={stats}
            personalBest={personalBest}
            isNewRecord={isNewRecord}
            isCloudSynced={isCloudSynced}
            onTryAgain={() => resetTest()}
            onContinueNextTest={() => resetTest()}
            onRetrySamePassage={() => resetTest(undefined, passage)}
            onViewHistory={onViewHistory}
            onOpenAuth={onOpenAuth}
          />
        ) : (
          <TypingPassage
            passage={passage}
            userInput={userInput}
            testState={testState}
            inputRef={inputRef}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        )}

        {/* Personal Best Info (Optional display below test) */}
        {testState !== 'COMPLETED' && (
          <div className="mt-2">
            <PersonalBestCard personalBest={personalBest} onClearPB={() => resetTest()} />
          </div>
        )}
      </div>
    </section>
  );
};
