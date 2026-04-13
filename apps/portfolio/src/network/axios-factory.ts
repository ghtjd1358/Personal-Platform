import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';

export type RequestConfig = Omit<AxiosRequestConfig, 'headers'> & { headers: Record<string, string> };
export type Response<ResData> = AxiosResponse<ResData>;

export interface AxiosConfig extends AxiosRequestConfig {
  hostUrl?: string;
  basePath?: string;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  code?: string;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ExtendedAxiosError extends AxiosError {
  response?: AxiosResponse<ApiErrorResponse>;
}

export function isAxiosError(error: any): error is AxiosError {
  return Boolean((error as AxiosError).isAxiosError);
}

export function isApiError(error: any): error is ExtendedAxiosError {
  return (
    isAxiosError(error) &&
    error.response?.data !== undefined
  );
}

/**
 * Axios 클라이언트 팩토리
 * KOMCA 스타일의 axios 인스턴스 생성
 */
export class AxiosClientFactory {
  /**
   * 새로운 Axios 클라이언트 인스턴스 생성
   */
  static createClient(
    serviceConfig: AxiosConfig,
    customRequestHandler?: (config: RequestConfig, axios: AxiosInstance) => Promise<RequestConfig> | RequestConfig
  ): AxiosInstance {
    const axiosInstance = Axios.create({
      baseURL: `${serviceConfig.hostUrl || ''}${serviceConfig.basePath || ''}`,
      timeout: 60000,
      ...serviceConfig,
    });

    // 요청 인터셉터
    axiosInstance.interceptors.request.use((config) => {
      config.headers = config.headers || {};

      // UUID 헤더 추가
      config.headers['X-Request-ID'] = uuid();

      // 파라미터 필터링: 빈 문자열이나 null/undefined 값 제거
      if (config.params) {
        config.params = Object.entries(config.params).reduce((acc, [key, value]) => {
          if (value !== '' && value != null) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);
      }

      // 커스텀 요청 핸들러 실행
      if (customRequestHandler) {
        return customRequestHandler(config as RequestConfig, axiosInstance);
      }

      return config;
    });

    // 응답 인터셉터
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // 네트워크 에러
        if (error.message === 'Network Error') {
          console.error('Network error detected. Please check your internet connection.');
        }

        // API 에러 로깅
        if (isApiError(error)) {
          console.error('API Error:', error.response?.data);
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }
}

/**
 * 서비스 설정 인터페이스
 */
export interface ServiceConfig {
  hostUrl: string;
  basePath?: string;
  timeout?: number;
}
