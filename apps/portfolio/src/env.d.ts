/**
 * 환경 변수 타입 정의 (Remote3 - Portfolio 앱)
 *
 * Remote3 앱에서 사용하는 환경 변수의 타입을 정의합니다.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /** 실행 환경 */
    NODE_ENV: 'development' | 'production' | 'test';

    // ============================================
    // Supabase 설정
    // ============================================
    /** Supabase 프로젝트 URL */
    REACT_APP_SUPABASE_URL?: string;

    /** Supabase Anonymous Key (클라이언트 사이드용) */
    REACT_APP_SUPABASE_ANON_KEY?: string;

    // ============================================
    // API 설정
    // ============================================
    /** 외부 API Host URL */
    REACT_APP_API_HOST_URL?: string;
  }
}

export {};