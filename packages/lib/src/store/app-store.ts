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

import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import { InjectReducerFn } from '../types';
import { appSlice } from './app-slice';
import menuReducer from './menu-slice';
import recentMenuReducer from './recent-menu-slice';

// 이전 import 경로 (`./app-store` 직접 import) 안정성 유지를 위한 re-export.
// 슬라이스 정의는 ./app-slice, 파생 셀렉터는 ./app-selectors 가 단일 출처.
export * from './app-slice';
export * from './app-selectors';

// ============================================
// Root Reducer (정적 + 동적)
// ============================================
const staticReducers = {
    app: appSlice.reducer,
    menu: menuReducer,
    recentMenu: recentMenuReducer,
};

let dynamicReducers: Record<string, Reducer> = {};

const createRootReducer = () => combineReducers({
    ...staticReducers,
    ...dynamicReducers,
});

// ============================================
// Store 인스턴스 (싱글톤)
// ============================================
export const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

/**
 * Store 가져오기
 * - Host App: 자신의 store 반환
 * - Remote (in Host): window.__REDUX_STORE__ 반환
 * - Remote (standalone): 자신의 store 반환
 */
export const getStore = () => {
    if (storage.isHostApp() && window.__REDUX_STORE__) return window.__REDUX_STORE__;
    if (window.__REDUX_STORE__) return window.__REDUX_STORE__;
    return store;
};

/**
 * 동적 Reducer 주입 — lib 가 singleton 이라 store 도 1개. 항상 module-local store 에 주입.
 */
export const injectReducer = (key: string, reducer: Reducer) => {
    if (dynamicReducers[key]) return;
    dynamicReducers[key] = reducer;
    store.replaceReducer(createRootReducer());
};

/**
 * Store 를 전역에 노출 (Host App 전용)
 */
export const exposeStore = (s: typeof store) => {
    storage.setHostApp();
    window.__REDUX_STORE__ = s;
};

/**
 * @deprecated `store` 인스턴스를 직접 사용
 */
export const createAppStore = () => store;

// ============================================
// 타입 export — typeof store 로 실제 store 와 100% 정합
// ============================================
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
