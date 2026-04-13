/**
 * 환경 변수 타입 정의 (Host 앱)
 *
 * Host 앱에서 사용하는 모든 환경 변수의 타입을 정의합니다.
 * - Firebase 설정
 * - Supabase 설정
 * - Remote 앱 URL
 * - JWT 시크릿 (서버 사이드)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /** 실행 환경 */
    NODE_ENV: 'development' | 'production' | 'test';

    // ============================================
    // Supabase 설정
    // ============================================
    /** Supabase 프로젝트 URL */
    REACT_APP_SUPABASE_URL: string;

    /** Supabase Anonymous Key (클라이언트 사이드용) */
    REACT_APP_SUPABASE_ANON_KEY: string;

    // ============================================
    // Firebase 설정
    // ============================================
    /** Firebase API Key */
    FIREBASE_API_KEY?: string;

    /** Firebase Auth Domain (예: project-id.firebaseapp.com) */
    FIREBASE_AUTH_DOMAIN?: string;

    /** Firebase Project ID */
    FIREBASE_PROJECT_ID?: string;

    /** Firebase Storage Bucket (예: project-id.appspot.com) */
    FIREBASE_STORAGE_BUCKET?: string;

    /** Firebase Messaging Sender ID */
    FIREBASE_MESSAGING_SENDER_ID?: string;

    /** Firebase App ID */
    FIREBASE_APP_ID?: string;

    // ============================================
    // Remote 앱 URL (Module Federation)
    // ============================================
    /** Remote1 (Resume) 앱 URL */
    REMOTE1_URL?: string;

    /** Remote2 (Blog) 앱 URL */
    REMOTE2_URL?: string;

    /** Remote3 (Portfolio) 앱 URL */
    REMOTE3_URL?: string;

    // ============================================
    // JWT 설정 (서버 사이드 - API Routes)
    // ============================================
    /** Access Token 서명 시크릿 */
    JWT_ACCESS_SECRET?: string;

    /** Refresh Token 서명 시크릿 */
    JWT_REFRESH_SECRET?: string;
  }
}

export {};