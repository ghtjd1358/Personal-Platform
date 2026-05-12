/**
 * useEffectOnce Hook
 * 조건이 충족되면 한 번만 실행되는 useEffect
 * KOMCA 패턴 업그레이드 버전
 */
import { DependencyList } from 'react';
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
export declare function useEffectOnce(effect: () => (() => void) | void, ready?: boolean): void;
/**
 * useMount
 * 컴포넌트 마운트 시 한 번만 실행
 *
 * @example
 * useMount(() => {
 *   analytics.pageView();
 * });
 */
export declare function useMount(effect: () => (() => void) | void): void;
/**
 * useUnmount
 * 컴포넌트 언마운트 시 실행
 *
 * @example
 * useUnmount(() => {
 *   cleanup();
 * });
 */
export declare function useUnmount(cleanup: () => void): void;
/**
 * useUpdateEffect
 * 첫 렌더링을 제외하고 deps가 변경될 때만 실행
 *
 * @example
 * useUpdateEffect(() => {
 *   console.log('count가 변경됨 (첫 렌더링 제외)');
 * }, [count]);
 */
export declare function useUpdateEffect(effect: () => (() => void) | void, deps: DependencyList): void;
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
export declare function useIsFirstRender(): boolean;
/**
 * usePrevious
 * 이전 값 반환
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * // count: 5, prevCount: 4
 */
export declare function usePrevious<T>(value: T): T | undefined;
export default useEffectOnce;
//# sourceMappingURL=use-effect-once.d.ts.map