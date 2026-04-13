/**
 * Axios Factory
 * 401 에러시 자동 토큰 갱신 포함
 */

import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';

export type RequestConfig = Omit<AxiosRequestConfig, 'headers'> & {
  headers: Record<string, string>;
  _isRetry?: boolean;
};

export type Response<ResData> = AxiosResponse<ResData>;

export interface AxiosConfig extends AxiosRequestConfig {
  hostUrl?: string;
  basePath?: string;
}

// API 에러 상세 코드
export type ErrorDetailCodeType = 'TYPE_MISMATCH' | 'NotBlank' | 'NotNull' | 'Pattern' | 'Min' | 'Max' | 'Size';

// 에러 상세 정보
export interface ErrorDetail {
  code: ErrorDetailCodeType;
  field?: string;
  message?: string;
}

// API 에러 응답
export interface ApiErrorResponse {
  code: string;
  statusCode: number;
  timestamp: string;
  errorDetails?: ErrorDetail[];
}

export interface ExtendedAxiosError extends AxiosError {
  response?: AxiosResponse<ApiErrorResponse>;
}

// API 에러 여부 확인
export function isApiError(error: any): error is ExtendedAxiosError {
  const data = error.response?.data as ApiErrorResponse | undefined;
  return (
    isAxiosError(error) &&
    data?.code !== undefined &&
    data?.statusCode !== undefined
  );
}

// 에러 상세 정보 확인
export function hasErrorDetails(error: any): ErrorDetail[] | undefined {
  if (isApiError(error) && error.response?.data?.errorDetails?.length) {
    return error.response.data.errorDetails;
  }
  return undefined;
}

// Axios 에러 여부 확인
export function isAxiosError(error: any): error is AxiosError {
  return Boolean((error as AxiosError).isAxiosError);
}

// 서비스 설정
export interface ServiceConfig {
  hostUrl: string;
  basePath?: string;
  timeout?: number;
}

// 토큰 갱신 함수 타입
export type RefreshTokenFn = () => Promise<string | null>;

// 에러 이벤트 디스패치 함수 타입
export type DispatchErrorFn = (errorDetails: ErrorDetail[]) => void;

// ============================================
// HTTP 에러 핸들링 타입
// ============================================

/** HTTP 에러 타입 */
export type HttpErrorType = 'toast' | 'modal' | 'silent';

/** HTTP 에러 정보 */
export interface HttpErrorInfo {
  status: number;
  message: string;
  title?: string;
  type: HttpErrorType;
  /** 원본 에러 */
  error: AxiosError;
}

/** HTTP 에러 핸들러 함수 타입 */
export type HttpErrorHandler = (errorInfo: HttpErrorInfo) => void;

/** HTTP 상태 코드별 기본 메시지 */
export const HTTP_ERROR_MESSAGES: Record<number, { message: string; title?: string; type: HttpErrorType }> = {
  400: {
    message: '요청이 올바르지 않습니다. 입력값을 확인해 주세요.',
    title: '잘못된 요청',
    type: 'toast',
  },
  401: {
    message: '로그인이 필요합니다.',
    title: '인증 필요',
    type: 'silent', // 401은 토큰 갱신으로 처리
  },
  403: {
    message: '접근 권한이 없습니다.',
    title: '권한 없음',
    type: 'toast',
  },
  404: {
    message: '요청한 리소스를 찾을 수 없습니다.',
    title: '찾을 수 없음',
    type: 'toast',
  },
  408: {
    message: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
    title: '요청 시간 초과',
    type: 'toast',
  },
  409: {
    message: '요청이 현재 서버 상태와 충돌합니다.',
    title: '충돌',
    type: 'toast',
  },
  422: {
    message: '요청 데이터를 처리할 수 없습니다.',
    title: '처리 불가',
    type: 'toast',
  },
  429: {
    message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해 주세요.',
    title: '요청 제한',
    type: 'toast',
  },
  500: {
    message: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    title: '서버 오류',
    type: 'modal',
  },
  502: {
    message: '서버와 연결할 수 없습니다.',
    title: '연결 오류',
    type: 'modal',
  },
  503: {
    message: '서비스를 일시적으로 사용할 수 없습니다.',
    title: '서비스 점검 중',
    type: 'modal',
  },
  504: {
    message: '서버 응답 시간이 초과되었습니다.',
    title: '게이트웨이 시간 초과',
    type: 'modal',
  },
};

/** 네트워크 에러 메시지 */
export const NETWORK_ERROR_MESSAGE = {
  message: '네트워크 연결을 확인해 주세요.',
  title: '네트워크 오류',
  type: 'toast' as HttpErrorType,
};

// Factory 설정
export interface FactoryConfig {
  getAccessToken: () => string;
  setAccessToken: (token: string) => void;
  refreshToken?: RefreshTokenFn;
  onError?: DispatchErrorFn;
  onUnauthorized?: () => void;
  /** HTTP 에러 핸들러 (토스트/모달 표시용) */
  onHttpError?: HttpErrorHandler;
  /** 에러 핸들링 비활성화할 상태 코드 목록 */
  silentStatusCodes?: number[];
}

let factoryConfig: FactoryConfig | null = null;

// ============================================
// 토큰 갱신 큐 (동시 요청 시 중복 갱신 방지)
// KOMCA 스타일 패턴: 동시 401 발생 시 하나만 갱신 요청
// ============================================
let isRefreshing = false;
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * 토큰 갱신 대기 큐에 콜백 추가
 * @returns Promise<string> 새 토큰
 */
const subscribeTokenRefresh = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
  });
};

/**
 * 토큰 갱신 완료 시 대기 중인 모든 요청에 새 토큰 전달
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

/**
 * 토큰 갱신 실패 시 대기 중인 모든 요청 거부
 */
const onTokenRefreshFailed = (error: Error) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

// Factory 초기화
export function initAxiosFactory(config: FactoryConfig) {
  factoryConfig = config;
}

/**
 * Axios Client Factory
 */
export class AxiosClientFactory {
  /**
   * 기본 요청 핸들러
   */
  private static defaultRequestHandler = async (config: RequestConfig): Promise<RequestConfig> => {
    return config;
  };

  /**
   * Axios 클라이언트 생성
   */
  static createClient(
    serviceConfig: AxiosConfig,
    customRequestHandler?: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig
  ): AxiosInstance {
    const axiosInstance = Axios.create({
      baseURL: `${serviceConfig.hostUrl || ''}${serviceConfig.basePath || ''}`,
      timeout: serviceConfig.timeout || 60000,
      ...serviceConfig,
    });

    // 요청 인터셉터
    axiosInstance.interceptors.request.use((config) => {
      config.headers = config.headers || {};

      // Access Token 추가
      if (factoryConfig) {
        const token = factoryConfig.getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // UUID 추가 (요청 추적용)
      config.headers['X-Request-ID'] = uuid();

      // 빈 값 필터링
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
        customRequestHandler(config as RequestConfig);
      }

      return config;
    });

    // 응답 인터셉터
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        const silentCodes = factoryConfig?.silentStatusCodes || [];

        // ============================================
        // 네트워크 에러 처리
        // ============================================
        if (error.message === 'Network Error' || !error.response) {
          console.error('[Network Error] 네트워크 연결을 확인해주세요.');

          if (factoryConfig?.onHttpError) {
            factoryConfig.onHttpError({
              status: 0,
              message: NETWORK_ERROR_MESSAGE.message,
              title: NETWORK_ERROR_MESSAGE.title,
              type: NETWORK_ERROR_MESSAGE.type,
              error,
            });
          }

          return Promise.reject(error);
        }

        // ============================================
        // 401 에러 - 토큰 갱신 시도
        // ============================================
        if (status === 401 && factoryConfig?.refreshToken) {
          const originalRequest = error.config;

          // refresh 엔드포인트 자체의 401은 처리하지 않음
          if (originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
          }

          // 이미 재시도한 요청은 처리하지 않음
          if (originalRequest._isRetry) {
            return Promise.reject(error);
          }

          // 토큰 갱신 중이면 대기 큐에 추가
          if (isRefreshing) {
            try {
              const newToken = await subscribeTokenRefresh();
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              originalRequest._isRetry = true;
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }

          // 첫 번째 401 요청: 토큰 갱신 수행
          originalRequest._isRetry = true;
          isRefreshing = true;

          try {
            const newToken = await factoryConfig.refreshToken();

            if (newToken) {
              factoryConfig.setAccessToken(newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              console.log('[Token Refresh] 토큰이 갱신되었습니다.');

              // 대기 중인 모든 요청에 새 토큰 전달
              onTokenRefreshed(newToken);

              return axiosInstance(originalRequest);
            } else {
              // 토큰 갱신 실패 (null 반환)
              throw new Error('Token refresh returned null');
            }
          } catch (refreshError) {
            console.error('[Token Refresh Failed]', refreshError);
            onTokenRefreshFailed(refreshError as Error);
            factoryConfig.setAccessToken('');
            factoryConfig.onUnauthorized?.();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // ============================================
        // HTTP 상태 코드별 에러 처리
        // ============================================
        if (status && !silentCodes.includes(status)) {
          // API 에러 상세 정보 처리
          if (isApiError(error)) {
            const errorDetails = hasErrorDetails(error);
            if (errorDetails && factoryConfig?.onError) {
              factoryConfig.onError(errorDetails);
            }
          }

          // HTTP 에러 핸들러 호출
          if (factoryConfig?.onHttpError) {
            const errorConfig = HTTP_ERROR_MESSAGES[status] || {
              message: `알 수 없는 오류가 발생했습니다. (${status})`,
              title: '오류',
              type: 'toast' as HttpErrorType,
            };

            // 401은 토큰 갱신 실패 후에만 표시 (위에서 이미 처리됨)
            if (status !== 401) {
              // 서버 응답에 메시지가 있으면 우선 사용
              const serverMessage = error.response?.data?.message;
              const finalMessage = serverMessage || errorConfig.message;

              factoryConfig.onHttpError({
                status,
                message: finalMessage,
                title: errorConfig.title,
                type: errorConfig.type,
                error,
              });
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }
}