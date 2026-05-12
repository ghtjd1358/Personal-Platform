/**
 * Global Loading Hook — KOMCA 패턴 포팅 + silent 옵션.
 *
 * 내부 구현: `react-promise-tracker` 의 `trackPromise` 로 중첩 호출 counter 를 라이브러리가
 * 자동 관리. 여러 promise 가 동시에 진행중이면 **마지막 하나가 끝나야** 로딩이 꺼짐.
 * 기존 Redux boolean 방식의 조기 해제 버그 원천 차단.
 *
 * + `withTimeout(promise, 10s)` 로 서버 hang 방어 — 10초 초과 시 자동 reject.
 * + title 은 Redux 에 dispatch (기존 호환). 스피너 on/off 는 Redux 관여 X.
 *
 * ## 시그니처
 *   - `useShowGlobalLoading()(promise)`                    — 기본: GLOBAL spinner 뜸
 *   - `useShowGlobalLoading()(promise, '저장 중...')`       — title 세팅 + spinner 뜸 (string 기존 호환)
 *   - `useShowGlobalLoading()(promise, { silent: true })`  — spinner **skip** (skeleton 쓰는 리스트 훅 용)
 *   - `useShowGlobalLoading()(promise, { title, silent })` — 둘 다 제어
 *
 * silent 옵션은 카드 리스트처럼 자체 skeleton UI 가 있는 fetch 에서 사용 —
 * 글로벌 overlay 와 섹션 skeleton 이 같이 깜빡이는 이중 로딩을 막기 위함.
 */
export declare const LOADING_AREA_GLOBAL = "GLOBAL";
export interface ShowLoadingOptions {
    /** 로딩 중 표시할 타이틀. Redux `state.app.globalLoadingTitle` 로 dispatch. */
    title?: string;
    /** true 면 `trackPromise` 를 건너뛰어 GLOBAL 스피너가 뜨지 않음 — skeleton 전용 경로에서 사용. */
    silent?: boolean;
}
export declare function useShowGlobalLoading(): <T>(promise: Promise<T>, titleOrOptions?: string | ShowLoadingOptions) => Promise<T>;
//# sourceMappingURL=use-global-loading.d.ts.map