import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _isRetry?: boolean;
  }
}

// 하위 호환성 — 기존 소비처(supabase-axios.ts 등)가 RequestConfig를 참조함
export type RequestConfig = InternalAxiosRequestConfig;
export type Response<ResData> = AxiosResponse<ResData>;

export interface AxiosConfig extends AxiosRequestConfig {
  hostUrl?: string;
  basePath?: string;
}

export type ErrorDetailCodeType = 'TYPE_MISMATCH' | 'NotBlank' | 'NotNull' | 'Pattern' | 'Min' | 'Max' | 'Size';

export interface ErrorDetail {
  code: ErrorDetailCodeType;
  field?: string;
  message?: string;
}

export interface ApiErrorResponse {
  code: string;
  statusCode: number;
  timestamp: string;
  message?: string;
  errorDetails?: ErrorDetail[];
}

export interface ExtendedAxiosError extends AxiosError {
  response?: AxiosResponse<ApiErrorResponse>;
}

export function isApiError(error: unknown): error is ExtendedAxiosError {
  if (!isAxiosError(error)) return false;
  const data = error.response?.data as ApiErrorResponse | undefined;
  return data?.code !== undefined && data?.statusCode !== undefined;
}

export function hasErrorDetails(error: unknown): ErrorDetail[] | undefined {
  if (isApiError(error) && error.response?.data?.errorDetails?.length) {
    return error.response.data.errorDetails;
  }
  return undefined;
}

export function isAxiosError(error: unknown): error is AxiosError {
  if (!error || typeof error !== 'object') return false;
  return Boolean((error as AxiosError).isAxiosError);
}

export interface ServiceConfig {
  hostUrl: string;
  basePath?: string;
  timeout?: number;
}

export type RefreshTokenFn = () => Promise<string | null>;
export type DispatchErrorFn = (errorDetails: ErrorDetail[]) => void;

export interface FactoryConfig {
  getAccessToken: () => string;
  setAccessToken: (token: string) => void;
  refreshToken?: RefreshTokenFn;
  onError?: DispatchErrorFn;
  onUnauthorized?: () => void;
}

// Webpack MF shared: { singleton: true } 로 lib이 1회만 로드됨 → 모듈 레벨 변수로 충분
let _factoryConfig: FactoryConfig | null = null;

export function initAxiosFactory(config: FactoryConfig) {
  _factoryConfig = config;
}

export class AxiosClientFactory {
  static createClient(
    serviceConfig: AxiosConfig,
    customRequestHandler?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig
  ): AxiosInstance {
    const { hostUrl: _h, basePath: _b, ...axiosRest } = serviceConfig;
    const axiosInstance = Axios.create({
      ...axiosRest,
      baseURL: `${serviceConfig.hostUrl || ''}${serviceConfig.basePath || ''}`,
      timeout: serviceConfig.timeout || 60000,
    });

    // 요청 인터셉터 — 토큰 주입, 요청 ID, 빈 파라미터 제거
    axiosInstance.interceptors.request.use(async (config) => {
      const fc = _factoryConfig;
      if (fc) {
        const token = fc.getAccessToken();
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
      }

      if (!config.headers.has('X-Request-ID')) {
        config.headers.set('X-Request-ID', uuid());
      }

      if (config.params) {
        config.params = Object.entries(config.params as Record<string, unknown>).reduce(
          (acc, [key, value]) => {
            if (value !== '' && value != null) acc[key] = value;
            return acc;
          },
          {} as Record<string, unknown>
        );
      }

      return customRequestHandler ? await customRequestHandler(config) : config;
    });

    // 응답 인터셉터 — 401 시 토큰 갱신 후 재시도 (KOMCA _isRetry 패턴)
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (Axios.isCancel(error) || error.code === 'ERR_CANCELED') return Promise.reject(error);
        if (error.message === 'Network Error' || !error.response) {
          console.error('[Network Error] 네트워크 연결을 확인해주세요.');
          return Promise.reject(error);
        }

        const fc = _factoryConfig;
        const originalRequest = error.config!;
        const status = error.response?.status;

        if (
          status === 401 &&
          fc?.refreshToken &&
          !originalRequest._isRetry &&
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          try {
            originalRequest._isRetry = true;
            const newToken = await fc.refreshToken();

            if (newToken) {
              fc.setAccessToken(newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            }

            fc.setAccessToken('');
            fc.onUnauthorized?.();
          } catch (refreshError) {
            console.error('[Token Refresh] failed:', refreshError);
            fc.setAccessToken('');
            fc.onUnauthorized?.();
          }
          return Promise.reject(error);
        }

        if (isApiError(error)) {
          const details = hasErrorDetails(error);
          if (details) fc?.onError?.(details);
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }
}
