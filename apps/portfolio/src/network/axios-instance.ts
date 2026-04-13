import { AxiosClientFactory, ServiceConfig, RequestConfig } from './axios-factory';

/**
 * KOMCA 패턴 - localStorage에서 accessToken 가져오기
 */
const getAccessToken = (): string => {
  try {
    return localStorage.getItem('accessToken') || '';
  } catch {
    return '';
  }
};

/**
 * Supabase REST API 설정
 */
const supabaseConfig: ServiceConfig = {
  hostUrl: process.env.REACT_APP_SUPABASE_URL || '',
  basePath: '/rest/v1',
};

/**
 * Supabase 요청 핸들러
 * - apikey 헤더 추가
 * - Authorization 헤더 추가
 */
const supabaseRequestHandler = (config: RequestConfig): RequestConfig => {
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

  config.headers['apikey'] = anonKey;
  config.headers['Authorization'] = `Bearer ${anonKey}`;
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
