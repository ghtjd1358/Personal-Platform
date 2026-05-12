/**
 * Supabase Axios Client
 * Supabase REST API를 axios로 호출하기 위한 클라이언트
 * 토큰 갱신 지원
 */
import { AxiosInstance } from 'axios';
/**
 * Supabase Axios 설정
 */
export interface SupabaseAxiosConfig {
    /** Supabase 프로젝트 URL */
    supabaseUrl: string;
    /** Supabase anon key */
    supabaseAnonKey: string;
    /** 타임아웃 (기본: 30000ms) */
    timeout?: number;
    /** 토큰 갱신 함수 (Supabase Auth 사용 시) */
    refreshSession?: () => Promise<{
        accessToken: string;
        refreshToken: string;
    } | null>;
    /** 액세스 토큰 가져오기 */
    getAccessToken?: () => string;
    /** 액세스 토큰 설정 */
    setAccessToken?: (token: string) => void;
    /** 인증 실패 시 콜백 */
    onUnauthorized?: () => void;
}
/**
 * Supabase Axios 클라이언트 생성
 */
export declare function createSupabaseAxiosClient(config: SupabaseAxiosConfig): AxiosInstance;
/**
 * Supabase Auth API 클라이언트 생성 (토큰 갱신용)
 */
export declare function createSupabaseAuthClient(config: SupabaseAxiosConfig): AxiosInstance;
/**
 * Supabase 토큰 갱신 헬퍼
 */
export declare function refreshSupabaseToken(authClient: AxiosInstance, refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
} | null>;
/**
 * API 응답 래퍼 타입
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * 페이지네이션 응답 타입
 */
export interface PageListResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=supabase-axios.d.ts.map