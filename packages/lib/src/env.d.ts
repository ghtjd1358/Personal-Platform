/**
 * 환경 변수 타입 정의 (공통 라이브러리)
 *
 * 이 파일은 process.env에 대한 타입 안전성을 제공합니다.
 * 각 프로젝트에서 이 파일을 확장하여 사용합니다.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /** 실행 환경 */
    NODE_ENV: 'development' | 'production' | 'test';

    /** Supabase 프로젝트 URL */
    REACT_APP_SUPABASE_URL?: string;

    /** Supabase Anonymous Key (클라이언트 사이드용) */
    REACT_APP_SUPABASE_ANON_KEY?: string;
  }
}

export {};