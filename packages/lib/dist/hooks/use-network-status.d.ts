export type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
interface NetworkStatus {
    connectionType: ConnectionType;
    isSlowNetwork: boolean;
    isOnline: boolean;
}
/**
 * 사용자의 네트워크 상태를 감지하는 훅
 * - effectiveType: 연결 품질 (slow-2g, 2g, 3g, 4g)
 * - isSlowNetwork: 느린 네트워크 여부 (slow-2g, 2g, 3g)
 * - isOnline: 온라인 상태
 */
declare const useNetworkStatus: () => NetworkStatus;
export default useNetworkStatus;
//# sourceMappingURL=use-network-status.d.ts.map