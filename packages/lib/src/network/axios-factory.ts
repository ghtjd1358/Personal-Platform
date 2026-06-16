import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';
import { store } from '../store/app-store';
import { setAccessToken } from '../store/app-slice';

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
  refreshToken?: () => Promise<string | null>;
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

export class AxiosClientFactory {
  static createClient(
    serviceConfig: AxiosConfig,
    customRequestHandler?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig
  ): AxiosInstance {
    const { hostUrl: _h, basePath: _b, refreshToken, ...axiosRest } = serviceConfig;

    const axiosInstance = Axios.create({
      ...axiosRest,
      baseURL: `${serviceConfig.hostUrl || ''}${serviceConfig.basePath || ''}`,
      timeout: serviceConfig.timeout || 60000,
    });

    axiosInstance.interceptors.request.use(async (config) => {
      const token = store.getState().app.accessToken || '';

      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
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

      if (customRequestHandler) return await customRequestHandler(config);
      return config;
    });

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.message === 'Network Error') {
          console.error('[Network Error] 네트워크 연결을 확인해주세요.');
        }

        if (error.response?.status === 401) {
          if (error.config && !error.config._isRetry) {
            try {
              if (!error.config.url?.includes('/auth/refresh') && refreshToken) {
                error.config._isRetry = true;

                const newToken = await refreshToken();

                if (newToken) {
                  store.dispatch(setAccessToken(newToken));
                  error.config.headers['Authorization'] = `Bearer ${newToken}`;
                  return axiosInstance(error.config);
                }
              }
            } catch (refreshError) {
              console.error('[Token Refresh] failed:', refreshError);
              store.dispatch(setAccessToken(''));
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }
}
