import { AxiosClientFactory } from './axios-factory';
export declare function initApiClient(options?: {
    onUnauthorized?: () => void;
}): void;
type AxiosClientInstance = ReturnType<typeof AxiosClientFactory.createClient>;
export declare function getApiClient(): AxiosClientInstance;
export declare const apiClient: import("axios").AxiosInstance;
export {};
//# sourceMappingURL=api-client.d.ts.map