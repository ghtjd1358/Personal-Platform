import { configureStore, combineReducers, Reducer, Middleware } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import { InjectReducerFn } from '../types';
import { appSlice, logout } from './app-slice';
import { uiSlice } from './ui-slice';
import menuReducer from './menu-slice';
import recentMenuReducer, { RecentMenuState } from './recent-menu-slice';

export * from './app-slice';
export * from './app-selectors';
export * from './ui-slice';

const staticReducers = {
    app: appSlice.reducer,
    ui: uiSlice.reducer,
    menu: menuReducer,
    recentMenu: recentMenuReducer,
};

const dynamicReducers: Record<string, Reducer> = {};

const createRootReducer = () => combineReducers({
    ...staticReducers,
    ...dynamicReducers,
});

// logout 액션 감지 시 localStorage 인증 정보 삭제 — XSS exfiltration 방어
const authMiddleware: Middleware = () => (next) => (action) => {
    const result = next(action);
    if (logout.match(action)) {
        storage.clearAuth();
    }
    return result;
};

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

// host와 remote 모두 이 싱글톤을 공유한다. host가 별도 store를 만들지 않는 것이 전제.
export const store = createLocalStore();

export const getStore = () =>
    (typeof window !== 'undefined' && window.__REDUX_STORE__) || store;

export const injectReducer = (key: string, reducer: Reducer) => {
    dynamicReducers[key] = reducer;
    getStore().replaceReducer(createRootReducer());
};

export const exposeStore = (s: typeof store) => {
    if (typeof window === 'undefined') return;
    storage.setHostApp();
    window.__REDUX_STORE__ = s;
};

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

declare global {
    interface Window {
        __REDUX_STORE__: typeof store;
        __INJECT_REDUCER__?: InjectReducerFn;
    }
}
