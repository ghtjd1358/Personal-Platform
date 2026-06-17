import { createClient, SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function initSupabase(config: SupabaseClientConfig): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const { supabaseUrl, supabaseAnonKey } = config;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('[Supabase] REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY 환경변수가 필요합니다.');
  }

  // Google OAuth signInWithOAuth 트리거 전용 — 세션 관리는 Node.js JWT flow가 담당
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseInstance;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    throw new Error('[Supabase] initSupabase()를 먼저 호출해주세요.');
  }
  return supabaseInstance;
}

export type { SupabaseClient, Session, SupabaseUser };
