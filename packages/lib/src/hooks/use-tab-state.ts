import { useCallback, useState } from 'react';

/**
 * 탭/세그먼트 상태 hook — typed wrapper + invalid value 거부.
 *
 * 단순한 `useState<T>(initial)` 위에 옵션 2개를 얹음:
 *  - `validTabs`: 외부 (URL query, localStorage 복원) 에서 잘못된 값 들어와도 거부 → UI 깨짐 방어
 *  - `onChange`: analytics 등 부수 효과 hook
 *
 * @example  단순 사용
 * const { activeTab, setActiveTab } = useTabState<'posts' | 'series'>('posts');
 *
 * @example  유효성 검증 + 콜백
 * const { activeTab, setActiveTab } = useTabState<TabType>('info', {
 *   validTabs: ['info', 'posts'] as const,
 *   onChange: (t) => analytics.track('tab_change', { tab: t }),
 * });
 */
export interface UseTabStateOptions<T extends string> {
  /** 허용 tab 목록 — 외부 invalid 값 set 시도 시 무시 */
  validTabs?: readonly T[];
  /** 탭 변경 콜백 */
  onChange?: (tab: T) => void;
}

export interface UseTabStateReturn<T extends string> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  /** initialTab 으로 복귀 */
  reset: () => void;
}

export function useTabState<T extends string>(
  initialTab: T,
  options?: UseTabStateOptions<T>,
): UseTabStateReturn<T> {
  const { validTabs, onChange } = options ?? {};
  const [activeTab, setActiveTabState] = useState<T>(initialTab);

  const setActiveTab = useCallback(
    (tab: T) => {
      if (validTabs && !validTabs.includes(tab)) return;
      setActiveTabState(tab);
      onChange?.(tab);
    },
    [validTabs, onChange],
  );

  const reset = useCallback(() => setActiveTabState(initialTab), [initialTab]);

  return { activeTab, setActiveTab, reset };
}
