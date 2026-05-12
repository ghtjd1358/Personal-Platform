import React, { ReactNode } from 'react';
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
declare const DeferredComponent: React.FC<DeferredComponentProps>;
export default DeferredComponent;
//# sourceMappingURL=DeferredComponent.d.ts.map