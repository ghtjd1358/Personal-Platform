/**
 * Node.js API Client
 * - baseURL: REACT_APP_API_URL (개발: http://localhost:4000/api)
 * - Authorization: Bearer {accessToken} (Redux store에서 주입)
 * - 401 → /api/auth/refresh → retry (AxiosClientFactory 내장)
 */
export declare function initApiClient(options?: {
    onUnauthorized?: () => void;
}): void;
export declare const apiClient: import("axios").AxiosInstance;
//# sourceMappingURL=api-client.d.ts.map