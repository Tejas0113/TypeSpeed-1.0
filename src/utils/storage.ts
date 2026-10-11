import { PersonalBest, TestHistoryItem, TestDuration } from '../types';

const STORAGE_KEY_PB = 'typespeed_personal_best';
const STORAGE_KEY_HISTORY = 'typespeed_history';

const DEFAULT_PERSONAL_BEST: PersonalBest = {
  highestWpm: 0,
  bestAccuracy: 0,
  testsCompleted: 0,
  history: [],
};

export function getPersonalBest(): PersonalBest {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PB);
    if (!raw) return DEFAULT_PERSONAL_BEST;
    const parsed = JSON.parse(raw);
    return {
      highestWpm: typeof parsed.highestWpm === 'number' ? parsed.highestWpm : 0,
      bestAccuracy: typeof parsed.bestAccuracy === 'number' ? parsed.bestAccuracy : 0,
      testsCompleted: typeof parsed.testsCompleted === 'number' ? parsed.testsCompleted : 0,
      lastCompletedAt: parsed.lastCompletedAt,
    };
  } catch (e) {
    console.warn('Failed to read personal best from storage', e);
    return DEFAULT_PERSONAL_BEST;
  }
}

export function saveTestResult(
  wpm: number,
  accuracy: number,
  duration: TestDuration
): { isNewHighestWpm: boolean; isNewBestAccuracy: boolean; updatedPB: PersonalBest } {
  const current = getPersonalBest();
  let isNewHighestWpm = false;
  let isNewBestAccuracy = false;

  if (wpm > current.highestWpm && accuracy >= 80) {
    isNewHighestWpm = true;
  }

  if (accuracy > current.bestAccuracy && wpm >= 20) {
    isNewBestAccuracy = true;
  }

  const updatedPB: PersonalBest = {
    highestWpm: Math.max(current.highestWpm, accuracy >= 70 ? wpm : current.highestWpm),
    bestAccuracy: current.testsCompleted === 0 ? accuracy : Math.max(current.bestAccuracy, accuracy),
    testsCompleted: current.testsCompleted + 1,
    lastCompletedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_PB, JSON.stringify(updatedPB));

    // Also append to lightweight history
    const historyItem: TestHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      wpm,
      accuracy,
      duration,
    };

    const existingHistoryRaw = localStorage.getItem(STORAGE_KEY_HISTORY);
    const existingHistory: TestHistoryItem[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
    const newHistory = [historyItem, ...existingHistory].slice(0, 100); // Keep latest 100
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
    updatedPB.history = newHistory;
  } catch (e) {
    console.warn('Failed to save test result to storage', e);
  }

  return {
    isNewHighestWpm,
    isNewBestAccuracy,
    updatedPB,
  };
}

export function getTestHistory(): TestHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearPersonalBest(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PB);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.warn('Failed to clear storage', e);
  }
}
