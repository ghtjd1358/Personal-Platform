import { AxiosClientFactory } from './axios-factory';
export declare function initApiClient(options?: {
    onUnauthorized?: () => void;
}): void;
type AxiosClientInstance = ReturnType<typeof AxiosClientFactory.createClient>;
export declare function getApiClient(): AxiosClientInstance;
export {};
//# sourceMappingURL=api-client.d.ts.map