import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 로컬 비동기 상태 hook — `{ data, isLoading, error, execute, reset }`.
 *
 * 컴포넌트별 spinner / 에러 표시 전용. **전역 로딩은 `useGlobalLoading` 사용**.
 *
 * arg 가 필요한 경우 closure 로 흡수 — generic arg 보다 type 단순 + 의존성 명시적.
 * unmount 후 setState 호출 가드 (`mountedRef`).
 *
 * @example  자동 fetch
 * const { data, isLoading, error, execute } = useAsyncState(
 *   useCallback(() => getMyPortfolios(currentUser.id), [currentUser?.id]),
 *   { initialData: [], autoExecute: true },
 * );
 *
 * @example  submit / mutation
 * const { isLoading: saving, error, execute: save } = useAsyncState(
 *   useCallback(() => updateProfile(profileId, formData), [profileId, formData]),
 * );
 * <button onClick={save} disabled={saving}>저장</button>
 */
export interface UseAsyncStateOptions<T> {
  /** 초기 data 값 */
  initialData?: T;
  /** mount 시 자동 execute */
  autoExecute?: boolean;
}

export interface UseAsyncStateReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: () => Promise<T | null>;
  reset: () => void;
}

export function useAsyncState<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncStateOptions<T> = {},
): UseAsyncStateReturn<T> {
  const { initialData = null, autoExecute = false } = options;
  const [data, setData] = useState<T | null>(initialData as T | null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // unmount 후 setState noise 방어
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (mountedRef.current) setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      if (mountedRef.current) setError(err);
      return null;
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [asyncFn]);

  const reset = useCallback(() => {
    setData(initialData as T | null);
    setIsLoading(false);
    setError(null);
  }, [initialData]);

  useEffect(() => {
    if (autoExecute) void execute();
    // autoExecute 는 mount-only — execute 가 deps 로 들어가면 asyncFn 변경 시마다 재실행되어 의도와 다름.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading, error, execute, reset };
}
