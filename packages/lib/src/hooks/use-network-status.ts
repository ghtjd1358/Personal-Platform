import { useEffect, useState } from 'react';

interface NetworkInformation {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
  readonly downlinkMax?: number;
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  onchange?: () => void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

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
const useNetworkStatus = (): NetworkStatus => {
  const getConnectionType = (): ConnectionType => {
    if ('connection' in navigator) {
      const nav = navigator as NavigatorWithConnection;
      if (nav.connection?.effectiveType) {
        return nav.connection.effectiveType;
      }
    }
    return 'unknown';
  };

  const [connectionType, setConnectionType] = useState<ConnectionType>(getConnectionType());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Network Information API
    if ('connection' in navigator) {
      const nav = navigator as NavigatorWithConnection;

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