/**
 * Supabase Client
 * Supabase Auth를 위한 공식 SDK 클라이언트
 */

import { createClient, SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

// Supabase 클라이언트 싱글톤
let supabaseInstance: SupabaseClient | null = null;

/**
 * Supabase 클라이언트 설정
 */
export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Supabase 클라이언트 초기화
 * 앱 시작 시 한 번만 호출
 */
export function initSupabase(config: SupabaseClientConfig): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { supabaseUrl, supabaseAnonKey } = config;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('[Supabase] URL과 Anon Key가 필요합니다.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  console.log('[Supabase] 클라이언트 초기화 완료');
  return supabaseInstance;
}

/**
 * Supabase 클라이언트 가져오기
 * 반드시 initSupabase()로 먼저 초기화해야 함
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    throw new Error(
      '[Supabase] 클라이언트가 초기화되지 않았습니다. ' +
      'initSupabase()를 먼저 호출해주세요.'
    );
  }
  return supabaseInstance;
}

/**
 * Supabase 클라이언트 리셋 (테스트용)
 */
export function resetSupabase(): void {
  supabaseInstance = null;
}

// 타입 재export
export type { SupabaseClient, Session, SupabaseUser };