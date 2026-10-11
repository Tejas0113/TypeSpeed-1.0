import { useState, useEffect, useRef, useCallback } from 'react';
import { TestDuration, TestState, TestStats, Passage } from '../types';
import { getRandomPassage } from '../data/passages';
import { calculateWPM, calculateRawWPM, calculateAccuracy } from '../utils/typingCalculations';
import { saveTestResult, getPersonalBest } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';

export function useTypingTest(initialDuration: TestDuration = 30) {
  const { user } = useAuth();
  const [duration, setDuration] = useState<TestDuration>(initialDuration);
  const [testState, setTestState] = useState<TestState>('IDLE');
  const [passage, setPassage] = useState<Passage>(() => getRandomPassage());
  const [userInput, setUserInput] = useState<string>('');
  
  // High-accuracy time tracking
  const [timeRemaining, setTimeRemaining] = useState<number>(initialDuration);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // Keystroke metrics
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [personalBest, setPersonalBest] = useState(() => getPersonalBest());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const testStateRef = useRef<TestState>(testState);
  testStateRef.current = testState;

  // Sync cloud personal best whenever user changes or logs in
  useEffect(() => {
    if (user) {
      dbService.getUserPersonalBest(user.id).then((cloudPB) => {
        if (cloudPB && cloudPB.testsCompleted > 0) {
          setPersonalBest((localPB) => ({
            highestWpm: Math.max(localPB.highestWpm, cloudPB.highestWpm),
            bestAccuracy: Math.max(localPB.bestAccuracy, cloudPB.bestAccuracy),
            testsCompleted: Math.max(localPB.testsCompleted, cloudPB.testsCompleted),
            lastCompletedAt: cloudPB.lastCompletedAt || localPB.lastCompletedAt,
            history: cloudPB.history && cloudPB.history.length > 0 ? cloudPB.history : localPB.history,
          }));
        }
      });
    }
  }, [user]);

  // Sound sync
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Compute live character breakdown
  const passageText = passage.text;
  let correctChars = 0;
  let incorrectChars = 0;

  for (let i = 0; i < userInput.length; i++) {
    if (i < passageText.length) {
      if (userInput[i] === passageText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    } else {
      incorrectChars++;
    }
  }

  // Calculate live numbers
  const liveWpm = calculateWPM(correctChars, Math.max(timeElapsed, 0.5));
  const liveRawWpm = calculateRawWPM(userInput.length, Math.max(timeElapsed, 0.5));
  const liveAccuracy = calculateAccuracy(correctChars, userInput.length);

  const liveStats: TestStats = {
    wpm: testState === 'IDLE' ? 0 : liveWpm,
    rawWpm: testState === 'IDLE' ? 0 : liveRawWpm,
    accuracy: testState === 'IDLE' ? 100 : liveAccuracy,
    correctChars,
    incorrectChars,
    totalChars: userInput.length,
    errors: errorCount,
    timeElapsed: Math.round(timeElapsed),
    timeRemaining: Math.ceil(timeRemaining),
    duration,
  };

  // Complete the test
  const completeTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setTestState('COMPLETED');
    const finalElapsed = duration;
    const finalWpm = calculateWPM(correctChars, finalElapsed);
    const finalAccuracy = calculateAccuracy(correctChars, userInput.length);
    const finalRawWpm = calculateRawWPM(userInput.length, finalElapsed);
    
    // Save to local storage
    const result = saveTestResult(finalWpm, finalAccuracy, duration);
    setPersonalBest(result.updatedPB);
    setIsNewRecord(result.isNewHighestWpm);
    setIsCloudSynced(false);

    // If user is authenticated with Supabase, save to cloud database
    if (user) {
      dbService
        .saveTestResult(user.id, {
          wpm: finalWpm,
          rawWpm: finalRawWpm,
          accuracy: finalAccuracy,
          correctChars,
          incorrectChars,
          totalChars: userInput.length,
          errors: errorCount,
          timeElapsed: Math.round(duration),
          timeRemaining: 0,
          duration,
        })
        .then((saved) => {
          if (saved) {
            setIsCloudSynced(true);
            // Refresh personal best from cloud
            dbService.getUserPersonalBest(user.id).then((cloudPB) => {
              if (cloudPB) {
                setPersonalBest((prev) => ({
                  ...prev,
                  highestWpm: Math.max(prev.highestWpm, cloudPB.highestWpm),
                  bestAccuracy: Math.max(prev.bestAccuracy, cloudPB.bestAccuracy),
                  testsCompleted: cloudPB.testsCompleted,
                  lastCompletedAt: cloudPB.lastCompletedAt || prev.lastCompletedAt,
                }));
              }
            });
          }
        })
        .catch((err) => {
          console.warn('Failed to save to Supabase:', err);
        });
    }
    
    if (soundEnabled) {
      soundManager.playCompleteSound();
    }
  }, [correctChars, duration, errorCount, incorrectChars, soundEnabled, user, userInput.length]);

  // Reset test cleanly
  const resetTest = useCallback((newDuration?: TestDuration, newPassage?: Passage) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    startTimeRef.current = null;
    const nextDuration = newDuration ?? duration;
    if (newDuration) {
      setDuration(newDuration);
    }
    
    setTestState('IDLE');
    setUserInput('');
    setTimeRemaining(nextDuration);
    setTimeElapsed(0);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setIsNewRecord(false);
    setIsCloudSynced(false);
    
    if (newPassage) {
      setPassage(newPassage);
    } else {
      setPassage(getRandomPassage(passage.id));
    }

    // Auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [duration, passage.id]);

  // Start test on first key or manual start
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) return;
    
    startTimeRef.current = performance.now();
    setTestState('RUNNING');

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);

      setTimeElapsed(elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        completeTest();
      }
    }, 50); // 50ms interval for super fluid smooth clock updates
  }, [completeTest, duration]);

  // Handle typing input
  const handleInputChange = useCallback((newText: string) => {
    if (testStateRef.current === 'COMPLETED') return;

    if (testStateRef.current === 'IDLE') {
      if (newText.length > 0) {
        startTimer();
      }
    }

    const previousLength = userInput.length;
    setUserInput(newText);

    // Track new keypresses and errors
    if (newText.length > previousLength) {
      setTotalKeystrokes((prev) => prev + (newText.length - previousLength));
      const addedCharIndex = newText.length - 1;
      const isCharCorrect = addedCharIndex < passageText.length && newText[addedCharIndex] === passageText[addedCharIndex];
      
      if (!isCharCorrect) {
        setErrorCount((prev) => prev + 1);
      }

      if (soundEnabled) {
        soundManager.playKeyClick(isCharCorrect);
      }

      // If user typed the entire passage, seamlessly append more text so fast typists are never blocked
      if (newText.length >= passageText.length) {
        const extra = getRandomPassage(passage.id);
        setPassage((prev) => ({
          ...prev,
          text: prev.text + ' ' + extra.text,
        }));
      }
    }
  }, [passage.id, passageText, soundEnabled, startTimer, userInput.length]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Update duration selector handler
  const handleDurationChange = (newDur: TestDuration) => {
    if (newDur === duration) return;
    resetTest(newDur);
  };

  return {
    duration,
    testState,
    passage,
    userInput,
    timeRemaining,
    timeElapsed,
    stats: liveStats,
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
  };
}
