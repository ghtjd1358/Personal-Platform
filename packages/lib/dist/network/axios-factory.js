import Axios from 'axios';
import { v4 as uuid } from 'uuid';
export const isAxiosError = Axios.isAxiosError;
export function isApiError(error) {
    if (!isAxiosError(error))
        return false;
    const data = error.response?.data;
    return data?.code !== undefined && data?.statusCode !== undefined;
}
export function hasErrorDetails(error) {
    if (isApiError(error) && error.response?.data?.errorDetails?.length) {
        return error.response.data.errorDetails;
    }
    return undefined;
}
// 모듈 싱글톤 — MF shared singleton 가정
let _factoryConfig = null;
// concurrent 401 refresh 직렬화 — 동시 401 시 하나만 refresh 하고 나머지는 결과 대기
let _pendingRefresh = null;
export function initAxiosFactory(config) {
    _factoryConfig = config;
}
export class AxiosClientFactory {
    static createClient(serviceConfig, customRequestHandler) {
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
                if (token)
                    config.headers['Authorization'] = `Bearer ${token}`;
            }
            if (!config.headers['X-Request-ID']) {
                config.headers['X-Request-ID'] = uuid();
            }
            if (config.params) {
                config.params = Object.entries(config.params).reduce((acc, [key, value]) => {
                    if (value !== '' && value != null)
                        acc[key] = value;
                    return acc;
                }, {});
            }
            return customRequestHandler ? await customRequestHandler(config) : config;
        });
        // 401 시 한 번만 refresh → 원요청 재시도. _isRetry 플래그로 무한 루프 방지
        axiosInstance.interceptors.response.use((response) => response, async (error) => {
            if (Axios.isCancel(error) || error.code === 'ERR_CANCELED')
                return Promise.reject(error);
            if (error.message === 'Network Error' || !error.response) {
                console.error('[Network Error] 네트워크 연결을 확인해주세요.');
                return Promise.reject(error);
            }
            const fc = _factoryConfig;
            const originalRequest = error.config;
            const status = error.response?.status;
            if (status === 401 &&
                fc?.refreshToken &&
                originalRequest &&
                !originalRequest._isRetry &&
                !originalRequest.url?.includes('/auth/refresh')) {
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
                    fc.setAccessToken('');
                    fc.onUnauthorized?.();
                }
                catch (refreshError) {
                    console.error('[Token Refresh] failed:', refreshError);
                    fc.setAccessToken('');
                    fc.onUnauthorized?.();
                }
                return Promise.reject(error);
            }
            if (isApiError(error)) {
                const details = hasErrorDetails(error);
                if (details)
                    fc?.onError?.(details);
            }
            return Promise.reject(error);
        });
        return axiosInstance;
    }
}
