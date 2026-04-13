import React, { ReactNode, useEffect, useState } from 'react';
import useNetworkStatus from '../../hooks/use-network-status';

interface DeferredComponentProps {
  children: ReactNode;
  /** 지연 시간 (ms), 기본값 200ms */
  delay?: number;
}

/**
 * 지연된 렌더링 컴포넌트
 * - 느린 네트워크: 즉시 children 렌더링
 * - 빠른 네트워크: delay ms 후 children 렌더링
 *
 * 사용 예:
 * <Suspense fallback={<DeferredComponent><Skeleton /></DeferredComponent>}>
 *   <AsyncComponent />
 * </Suspense>
 */
const DeferredComponent: React.FC<DeferredComponentProps> = ({
  children,
  delay = 200
}) => {
  const { isSlowNetwork } = useNetworkStatus();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // 느린 네트워크면 즉시 표시
    if (isSlowNetwork) {
      setShouldRender(true);
      return;
    }

    // 빠른 네트워크면 delay 후 표시
    const timeoutId = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isSlowNetwork, delay]);

  if (!shouldRender) return null;

  return <>{children}</>;
};

export default DeferredComponent;