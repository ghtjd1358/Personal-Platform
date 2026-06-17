import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _isRetry?: boolean;
  }
}

export type RequestConfig = InternalAxiosRequestConfig;
export type Response<ResData> = AxiosResponse<ResData>;

export interface AxiosConfig extends AxiosRequestConfig {
  hostUrl?: string;
  basePath?: string;
}

export interface ErrorDetail {
  code: string;
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

export const isAxiosError = Axios.isAxiosError;

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

export type RefreshTokenFn = () => Promise<string | null>;
export type DispatchErrorFn = (errorDetails: ErrorDetail[]) => void;

export interface FactoryConfig {
  getAccessToken: () => string;
  setAccessToken: (token: string) => void;
  refreshToken?: RefreshTokenFn;
  onError?: DispatchErrorFn;
  onUnauthorized?: () => void;
}

let _factoryConfig: FactoryConfig | null = null;
// concurrent 401 직렬화: 동시 401이 N개여도 refresh는 1번만
let _pendingRefresh: Promise<string | null> | null = null;
// refresh 실패 후 onUnauthorized 중복 호출 방지 — setAccessToken('') 시 리셋
let _unauthorizedFired = false;

export function initAxiosFactory(config: FactoryConfig) {
  const originalSetAccessToken = config.setAccessToken;
  _factoryConfig = {
    ...config,
    // truthy 토큰이 들어올 때 guard 리셋 — 재로그인 후 다음 401 사이클에서 onUnauthorized 재발동 가능
    setAccessToken: (token: string) => {
      if (token) _unauthorizedFired = false;
      originalSetAccessToken(token);
    },
  };
  _unauthorizedFired = false;
}

export class AxiosClientFactory {
  static createClient(
    serviceConfig: AxiosConfig,
    customRequestHandler?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig
  ): AxiosInstance {
    const { hostUrl, basePath, timeout, ...rest } = serviceConfig;
    const axiosInstance = Axios.create({
      ...rest,
      baseURL: `${hostUrl ?? ''}${basePath ?? ''}`,
      timeout: timeout ?? 60000,
    });

    axiosInstance.interceptors.request.use(async (config) => {
      const fc = _factoryConfig;
      if (fc) {
        const token = fc.getAccessToken();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (!config.headers['X-Request-ID']) {
        config.headers['X-Request-ID'] = uuid();
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

    // 401 시 한 번만 refresh → 원요청 재시도. _isRetry 플래그로 무한 루프 방지
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (Axios.isCancel(error) || error.code === 'ERR_CANCELED') return Promise.reject(error);
        if (error.message === 'Network Error' || !error.response) {
          console.error('[Network Error] 네트워크 연결을 확인해주세요.');
          return Promise.reject(error);
        }

        const fc = _factoryConfig;
        const originalRequest = error.config;
        const status = error.response?.status;

        if (
          status === 401 &&
          fc?.refreshToken &&
          originalRequest &&
          !originalRequest._isRetry &&
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          originalRequest._isRetry = true;
          try {
            if (!_pendingRefresh) {
              _pendingRefresh = fc.refreshToken().finally(() => { _pendingRefresh = null; });
            }
            const newToken = await _pendingRefresh;

            if (newToken) {
              fc.setAccessToken(newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            }

            if (!_unauthorizedFired) {
              _unauthorizedFired = true;
              fc.setAccessToken('');
              fc.onUnauthorized?.();
            }
          } catch (refreshError) {
            console.error('[Token Refresh] failed:', refreshError);
            if (!_unauthorizedFired) {
              _unauthorizedFired = true;
              fc.setAccessToken('');
              fc.onUnauthorized?.();
            }
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
