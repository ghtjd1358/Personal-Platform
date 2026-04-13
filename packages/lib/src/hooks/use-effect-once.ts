/**
 * useEffectOnce Hook
 * 조건이 충족되면 한 번만 실행되는 useEffect
 * KOMCA 패턴 업그레이드 버전
 */
import { useEffect, useRef, useCallback, DependencyList } from 'react';

/**
 * useEffectOnce
 * ready 조건이 true가 되면 한 번만 실행
 *
 * @example
 * // 기본 사용
 * useEffectOnce(() => {
 *   console.log('한 번만 실행');
 * }, isLoaded);
 *
 * @example
 * // cleanup 함수 포함
 * useEffectOnce(() => {
 *   const subscription = subscribe();
 *   return () => subscription.unsubscribe();
 * }, isReady);
 */
export function useEffectOnce(
  effect: () => (() => void) | void,
  ready: boolean = true
): void {
  const hasRun = useRef(false);
  const cleanupRef = useRef<(() => void) | void>(undefined);
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    if (hasRun.current || !ready) {
      return;
    }

    hasRun.current = true;
    cleanupRef.current = effectRef.current();

    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, [ready]);
}

/**
 * useMount
 * 컴포넌트 마운트 시 한 번만 실행
 *
 * @example
 * useMount(() => {
 *   analytics.pageView();
 * });
 */
export function useMount(effect: () => (() => void) | void): void {
  useEffectOnce(effect, true);
}

/**
 * useUnmount
 * 컴포넌트 언마운트 시 실행
 *
 * @example
 * useUnmount(() => {
 *   cleanup();
 * });
 */
export function useUnmount(cleanup: () => void): void {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  useEffect(() => {
    return () => cleanupRef.current();
  }, []);
}

/**
 * useUpdateEffect
 * 첫 렌더링을 제외하고 deps가 변경될 때만 실행
 *
 * @example
 * useUpdateEffect(() => {
 *   console.log('count가 변경됨 (첫 렌더링 제외)');
 * }, [count]);
 */
export function useUpdateEffect(
  effect: () => (() => void) | void,
  deps: DependencyList
): void {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * useIsFirstRender
 * 첫 렌더링인지 여부 반환
 *
 * @example
 * const isFirstRender = useIsFirstRender();
 * if (isFirstRender) {
 *   // 첫 렌더링 시에만 실행
 * }
 */
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
}

/**
 * usePrevious
 * 이전 값 반환
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * // count: 5, prevCount: 4
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default useEffectOnce;
