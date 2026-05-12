import { useEffect, useState } from 'react';
/**
 * 사용자의 네트워크 상태를 감지하는 훅
 * - effectiveType: 연결 품질 (slow-2g, 2g, 3g, 4g)
 * - isSlowNetwork: 느린 네트워크 여부 (slow-2g, 2g, 3g)
 * - isOnline: 온라인 상태
 */
const useNetworkStatus = () => {
    const getConnectionType = () => {
        if ('connection' in navigator) {
            const nav = navigator;
            if (nav.connection?.effectiveType) {
                return nav.connection.effectiveType;
            }
        }
        return 'unknown';
    };
    const [connectionType, setConnectionType] = useState(getConnectionType());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        // Network Information API
        if ('connection' in navigator) {
            const nav = navigator;
            if (nav.connection) {
                const updateConnectionStatus = () => {
                    setConnectionType(nav.connection?.effectiveType || 'unknown');
                };
                nav.connection.addEventListener('change', updateConnectionStatus);
                return () => {
                    nav.connection?.removeEventListener('change', updateConnectionStatus);
                };
            }
        }
    }, []);
    useEffect(() => {
        // Online/Offline 상태
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(connectionType);
    return { connectionType, isSlowNetwork, isOnline };
};
export default useNetworkStatus;
