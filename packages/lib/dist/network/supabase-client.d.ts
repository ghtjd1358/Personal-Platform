/**
 * Supabase Client
 * Supabase Auth를 위한 공식 SDK 클라이언트
 */
import { SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';
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
export declare function initSupabase(config: SupabaseClientConfig): SupabaseClient;
/**
 * Supabase 클라이언트 가져오기
 * 반드시 initSupabase()로 먼저 초기화해야 함
 */
export declare function getSupabase(): SupabaseClient;
/**
 * Supabase 클라이언트 리셋 (테스트용)
 */
export declare function resetSupabase(): void;
export type { SupabaseClient, Session, SupabaseUser };
//# sourceMappingURL=supabase-client.d.ts.map