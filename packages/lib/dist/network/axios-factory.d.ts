/**
 * Axios Factory
 * 401 에러시 자동 토큰 갱신 포함
 */
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export type RequestConfig = Omit<AxiosRequestConfig, 'headers'> & {
    headers: Record<string, string>;
    _isRetry?: boolean;
};
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
    errorDetails?: ErrorDetail[];
}
export interface ExtendedAxiosError extends AxiosError {
    response?: AxiosResponse<ApiErrorResponse>;
}
export declare function isApiError(error: unknown): error is ExtendedAxiosError;
export declare function hasErrorDetails(error: unknown): ErrorDetail[] | undefined;
export declare function isAxiosError(error: unknown): error is AxiosError;
export interface ServiceConfig {
    hostUrl: string;
    basePath?: string;
    timeout?: number;
}
export type RefreshTokenFn = () => Promise<string | null>;
export type DispatchErrorFn = (errorDetails: ErrorDetail[]) => void;
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
export declare const HTTP_ERROR_MESSAGES: Record<number, {
    message: string;
    title?: string;
    type: HttpErrorType;
}>;
/** 네트워크 에러 메시지 */
export declare const NETWORK_ERROR_MESSAGE: {
    message: string;
    title: string;
    type: HttpErrorType;
};
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
export declare function initAxiosFactory(config: FactoryConfig): void;
/**
 * Axios Client Factory
 */
export declare class AxiosClientFactory {
    /**
     * 기본 요청 핸들러
     */
    private static defaultRequestHandler;
    /**
     * Axios 클라이언트 생성
     */
    static createClient(serviceConfig: AxiosConfig, customRequestHandler?: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig): AxiosInstance;
}
//# sourceMappingURL=axios-factory.d.ts.map