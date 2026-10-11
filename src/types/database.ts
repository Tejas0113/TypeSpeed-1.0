export interface Profile {
  id: string;
  username: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTestResult {
  id: string;
  user_id: string;
  wpm: number;
  raw_wpm: number;
  accuracy: number;
  duration: 15 | 30 | 60;
  correct_chars: number;
  incorrect_chars: number;
  errors: number;
  created_at: string;
}

export interface LeaderboardEntry {
  test_id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  wpm: number;
  raw_wpm: number;
  accuracy: number;
  duration: 15 | 30 | 60;
  created_at: string;
}
