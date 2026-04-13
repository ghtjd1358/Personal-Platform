/**
 * 스크롤 복원 Hook
 * 페이지 이동 시 스크롤 위치를 저장하고 복원
 */
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// 스크롤 위치 저장소
const scrollPositions = new Map<string, number>();

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
export function useScrollRestoration(options: ScrollRestorationOptions = {}) {
  const {
    enabled = true,
    behavior = 'auto',
    scrollToTopOnNewPage = true,
    excludePaths = [],
    scrollElement = null,
  } = options;

  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const isRestoringRef = useRef(false);

  // 스크롤 위치 가져오기
  const getScrollPosition = useCallback(() => {
    if (scrollElement) {
      return scrollElement.scrollTop;
    }
    return window.scrollY || document.documentElement.scrollTop;
  }, [scrollElement]);

  // 스크롤 위치 설정
  const setScrollPosition = useCallback((position: number) => {
    if (scrollElement) {
      scrollElement.scrollTo({ top: position, behavior });
    } else {
      window.scrollTo({ top: position, behavior });
    }
  }, [scrollElement, behavior]);

  // 현재 경로의 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    const path = location.pathname + location.search;
    const position = getScrollPosition();
    scrollPositions.set(path, position);
  }, [location.pathname, location.search, getScrollPosition]);

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    const path = location.pathname + location.search;
    const savedPosition = scrollPositions.get(path);

    if (savedPosition !== undefined) {
      // 약간의 딜레이를 두고 복원 (DOM 렌더링 대기)
      requestAnimationFrame(() => {
        isRestoringRef.current = true;
        setScrollPosition(savedPosition);
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
      });
      return true;
    }
    return false;
  }, [location.pathname, location.search, setScrollPosition]);

  // 상단으로 스크롤
  const scrollToTop = useCallback(() => {
    setScrollPosition(0);
  }, [setScrollPosition]);

  // 페이지 이동 감지 및 스크롤 처리
  useEffect(() => {
    if (!enabled) return;

    const currentPath = location.pathname + location.search;
    const prevPath = prevPathRef.current;

    // 제외 경로인 경우 무시
    if (excludePaths.some(path => location.pathname.startsWith(path))) {
      prevPathRef.current = currentPath;
      return;
    }

    // 이전 페이지 스크롤 위치 저장
    if (prevPath && prevPath !== currentPath) {
      const prevPosition = getScrollPosition();
      scrollPositions.set(prevPath, prevPosition);
    }

    // 스크롤 복원 또는 상단 이동
    const restored = restoreScrollPosition();

    if (!restored && scrollToTopOnNewPage && prevPath !== currentPath) {
      scrollToTop();
    }

    prevPathRef.current = currentPath;
  }, [
    enabled,
    location.pathname,
    location.search,
    excludePaths,
    getScrollPosition,
    restoreScrollPosition,
    scrollToTop,
    scrollToTopOnNewPage,
  ]);

  // 페이지 이탈 시 스크롤 위치 저장
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, saveScrollPosition]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTop,
    clearScrollPositions: () => scrollPositions.clear(),
  };
}

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
export function useScrollToTop(options: { behavior?: ScrollBehavior } = {}) {
  const { behavior = 'auto' } = options;
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [location.pathname, behavior]);
}

export default useScrollRestoration;
