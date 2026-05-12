/**
 * App Store — Host/Remote 공용 Redux Store
 *
 * - Host: store 생성 → exposeStore 로 window.__REDUX_STORE__ 노출
 * - Remote (in Host): window.__REDUX_STORE__ 사용 (getStore() 가 처리)
 * - Remote (standalone): 자체 store 사용
 *
 * 슬라이스 정의는 ./app-slice.ts, 파생 셀렉터는 ./app-selectors.ts.
 * 이 파일은 **store 인스턴스 + 동적 reducer 주입 + Window 노출** 만 담당.
 */
import { Reducer } from '@reduxjs/toolkit';
import { InjectReducerFn } from '../types';
export * from './app-slice';
export * from './app-selectors';
export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    app: import("..").AppState;
    menu: import("./menu-slice").MenuState;
    recentMenu: import("./recent-menu-slice").RecentMenuState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        app: import("..").AppState;
        menu: import("./menu-slice").MenuState;
        recentMenu: import("./recent-menu-slice").RecentMenuState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
/**
 * Store 가져오기
 * - Host App: 자신의 store 반환
 * - Remote (in Host): window.__REDUX_STORE__ 반환
 * - Remote (standalone): 자신의 store 반환
 */
export declare const getStore: () => import("@reduxjs/toolkit").EnhancedStore<{
    app: import("..").AppState;
    menu: import("./menu-slice").MenuState;
    recentMenu: import("./recent-menu-slice").RecentMenuState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        app: import("..").AppState;
        menu: import("./menu-slice").MenuState;
        recentMenu: import("./recent-menu-slice").RecentMenuState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
/**
 * 동적 Reducer 주입 — lib 가 singleton 이라 store 도 1개. 항상 module-local store 에 주입.
 */
export declare const injectReducer: (key: string, reducer: Reducer) => void;
/**
 * Store 를 전역에 노출 (Host App 전용)
 */
export declare const exposeStore: (s: typeof store) => void;
/**
 * @deprecated `store` 인스턴스를 직접 사용
 */
export declare const createAppStore: () => import("@reduxjs/toolkit").EnhancedStore<{
    app: import("..").AppState;
    menu: import("./menu-slice").MenuState;
    recentMenu: import("./recent-menu-slice").RecentMenuState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        app: import("..").AppState;
        menu: import("./menu-slice").MenuState;
        recentMenu: import("./recent-menu-slice").RecentMenuState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type HostStore = typeof store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
declare global {
    interface Window {
        __REDUX_STORE__: typeof store;
        __INJECT_REDUCER__?: InjectReducerFn;
    }
}
//# sourceMappingURL=app-store.d.ts.map