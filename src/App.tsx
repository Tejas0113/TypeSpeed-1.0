import React, { useCallback, useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TypingTest } from './components/TypingTest';
import { UserArenaHeader } from './components/UserArenaHeader';
import { UserHistory } from './components/UserHistory';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LeaderboardModal } from './components/LeaderboardModal';

function MainLayout() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'home' | 'test' | 'history'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  // Switch to typing arena automatically when user signs in
  useEffect(() => {
    if (user && activeView === 'home') {
      setActiveView('test');
    }
  }, [user]);

  const handleOpenAuth = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const handleStartTypingFromHero = useCallback(() => {
    setActiveView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-300">
      {/* Navigation Header */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: LANDING / HERO VIEW (Public Presentation) */}
        {activeView === 'home' && (
          <div className="animate-in fade-in duration-200">
            <Hero
              onStartClick={handleStartTypingFromHero}
              onOpenAuth={handleOpenAuth}
            />
            {/* Embedded Live Typing Preview */}
            <div className="pb-8">
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  Instant Practice Preview
                </span>
              </div>
              <TypingTest
                onOpenAuth={handleOpenAuth}
                onViewHistory={() => {
                  setActiveView('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            <HowItWorks />
            <FAQ />
          </div>
        )}

        {/* VIEW 2: DEDICATED TYPING ARENA VIEW */}
        {activeView === 'test' && (
          <div className="py-4 animate-in fade-in duration-200">
            {/* Logged in Arena Top Bar */}
            <UserArenaHeader
              activeView="test"
              onViewChange={setActiveView}
              onOpenLeaderboard={() => setLeaderboardOpen(true)}
            />
            {/* Core Typing Station */}
            <TypingTest
              onOpenAuth={handleOpenAuth}
              onViewHistory={() => {
                setActiveView('history');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED USER CLOUD HISTORY & ANALYTICS VIEW */}
        {activeView === 'history' && (
          <div className="py-4 animate-in fade-in duration-200">
            {/* Logged in Arena Top Bar */}
            <UserArenaHeader
              activeView="history"
              onViewChange={setActiveView}
              onOpenLeaderboard={() => setLeaderboardOpen(true)}
            />
            {/* Full History Section */}
            <UserHistory
              onBackToTest={() => setActiveView('test')}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
