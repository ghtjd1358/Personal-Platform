/**
 * Node.js API Client
 * - baseURL: REACT_APP_API_URL (개발: http://localhost:4000/api)
 * - Authorization: Bearer {accessToken} (Redux store에서 주입)
 * - 401 → /api/auth/refresh → retry (AxiosClientFactory 내장)
 */
export declare function initApiClient(options?: {
    onUnauthorized?: () => void;
}): void;
/** 모든 remote에서 공유하는 Node.js API Axios 인스턴스 (initApiClient() 이후 사용 가능) */
export declare const apiClient: import("axios").AxiosInstance;
//# sourceMappingURL=api-client.d.ts.map