/**
 * initRemoteApp — Remote(standalone) 모드 진입점 공통 초기화.
 *
 * 모든 remote(1~4)의 init.tsx가 동일하게 하던 작업을 단일 함수로 통합:
 *   1. host 플래그 제거 (standalone 명시)
 *   2. Supabase 싱글톤 초기화
 *
 * 사용:
 *   // apps/blog/src/init.tsx
 *   import { initRemoteApp } from '@sonhoseong/mfa-lib';
 *   initRemoteApp({
 *     supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
 *     supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
 *   });
 */
import { storage } from './storage';
import { initSupabase } from '../network/supabase-client';

interface InitRemoteAppOptions {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const initRemoteApp = ({ supabaseUrl, supabaseAnonKey }: InitRemoteAppOptions): void => {
  storage.removeHostApp();
  initSupabase({ supabaseUrl, supabaseAnonKey });
};
