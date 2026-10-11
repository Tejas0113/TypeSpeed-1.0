import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, Trophy, Award, User, LogOut, LogIn, ChevronDown, Edit3, Check, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { PersonalBest } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';

interface HeaderProps {
  personalBest?: PersonalBest;
  onScrollToTest?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  personalBest,
  onScrollToTest,
  onOpenLeaderboard,
  onOpenAuth,
}) => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setIsEditingUsername(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Prioritize Google full name or clean username
  const googleName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const displayName =
    (profile?.username && !profile.username.includes('_') ? profile.username : null) ||
    googleName ||
    profile?.username ||
    user?.email?.split('@')[0] ||
    'Typist';

  const handleStartEdit = () => {
    setNewUsername(profile?.username || displayName);
    setIsEditingUsername(true);
    setEditError(null);
  };

  const handleSaveUsername = async () => {
    const trimmed = newUsername.trim();
    if (!trimmed || !user) return;
    if (trimmed.length < 3) {
      setEditError('Must be at least 3 characters');
      return;
    }
    setIsSavingUsername(true);
    setEditError(null);

    const success = await dbService.updateProfile(user.id, { username: trimmed });
    if (success) {
      await refreshProfile();
      setIsEditingUsername(false);
    } else {
      setEditError('Username taken or error');
    }
    setIsSavingUsername(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-50/90 dark:bg-neutral-950/90 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          id="header-brand-link"
          href="#typing-test-section"
          onClick={(e) => {
            if (onScrollToTest) {
              e.preventDefault();
              onScrollToTest();
            }
          }}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1 py-0.5"
        >
          <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Keyboard className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
              TypeSpeed
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main Navigation">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400 mr-2">
            <a
              id="nav-link-test"
              href="#typing-test-section"
              onClick={(e) => scrollToSection(e, 'typing-test-section')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Test
            </a>
            <a
              id="nav-link-how-it-works"
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              id="nav-link-faq"
              href="#faq"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Leaderboard Button */}
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors shadow-2xs cursor-pointer"
              title="View Global Leaderboard"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Leaderboard</span>
            </button>
          )}

          {/* Quick PB Badge (if available) */}
          {personalBest && personalBest.highestWpm > 0 && (
            <div
              id="header-pb-badge"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
              title={`Personal Best: ${personalBest.highestWpm} WPM (${personalBest.bestAccuracy}% Acc)`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>PB: {personalBest.highestWpm} WPM</span>
            </div>
          )}

          {/* Auth State Button / Profile Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-2xs cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] uppercase">
                    {displayName.slice(0, 2)}
                  </div>
                )}
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    {isEditingUsername ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                          Edit Username
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter username"
                            className="flex-1 px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveUsername}
                            disabled={isSavingUsername}
                            className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
                            title="Save username"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setIsEditingUsername(false)}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {editError && <p className="text-[10px] text-red-500">{editError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleStartEdit}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          title="Change username"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {personalBest && (
                    <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <div className="flex justify-between py-0.5">
                        <span className="text-neutral-400">Best Speed:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {personalBest.highestWpm} WPM
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-neutral-400">Tests Done:</span>
                        <span className="font-semibold">{personalBest.testsCompleted}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <ThemeToggle id="header-theme-toggle" />
          </div>
        </nav>
      </div>
    </header>
  );
};
