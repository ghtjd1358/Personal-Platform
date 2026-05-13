/**
 * Supabase Client
 * Supabase Auth를 위한 공식 SDK 클라이언트
 */
import { createClient } from '@supabase/supabase-js';
// Supabase 클라이언트 싱글톤
let supabaseInstance = null;
/**
 * Supabase 클라이언트 초기화
 * 앱 시작 시 한 번만 호출
 */
/**
 * Public Supabase 자격 — anon role JWT + project URL.
 * webpack Dotenv 가 monorepo root .env 못 읽고 (.gitignore), Vercel build env 가
 * dotenv-webpack systemvars 로도 박히지 않는 환경 한계 우회. anon key 는 public
 * 정보이며 진짜 보호는 RLS 정책. 양치기 끝나고 webpack DefinePlugin 정리 후 제거.
 */
const PUBLIC_SUPABASE_FALLBACK = {
    url: 'https://ujhlgylnauzluttvmcrz.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaGxneWxuYXV6bHV0dHZtY3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDA0MjcsImV4cCI6MjA4MTA3NjQyN30.UcOpbc6QDU-J2s_6eI5vEehvbgSRMCSHIjkFiHb0oRo',
};
export function initSupabase(config) {
    if (supabaseInstance) {
        return supabaseInstance;
    }
    const supabaseUrl = config.supabaseUrl || PUBLIC_SUPABASE_FALLBACK.url;
    const supabaseAnonKey = config.supabaseAnonKey || PUBLIC_SUPABASE_FALLBACK.anonKey;
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
export function getSupabase() {
    if (!supabaseInstance) {
        throw new Error('[Supabase] 클라이언트가 초기화되지 않았습니다. ' +
            'initSupabase()를 먼저 호출해주세요.');
    }
    return supabaseInstance;
}
/**
 * Supabase 클라이언트 리셋 (테스트용)
 */
export function resetSupabase() {
    supabaseInstance = null;
}
