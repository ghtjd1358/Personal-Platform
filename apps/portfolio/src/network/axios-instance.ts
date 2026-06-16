import { AxiosClientFactory, ServiceConfig, RequestConfig } from './axios-factory';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY must be set');
}

// 로그인 사용자의 JWT를 localStorage에서 가져옴. 서명 검증은 서버가 담당.
const getAccessToken = (): string => {
  try {
    return localStorage.getItem('accessToken') || '';
  } catch {
    return '';
  }
};

const supabaseConfig: ServiceConfig = {
  hostUrl: SUPABASE_URL,
  basePath: '/rest/v1',
};

const supabaseRequestHandler = (config: RequestConfig): RequestConfig => {
  const anonKey = SUPABASE_ANON_KEY;
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
