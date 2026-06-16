import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
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
export declare const isAxiosError: typeof import("axios").isAxiosError;
export declare function isApiError(error: unknown): error is ExtendedAxiosError;
export declare function hasErrorDetails(error: unknown): ErrorDetail[] | undefined;
export type RefreshTokenFn = () => Promise<string | null>;
export type DispatchErrorFn = (errorDetails: ErrorDetail[]) => void;
export interface FactoryConfig {
    getAccessToken: () => string;
    setAccessToken: (token: string) => void;
    refreshToken?: RefreshTokenFn;
    onError?: DispatchErrorFn;
    onUnauthorized?: () => void;
}
export declare function initAxiosFactory(config: FactoryConfig): void;
export declare class AxiosClientFactory {
    static createClient(serviceConfig: AxiosConfig, customRequestHandler?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig): AxiosInstance;
}
//# sourceMappingURL=axios-factory.d.ts.map