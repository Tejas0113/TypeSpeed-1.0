import React, { useEffect, useState, useCallback } from 'react';
import { X, Trophy, Medal, RefreshCw, Clock, Target, Zap, AlertCircle } from 'lucide-react';
import { dbService } from '../services/dbService';
import { LeaderboardEntry } from '../types/database';
import { isSupabaseConfigured } from '../lib/supabase';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchScores = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const data = await dbService.getLeaderboard(selectedDuration, 50);
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDuration]);

  useEffect(() => {
    if (isOpen) {
      fetchScores();
    }
  }, [isOpen, fetchScores]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 z-10 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                Global Leaderboard
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Top speed typists from around the world
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchScores}
              disabled={loading || !isSupabaseConfigured}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 my-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Duration:
          </span>
          {[
            { label: 'All', value: undefined },
            { label: '15s', value: 15 },
            { label: '30s', value: 30 },
            { label: '60s', value: 60 },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setSelectedDuration(tab.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDuration === tab.value
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!isSupabaseConfigured ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
              <h3 className="font-semibold text-neutral-900 dark:text-white">Supabase Not Connected Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mt-1">
                Configure your Supabase URL and Anon Key in <code className="font-mono">.env</code> and run the SQL migration to enable the live leaderboard!
              </p>
            </div>
          ) : loading && entries.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
              Loading scores...
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm">
              <Trophy className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
              <p className="font-medium text-neutral-700 dark:text-neutral-300">No records found yet</p>
              <p className="text-xs text-neutral-400 mt-1">Complete a typing test while logged in to claim the top spot!</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {entries.map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={entry.test_id}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    {/* Rank & User */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 text-center font-bold text-sm">
                        {rank === 1 ? (
                          <span className="text-amber-500 text-base" title="1st Place">🥇</span>
                        ) : rank === 2 ? (
                          <span className="text-neutral-400 text-base" title="2nd Place">🥈</span>
                        ) : rank === 3 ? (
                          <span className="text-amber-700 text-base" title="3rd Place">🥉</span>
                        ) : (
                          <span className="text-neutral-400 text-xs">#{rank}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-500/20">
                          {entry.username.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <span>{entry.username}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                            <span>{entry.duration}s test</span>
                            <span>•</span>
                            <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                          <span>{entry.wpm} <span className="text-xs font-semibold text-neutral-500">WPM</span></span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <Target className="w-3 h-3 text-neutral-400" />
                          <span>{entry.accuracy}% acc</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
