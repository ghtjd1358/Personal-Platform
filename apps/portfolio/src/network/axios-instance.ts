import { AxiosClientFactory, ServiceConfig, RequestConfig } from './axios-factory';

/**
 * localStorage 에서 accessToken 가져오기 + 만료 검사.
 *
 * Why: supabase-js 와 달리 우리 axios 는 raw localStorage 를 신뢰함. 과거 로그인 잔존 JWT
 * 가 만료된 채로 남아 있으면 Bearer <expired> 가 그대로 가서 supabase 가 401 반환.
 * payload.exp 만 확인하면 충분 (서명 검증은 server 가 함). 만료 감지 시 즉시 정리해서
 * 인터셉터가 자동으로 anonKey 로 fallback 하도록 한다.
 */
const getAccessToken = (): string => {
  try {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('accessToken');
      return '';
    }
    return token;
  } catch {
    return '';
  }
};

/**
 * Public Supabase 자격 fallback — lib initSupabase 와 동일 패턴.
 * webpack-dev-server 가 root .env 못 읽어 process.env 가 빈 문자열일 때 사용. anon key 는 public + RLS 가 진짜 보호.
 */
const PUBLIC_SUPABASE_FALLBACK = {
  url: 'https://ujhlgylnauzluttvmcrz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaGxneWxuYXV6bHV0dHZtY3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDA0MjcsImV4cCI6MjA4MTA3NjQyN30.UcOpbc6QDU-J2s_6eI5vEehvbgSRMCSHIjkFiHb0oRo',
};

/**
 * Supabase REST API 설정
 */
const supabaseConfig: ServiceConfig = {
  hostUrl: process.env.REACT_APP_SUPABASE_URL || PUBLIC_SUPABASE_FALLBACK.url,
  basePath: '/rest/v1',
};

/**
 * Supabase 요청 핸들러
 * - apikey: 항상 anon key (REST 진입 인증)
 * - Authorization: 로그인 사용자의 JWT 우선, 없으면 anon
 *   이전 버전: 항상 anon 만 사용 → RLS `auth.uid() = user_id` 가 NULL 이라 INSERT/UPDATE 401.
 */
const supabaseRequestHandler = (config: RequestConfig): RequestConfig => {
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_FALLBACK.anonKey;
  const accessToken = getAccessToken();

  config.headers['apikey'] = anonKey;
  config.headers['Authorization'] = `Bearer ${accessToken || anonKey}`;
  config.headers['Content-Type'] = 'application/json';
  config.headers['Prefer'] = 'return=representation';

  return config;
};

/**
 * Supabase Axios 클라이언트
 */
export const supabaseAxios = AxiosClientFactory.createClient(
  supabaseConfig,
  supabaseRequestHandler
);

/**
 * 기본 Axios 클라이언트 - KOMCA 패턴 적용
 * accessToken을 자동으로 Authorization 헤더에 추가
 */
const defaultRequestHandler = (config: RequestConfig): RequestConfig => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  config.headers['Content-Type'] = 'application/json';

  return config;
};

export const axiosClient = AxiosClientFactory.createClient(
  {
    hostUrl: process.env.REACT_APP_API_HOST_URL || '',
    basePath: '',
  },
  defaultRequestHandler
);
