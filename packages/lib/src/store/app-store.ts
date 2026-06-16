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

let dynamicReducers: Record<string, Reducer> = {};

const createRootReducer = () => combineReducers({
    ...staticReducers,
    ...dynamicReducers,
});

const authMiddleware: Middleware = () => (next) => (action) => {
    const result = next(action);
    if (logout.match(action as ReturnType<typeof logout>)) {
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

export const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(authMiddleware)
            .concat(recentMenuPersistMiddleware),
});

declare global {
    interface Window {
        __REDUX_STORE__: typeof store;
        __INJECT_REDUCER__?: InjectReducerFn;
    }
}

const isHostApp = storage.isHostApp();
isHostApp && (window.__REDUX_STORE__ = store);

export const getStore = () => isHostApp ? store : window.__REDUX_STORE__;

export const injectReducer = (key: string, reducer: Reducer) => {
    if (dynamicReducers[key]) {
        if (dynamicReducers[key] !== reducer && process.env.NODE_ENV !== 'production') {
            console.warn(`[Store] injectReducer: '${key}' 키가 이미 다른 reducer로 등록됨 — 무시됨`);
        }
        return;
    }
    dynamicReducers[key] = reducer;
    getStore().replaceReducer(createRootReducer());
};

export const removeReducer = (key: string) => {
    delete dynamicReducers[key];
    getStore().replaceReducer(createRootReducer());
};

export type HostStore = typeof store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
