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

import { useCallback } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { getHostStore } from '../store/store-access';

const API_TIMEOUT_MS = 10_000;

export const LOADING_AREA_GLOBAL = 'GLOBAL';

export interface ShowLoadingOptions {
    /** 로딩 중 표시할 타이틀. Redux `state.app.globalLoadingTitle` 로 dispatch. */
    title?: string;
    /** true 면 `trackPromise` 를 건너뛰어 GLOBAL 스피너가 뜨지 않음 — skeleton 전용 경로에서 사용. */
    silent?: boolean;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => {
            setTimeout(() => {
                reject(new Error('네트워크 요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.'));
            }, timeoutMs);
        }),
    ]);
}

export function useShowGlobalLoading() {
    return useCallback(<T>(
        promise: Promise<T>,
        titleOrOptions?: string | ShowLoadingOptions,
    ): Promise<T> => {
        const { title, silent } = typeof titleOrOptions === 'string'
            ? { title: titleOrOptions, silent: false }
            : { title: titleOrOptions?.title, silent: titleOrOptions?.silent ?? false };

        const timed = withTimeout(promise, API_TIMEOUT_MS);

        if (silent) {
            // trackPromise 생략 → GLOBAL spinner 안 뜸. timeout 만 적용.
            return timed;
        }

        const store = getHostStore();
        if (store && title) {
            store.dispatch({
                type: 'app/setGlobalLoadingTitle',
                payload: title,
            });
        }

        return trackPromise<T>(timed, LOADING_AREA_GLOBAL).finally(() => {
            if (store && title) {
                store.dispatch({
                    type: 'app/setGlobalLoadingTitle',
                    payload: '',
                });
            }
        });
    }, []);
}
