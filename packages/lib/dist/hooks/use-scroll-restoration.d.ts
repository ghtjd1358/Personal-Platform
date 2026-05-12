export interface ScrollRestorationOptions {
    /** 스크롤 복원 활성화 여부 */
    enabled?: boolean;
    /** 스크롤 복원 동작 */
    behavior?: ScrollBehavior;
    /** 새 페이지 진입 시 상단으로 스크롤 */
    scrollToTopOnNewPage?: boolean;
    /** 스크롤 복원 제외 경로 */
    excludePaths?: string[];
    /** 스크롤 대상 요소 (기본: window) */
    scrollElement?: HTMLElement | null;
}
/**
 * useScrollRestoration
 * 페이지 이동 시 스크롤 위치를 자동으로 저장하고 복원
 *
 * @example
 * function App() {
 *   useScrollRestoration();
 *   return <Routes>...</Routes>;
 * }
 *
 * @example
 * // 커스텀 설정
 * useScrollRestoration({
 *   behavior: 'smooth',
 *   excludePaths: ['/modal'],
 *   scrollToTopOnNewPage: true,
 * });
 */
export declare function useScrollRestoration(options?: ScrollRestorationOptions): {
    saveScrollPosition: () => void;
    restoreScrollPosition: () => boolean;
    scrollToTop: () => void;
    clearScrollPositions: () => void;
};
/**
 * useScrollToTop
 * 페이지 이동 시 항상 상단으로 스크롤
 *
 * @example
 * function App() {
 *   useScrollToTop();
 *   return <Routes>...</Routes>;
 * }
 */
export declare function useScrollToTop(options?: {
    behavior?: ScrollBehavior;
}): void;
export default useScrollRestoration;
//# sourceMappingURL=use-scroll-restoration.d.ts.map