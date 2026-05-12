/**
 * GlobalLoading — Editorial global loading overlay (KOMCA 패턴 포팅).
 *
 * 구독 대상: `react-promise-tracker` 의 `usePromiseTracker({ area: 'GLOBAL' })`.
 * `useShowGlobalLoading()(promise)` 로 감싼 promise 가 진행중이면 true 가 됨.
 * 중첩 호출 counter 는 라이브러리가 자동 관리 → 마지막 promise 해제 시에만 꺼짐.
 *
 * + **500ms debounce on hide** — 연속 API 호출 시 스피너 깜빡임 방지 (KOMCA home-front 패턴).
 * + title 은 Redux state.app.globalLoadingTitle 에서 읽어와 표시.
 * + Host 모드에선 isHostApp gate 로 자동 null (이중 overlay 방지).
 *   host 자신이 마운트할 때만 `force` prop 으로 gate 우회.
 */
import React from 'react';
interface GlobalLoadingProps {
    /** 커스텀 로딩 메시지 */
    message?: string;
    /** Host 가 직접 마운트할 때 사용 — isHostApp gate 우회 */
    force?: boolean;
}
declare const GlobalLoading: React.FC<GlobalLoadingProps>;
export default GlobalLoading;
//# sourceMappingURL=GlobalLoading.d.ts.map