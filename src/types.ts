export type TestDuration = 15 | 30 | 60;

export type TestState = 'IDLE' | 'RUNNING' | 'COMPLETED';

export type CharStatus = 'untyped' | 'correct' | 'incorrect' | 'current';

export interface Passage {
  id: string;
  text: string;
  title: string;
  category: 'Technology' | 'Science' | 'Productivity' | 'Philosophy' | 'Literature' | 'Everyday';
}

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  errors: number;
  timeElapsed: number;
  timeRemaining: number;
  duration: TestDuration;
}

export interface PersonalBest {
  highestWpm: number;
  bestAccuracy: number;
  testsCompleted: number;
  lastCompletedAt?: string;
  history?: TestHistoryItem[];
}

export interface TestHistoryItem {
  id: string;
  timestamp: number;
  wpm: number;
  accuracy: number;
  duration: TestDuration;
}

export interface PerformanceFeedback {
  title: string;
  message: string;
  badge: string;
  color: string;
}
