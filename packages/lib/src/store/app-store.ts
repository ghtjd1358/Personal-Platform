import { configureStore, combineReducers, Reducer, Middleware } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import { InjectReducerFn } from '../types';
import { appSlice, logout } from './app-slice';
import menuReducer from './menu-slice';
import recentMenuReducer, { RecentMenuState } from './recent-menu-slice';

export * from './app-slice';
export * from './app-selectors';

const staticReducers = {
    app: appSlice.reducer,
    menu: menuReducer,
    recentMenu: recentMenuReducer,
};

const dynamicReducers: Record<string, Reducer> = {};

const createRootReducer = () => combineReducers({
    ...staticReducers,
    ...dynamicReducers,
});

// 로그아웃 시 localStorage의 인증 정보를 자동으로 삭제하는 미들웨어
const authMiddleware: Middleware = () => (next) => (action) => {
    const result = next(action);
    if (logout.match(action as ReturnType<typeof logout>)) {
        storage.clearAuth();
    }
    return result;
};

// 최근 메뉴 목록이 바뀔 때마다 localStorage에 자동 저장하는 미들웨어
const recentMenuPersistMiddleware: Middleware = (api) => (next) => (action) => {
    const result = next(action);
    const actionType = (action as { type?: string }).type ?? '';
    if (actionType.startsWith('recentMenu/')) {
        const { list } = (api.getState() as { recentMenu: RecentMenuState }).recentMenu;
        storage.setRecentMenu(list);
    }
    return result;
};

function createLocalStore() {
    return configureStore({
        reducer: createRootReducer(),
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false })
                .concat(authMiddleware)
                .concat(recentMenuPersistMiddleware),
    });
}

// 로컬 폴백 스토어 — singleton lib 가정 하에 모듈 로드 시 1회만 생성됨
export const store = createLocalStore();

// host 우선, 없으면 로컬 폴백 (standalone 모드)
export const getStore = () => {
  const w = typeof window !== 'undefined' ? window : undefined;
  return w?.__REDUX_STORE__ ?? store;
};

export const injectReducer = (key: string, reducer: Reducer) => {
    dynamicReducers[key] = reducer;
    getStore().replaceReducer(createRootReducer());
};

export const exposeStore = (s: typeof store) => {
    if (typeof window === 'undefined') return;
    storage.setHostApp();
    window.__REDUX_STORE__ = s;
};

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
