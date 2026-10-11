import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, DbTestResult, LeaderboardEntry } from '../types/database';
import { TestStats, TestHistoryItem, TestDuration, PersonalBest } from '../types';

export const dbService = {
  /**
   * Fetch a user's profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Error fetching profile:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.warn('Failed to fetch profile', err);
      return null;
    }
  },

  /**
   * Update a user's profile (e.g. username)
   */
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
      return true;
    } catch (err) {
      console.error('Failed to update profile', err);
      return false;
    }
  },

  /**
   * Save a completed typing test result to the database
   */
  async saveTestResult(userId: string, stats: TestStats): Promise<DbTestResult | null> {
    if (!isSupabaseConfigured) return null;
    try {
      // 1. Ensure profile exists in profiles table to prevent foreign key violation
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!existingProfile) {
          const { data: authData } = await supabase.auth.getUser();
          const meta = authData?.user?.user_metadata;
          const rawName = (meta?.username || meta?.full_name || meta?.name || authData?.user?.email?.split('@')[0] || 'user')
            .replace(/[^a-zA-Z0-9_]/g, '_')
            .slice(0, 15);
          const autoUsername = `${rawName}_${userId.slice(0, 4)}`;

          await supabase.from('profiles').upsert({
            id: userId,
            username: autoUsername,
            avatar_url: meta?.avatar_url || meta?.picture || null,
          });
        }
      } catch (profileErr) {
        console.warn('Profile ensure warning:', profileErr);
      }

      // 2. Insert test result row
      const { data, error } = await supabase
        .from('test_results')
        .insert({
          user_id: userId,
          wpm: Math.max(0, Math.round(stats.wpm)),
          raw_wpm: Math.max(0, Math.round(stats.rawWpm)),
          accuracy: Number(Math.min(100, Math.max(0, stats.accuracy)).toFixed(2)),
          duration: stats.duration,
          correct_chars: stats.correctChars,
          incorrect_chars: stats.incorrectChars,
          errors: stats.errors,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving test result to Supabase:', error.message);
        return null;
      }

      return data as DbTestResult;
    } catch (err) {
      console.error('Failed to save test result', err);
      return null;
    }
  },

  /**
   * Fetch personal best and statistics from Supabase for a logged-in user
   */
  async getUserPersonalBest(userId: string): Promise<PersonalBest | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return null;
      }

      if (data.length === 0) {
        return {
          highestWpm: 0,
          bestAccuracy: 0,
          testsCompleted: 0,
          history: [],
        };
      }

      const highestWpm = Math.max(...data.map((r) => r.wpm));
      const bestAccuracy = Math.max(...data.map((r) => r.accuracy));
      const history: TestHistoryItem[] = data.slice(0, 20).map((r) => ({
        id: r.id,
        timestamp: new Date(r.created_at).getTime(),
        wpm: r.wpm,
        accuracy: r.accuracy,
        duration: r.duration as TestDuration,
      }));

      return {
        highestWpm,
        bestAccuracy,
        testsCompleted: data.length,
        lastCompletedAt: data[0].created_at,
        history,
      };
    } catch (err) {
      console.warn('Failed to fetch user personal best from DB', err);
      return null;
    }
  },

  /**
   * Fetch full test history for a specific user
   */
  async getUserFullHistory(userId: string, limit = 100): Promise<DbTestResult[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching full history:', error.message);
        return [];
      }
      return (data || []) as DbTestResult[];
    } catch (err) {
      console.warn('Failed to fetch full history', err);
      return [];
    }
  },

  /**
   * Fetch Global Leaderboard
   */
  async getLeaderboard(duration?: number, limit = 50): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('wpm', { ascending: false })
        .order('accuracy', { ascending: false })
        .limit(limit);

      if (duration) {
        query = query.eq('duration', duration);
      }

      const { data, error } = await query;
      if (error) {
        // Fallback: if view hasn't been created yet, query directly from test_results
        console.warn('Leaderboard view query failed, trying direct query:', error.message);
        const { data: directData, error: directErr } = await supabase
          .from('test_results')
          .select('id, user_id, wpm, raw_wpm, accuracy, duration, created_at, profiles(username, avatar_url)')
          .order('wpm', { ascending: false })
          .limit(limit);

        if (directErr || !directData) return [];

        return directData.map((item: any) => ({
          test_id: item.id,
          user_id: item.user_id,
          username: item.profiles?.username || 'Anonymous Typist',
          avatar_url: item.profiles?.avatar_url,
          wpm: item.wpm,
          raw_wpm: item.raw_wpm,
          accuracy: item.accuracy,
          duration: item.duration,
          created_at: item.created_at,
        }));
      }

      return (data || []) as LeaderboardEntry[];
    } catch (err) {
      console.warn('Failed to fetch leaderboard', err);
      return [];
    }
  },

  /**
   * Sync local guest history to Supabase upon first login
   */
  async syncLocalHistory(userId: string, localItems: TestHistoryItem[]): Promise<number> {
    if (!isSupabaseConfigured || localItems.length === 0) return 0;
    try {
      const rows = localItems.map((item) => ({
        user_id: userId,
        wpm: item.wpm,
        raw_wpm: item.wpm,
        accuracy: item.accuracy,
        duration: item.duration,
        correct_chars: Math.round((item.wpm * 5 * item.duration) / 60),
        incorrect_chars: 0,
        errors: 0,
        created_at: new Date(item.timestamp).toISOString(),
      }));

      const { data, error } = await supabase
        .from('test_results')
        .insert(rows)
        .select();

      if (error) {
        console.warn('Failed to sync local tests to cloud', error.message);
        return 0;
      }
      return data?.length || 0;
    } catch (e) {
      console.warn('Sync error', e);
      return 0;
    }
  },
};
