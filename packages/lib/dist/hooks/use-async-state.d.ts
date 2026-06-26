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
export declare function useAsyncState<T>(asyncFn: () => Promise<T>, options?: UseAsyncStateOptions<T>): UseAsyncStateReturn<T>;
//# sourceMappingURL=use-async-state.d.ts.map