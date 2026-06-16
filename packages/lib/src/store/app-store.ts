import { configureStore, combineReducers, Reducer, Middleware } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import { InjectReducerFn } from '../types';
import { appSlice, logout } from './app-slice';
import menuReducer from './menu-slice';
import recentMenuReducer, { RecentMenuState } from './recent-menu-slice';

export * from './app-slice';
export * from './app-selectors';

// Webpack MF의 shared: { singleton: true } 가 lib을 1회만 로드함 → 모듈 레벨 변수로 충분

// 앱이 시작될 때부터 항상 존재하는 Redux 슬라이스
const staticReducers = {
    app: appSlice.reducer,
    menu: menuReducer,
    recentMenu: recentMenuReducer,
};

// 리모트 앱이 로드될 때 추가되는 Redux 슬라이스 (지연 등록)
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

// 호스트 앱의 전역 스토어 반환
// 리모트 앱은 window.__REDUX_STORE__를 통해 호스트 스토어를 공유받음
// split-brain 위험: 호스트 내에서 동작 중인데 호스트 스토어를 찾을 수 없으면
// remote가 자체 store 폴백을 사용 → 인증/사용자 상태가 분리되어 동기화 실패
// remote의 standalone 모드는 정상 — 자체 store만 사용
//
export const getStore = () => {
  const w = typeof window !== 'undefined' ? window : undefined;
  return w?.__REDUX_STORE__ ?? store;
};

export const injectReducer = (key: string, reducer: Reducer) => {
    if (dynamicReducers[key]) {
        if (dynamicReducers[key] !== reducer && process.env.NODE_ENV !== 'production') {
            console.warn(`[Store] injectReducer: '${key}' 키가 이미 다른 reducer로 등록됨 — 무시됨`);
        }
        return;
    }
    dynamicReducers[key] = reducer;
    // Remote 앱에서 호출될 때도 Host store 에 reducer 가 주입되도록 getStore() 경유
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
