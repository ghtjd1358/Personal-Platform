/**
 * Supabase Axios Client
 * Supabase REST API를 axios로 호출하기 위한 클라이언트
 * 토큰 갱신 지원
 */

import { AxiosClientFactory, AxiosConfig, RequestConfig, initAxiosFactory } from './axios-factory';
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
  refreshSession?: () => Promise<{ accessToken: string; refreshToken: string } | null>;
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
export function createSupabaseAxiosClient(config: SupabaseAxiosConfig): AxiosInstance {
  const {
    supabaseUrl,
    supabaseAnonKey,
    timeout = 30000,
    refreshSession,
    getAccessToken,
    setAccessToken,
    onUnauthorized,
  } = config;

  // Axios Factory 초기화 (토큰 갱신 지원)
  if (getAccessToken && setAccessToken) {
    initAxiosFactory({
      getAccessToken,
      setAccessToken,
      refreshToken: refreshSession
        ? async () => {
            const session = await refreshSession();
            return session?.accessToken || null;
          }
        : undefined,
      onUnauthorized,
    });
  }

  // Supabase REST API 클라이언트 생성
  return AxiosClientFactory.createClient(
    {
      hostUrl: supabaseUrl,
      basePath: '/rest/v1',
      timeout,
    } as AxiosConfig,
    (requestConfig: RequestConfig) => {
      // Supabase 필수 헤더
      requestConfig.headers['apikey'] = supabaseAnonKey;
      requestConfig.headers['Content-Type'] = 'application/json';
      requestConfig.headers['Prefer'] = 'return=representation';
      return requestConfig;
    }
  );
}

/**
 * Supabase Auth API 클라이언트 생성 (토큰 갱신용)
 */
export function createSupabaseAuthClient(config: SupabaseAxiosConfig): AxiosInstance {
  const { supabaseUrl, supabaseAnonKey, timeout = 30000 } = config;

  return AxiosClientFactory.createClient(
    {
      hostUrl: supabaseUrl,
      basePath: '/auth/v1',
      timeout,
    } as AxiosConfig,
    (requestConfig: RequestConfig) => {
      requestConfig.headers['apikey'] = supabaseAnonKey;
      requestConfig.headers['Content-Type'] = 'application/json';
      return requestConfig;
    }
  );
}

/**
 * Supabase 토큰 갱신 헬퍼
 */
export async function refreshSupabaseToken(
  authClient: AxiosInstance,
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const response = await authClient.post('/token?grant_type=refresh_token', {
      refresh_token: refreshToken,
    });

    if (response.data?.access_token) {
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
      };
    }

    return null;
  } catch (error) {
    console.error('[Supabase Token Refresh Failed]', error);
    return null;
  }
}

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
