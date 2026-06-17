import { Reducer } from '@reduxjs/toolkit';
import { InjectReducerFn } from '../types';
import { RecentMenuState } from './recent-menu-slice';
export * from './app-slice';
export * from './app-selectors';
export * from './ui-slice';
export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    app: import("..").AppState;
    ui: import("..").UiState;
    menu: import("./menu-slice").MenuState;
    recentMenu: RecentMenuState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        app: import("..").AppState;
        ui: import("..").UiState;
        menu: import("./menu-slice").MenuState;
        recentMenu: RecentMenuState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export declare const getStore: () => import("@reduxjs/toolkit").EnhancedStore<{
    app: import("..").AppState;
    ui: import("..").UiState;
    menu: import("./menu-slice").MenuState;
    recentMenu: RecentMenuState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        app: import("..").AppState;
        ui: import("..").UiState;
        menu: import("./menu-slice").MenuState;
        recentMenu: RecentMenuState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export declare const injectReducer: (key: string, reducer: Reducer) => void;
export declare const exposeStore: (s: typeof store) => void;
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