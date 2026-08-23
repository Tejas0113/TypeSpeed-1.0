import { PerformanceFeedback } from '../types';

/**
 * Calculates Words Per Minute (WPM) based on the standard formula:
 * WPM = (correct characters / 5) / (elapsed time in minutes)
 */
export function calculateWPM(correctChars: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds <= 0 || correctChars <= 0) {
    return 0;
  }
  const timeInMinutes = timeElapsedSeconds / 60;
  const words = correctChars / 5;
  const wpm = words / timeInMinutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Calculates Raw Words Per Minute (includes both correct and incorrect characters)
 */
export function calculateRawWPM(totalTypedChars: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds <= 0 || totalTypedChars <= 0) {
    return 0;
  }
  const timeInMinutes = timeElapsedSeconds / 60;
  const words = totalTypedChars / 5;
  const rawWpm = words / timeInMinutes;
  return Math.max(0, Math.round(rawWpm));
}

/**
 * Calculates accuracy percentage:
 * Accuracy = (correct characters / total typed characters) * 100
 * Handled to 1 decimal place.
 */
export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars <= 0) {
    return 100.0;
  }
  const acc = (correctChars / totalTypedChars) * 100;
  const clamped = Math.min(100, Math.max(0, acc));
  return Math.round(clamped * 10) / 10;
}

/**
 * Provides helpful and encouraging performance feedback based on WPM & Accuracy.
 */
export function getPerformanceRating(wpm: number, accuracy: number): PerformanceFeedback {
  if (wpm >= 100 && accuracy >= 95) {
    return {
      title: 'Grandmaster Speed',
      message: 'Phenomenal performance! Your speed and accuracy are in the top tier of typists.',
      badge: 'Elite 100+ WPM',
      color: 'emerald',
    };
  }
  if (wpm >= 80 && accuracy >= 92) {
    return {
      title: 'Strong Performance',
      message: 'Great job! You maintain impressive speed while keeping errors minimal.',
      badge: 'Advanced Typist',
      color: 'emerald',
    };
  }
  if (wpm >= 60 && accuracy >= 90) {
    return {
      title: 'Great Rhythm',
      message: 'Strong performance. You type well above average with solid consistency.',
      badge: 'Proficient',
      color: 'blue',
    };
  }
  if (wpm >= 40 && accuracy >= 85) {
    return {
      title: 'Nice Work',
      message: 'Good steady rhythm. Keep practicing to boost your speed and fluid cadence.',
      badge: 'Intermediate',
      color: 'amber',
    };
  }
  return {
    title: 'Keep Practicing',
    message: 'Focus on finger placement and accuracy first. Speed will naturally follow with practice.',
    badge: 'Developing',
    color: 'neutral',
  };
}
