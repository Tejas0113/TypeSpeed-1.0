import React from 'react';
import { Zap, History, Trophy, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PersonalBest } from '../types';

interface UserArenaHeaderProps {
  personalBest?: PersonalBest;
  activeView: 'test' | 'history';
  onViewChange: (view: 'test' | 'history') => void;
  onOpenLeaderboard: () => void;
}

export const UserArenaHeader: React.FC<UserArenaHeaderProps> = ({
  personalBest,
  activeView,
  onViewChange,
  onOpenLeaderboard,
}) => {
  const { user, profile } = useAuth();

  if (!user) return null;

  const displayName =
    profile?.username && !profile.username.includes('_')
      ? profile.username
      : user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        profile?.username ||
        user.email?.split('@')[0] ||
        'Typist';

  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/40 shadow-xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/30">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Welcome back, {displayName}!
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {personalBest && personalBest.highestWpm > 0 && (
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  PB: {personalBest.highestWpm} WPM
                </span>
              )}
              {personalBest && personalBest.testsCompleted > 0 && (
                <span className="hidden sm:inline">
                  {personalBest.testsCompleted} tests completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Leaderboard */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
            <button
              onClick={() => onViewChange('test')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'test'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Typing Arena</span>
            </button>

            <button
              onClick={() => onViewChange('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'history'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>My History</span>
            </button>
          </div>

          <button
            onClick={onOpenLeaderboard}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-amber-500 transition-colors cursor-pointer"
            title="Global Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
