import React, { useEffect, useState, useCallback } from 'react';
import {
  History,
  Trophy,
  Zap,
  Target,
  Clock,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { DbTestResult } from '../types/database';

interface UserHistoryProps {
  onBackToTest: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const UserHistory: React.FC<UserHistoryProps> = ({ onBackToTest, onOpenAuth }) => {
  const { user, profile } = useAuth();
  const [history, setHistory] = useState<DbTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number | undefined>(undefined);

  const loadHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const records = await dbService.getUserFullHistory(user.id, 100);
      setHistory(records);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredHistory = selectedDuration
    ? history.filter((r) => r.duration === selectedDuration)
    : history;

  // Compute aggregate stats
  const totalTests = history.length;
  const highestWpm = totalTests > 0 ? Math.max(...history.map((r) => r.wpm)) : 0;
  const avgWpm =
    totalTests > 0
      ? Math.round(history.reduce((sum, r) => sum + r.wpm, 0) / totalTests)
      : 0;
  const avgAccuracy =
    totalTests > 0
      ? Number((history.reduce((sum, r) => sum + Number(r.accuracy), 0) / totalTests).toFixed(1))
      : 0;
  const totalSeconds = history.reduce((sum, r) => sum + r.duration, 0);
  const totalMinutes = (totalSeconds / 60).toFixed(1);

  if (!user) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Cloud History Requires Sign In
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Sign in to automatically save every typing test session to your personal history and track your improvement over time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onBackToTest}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Back to Test
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="user-history-section" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTest}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Back to Typing Test"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <span>My Typing History</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Cloud Synced
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Logged in as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{profile?.username || user.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onBackToTest}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Take a Test</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-8">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Highest WPM</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
            {highestWpm}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Avg Speed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {avgWpm} <span className="text-xs font-semibold text-neutral-400">WPM</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span>Avg Accuracy</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
            {avgAccuracy}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Tests Taken</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
            {totalTests}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            <span>Total Practice</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
            {totalMinutes} <span className="text-xs font-semibold text-neutral-400">min</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mr-1">
            Filter:
          </span>
          {[
            { label: 'All Durations', value: undefined },
            { label: '15s', value: 15 },
            { label: '30s', value: 30 },
            { label: '60s', value: 60 },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setSelectedDuration(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedDuration === tab.value
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-400">
          Showing {filteredHistory.length} of {totalTests} sessions
        </span>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-sm text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
            Loading test records...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-16 text-center">
            <History className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
              No typing tests recorded yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Complete a typing test while logged in to build your personal history and track speed improvements.
            </p>
            <button
              onClick={onBackToTest}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Start Your First Test</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-950/50 text-[11px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Speed (WPM)</th>
                  <th className="py-3 px-4">Raw Speed</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Characters</th>
                  <th className="py-3 px-4">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {filteredHistory.map((test) => {
                  const testDate = new Date(test.created_at);
                  const isTopScore = test.wpm === highestWpm && highestWpm > 0;

                  return (
                    <tr
                      key={test.id}
                      className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors text-xs text-neutral-800 dark:text-neutral-200"
                    >
                      <td className="py-3.5 px-4 flex items-center gap-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>
                          {testDate.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-neutral-300 dark:text-neutral-700">•</span>
                        <span>
                          {testDate.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {test.duration}s
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-neutral-900 dark:text-white tabular-nums">
                            {test.wpm}
                          </span>
                          {isTopScore && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400" title="Personal Best Score">
                              PB 🌟
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {test.raw_wpm} WPM
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold tabular-nums ${
                            test.accuracy >= 95
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : test.accuracy >= 90
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {test.accuracy}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 tabular-nums">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{test.correct_chars}</span>
                        <span className="text-neutral-300 dark:text-neutral-700"> / </span>
                        <span>{test.correct_chars + test.incorrect_chars}</span>
                      </td>

                      <td className="py-3.5 px-4 tabular-nums">
                        {test.errors === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">0</span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold">{test.errors}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
