import React, { useRef, useEffect } from 'react';
import { Passage, TestState } from '../types';

interface TypingPassageProps {
  passage: Passage;
  userInput: string;
  testState: TestState;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TypingPassage: React.FC<TypingPassageProps> = ({
  passage,
  userInput,
  testState,
  inputRef,
  onInputChange,
  onKeyDown,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const text = passage.text;

  // Keep active character visible if text wraps or scrolls
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const charEl = activeCharRef.current;
      const containerEl = containerRef.current;
      
      const charTop = charEl.offsetTop;
      const charHeight = charEl.offsetHeight;
      const containerScroll = containerEl.scrollTop;
      const containerHeight = containerEl.clientHeight;

      if (charTop + charHeight > containerScroll + containerHeight - 40) {
        containerEl.scrollTop = charTop - 60;
      } else if (charTop < containerScroll + 20) {
        containerEl.scrollTop = Math.max(0, charTop - 40);
      }
    }
  }, [userInput]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      id="typing-passage-container"
      onClick={handleContainerClick}
      className="relative w-full rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800/90 p-5 sm:p-7 md:p-8 shadow-xs cursor-text transition-all focus-within:ring-2 focus-within:ring-emerald-500/40 select-none overflow-hidden"
    >
      {/* Passage metadata header */}
      <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800/60 select-none">
        <span className="font-semibold tracking-wide uppercase text-[11px] text-neutral-500 dark:text-neutral-400">
          {passage.category} • {passage.title}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500 hidden sm:inline">
          {testState === 'IDLE' ? 'Click anywhere or start typing to begin' : 'Type the passage below'}
        </span>
      </div>

      {/* Hidden high-fidelity accessible textarea for real input capture */}
      <textarea
        ref={inputRef}
        id="typing-hidden-input"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Typing test text input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        disabled={testState === 'COMPLETED'}
        className="absolute opacity-0 pointer-events-auto inset-0 w-full h-full resize-none z-10 cursor-text -left-[9999px]"
        tabIndex={0}
      />

      {/* Rendered Passage with exact character states */}
      <div
        ref={containerRef}
        id="passage-characters-display"
        className="font-mono-typing text-xl sm:text-2xl md:text-[26px] leading-[1.8] sm:leading-[1.9] tracking-normal text-neutral-400 dark:text-neutral-500 min-h-[140px] max-h-[260px] overflow-y-auto pr-2 relative transition-all"
        aria-live="polite"
      >
        {text.split('').map((char, index) => {
          const isTyped = index < userInput.length;
          const isCurrent = index === userInput.length;
          const isCorrect = isTyped && userInput[index] === char;
          const isIncorrect = isTyped && userInput[index] !== char;

          let charClass = 'transition-colors duration-75 relative ';

          if (isCorrect) {
            charClass += 'text-neutral-900 dark:text-neutral-100 font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xs ';
          } else if (isIncorrect) {
            charClass += 'text-rose-600 dark:text-rose-400 bg-rose-500/20 dark:bg-rose-500/30 rounded-xs underline decoration-rose-500 decoration-2 ';
          } else if (isCurrent) {
            charClass += 'text-neutral-800 dark:text-neutral-200 font-bold bg-neutral-200/80 dark:bg-neutral-800 rounded-xs ';
          } else {
            charClass += 'text-neutral-400 dark:text-neutral-500 ';
          }

          return (
            <span
              key={index}
              ref={isCurrent ? activeCharRef : null}
              className={charClass}
              data-char-index={index}
              data-status={isCorrect ? 'correct' : isIncorrect ? 'incorrect' : isCurrent ? 'current' : 'untyped'}
            >
              {/* Caret line indicator on current character */}
              {isCurrent && (
                <span
                  className="absolute -left-[1.5px] top-1 bottom-1 w-[2.5px] bg-emerald-500 dark:bg-emerald-400 rounded-full animate-cursor-blink pointer-events-none"
                  aria-hidden="true"
                />
              )}
              {/* For space characters that are incorrect, show a visible space indicator */}
              {char === ' ' ? (
                isIncorrect ? (
                  <span className="text-rose-500 font-bold opacity-80 underline">_</span>
                ) : (
                  ' '
                )
              ) : (
                char
              )}
            </span>
          );
        })}
      </div>

      {/* Subtle overlay hint if in IDLE state */}
      {testState === 'IDLE' && userInput.length === 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready. Start typing to begin test immediately.</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-[10px]">
              Tab + Enter
            </kbd>
            <span>to restart</span>
          </div>
        </div>
      )}
    </div>
  );
};
