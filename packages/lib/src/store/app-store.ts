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
// recentMenu 액션 발생 후 list를 storage에 동기화 — reducer는 순수 함수로 유지
const recentMenuPersistMiddleware: Middleware = (api) => (next) => (action) => {
    const result = next(action);
    if (typeof action === 'object' && action !== null && 'type' in action &&
        typeof (action as { type: unknown }).type === 'string' &&
        (action as { type: string }).type.startsWith('recentMenu/')) {
        const list = (api.getState() as { recentMenu: RecentMenuState }).recentMenu.list;
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
// exposeStore()가 sessionStorage.isHostApp을 설정하는 시점보다 이 모듈이 먼저 로드되므로
// IIFE로 모듈 로드 시점에 캡처하면 항상 false가 된다.
// 대신 lazy memoization: true가 확인되면 캐시, false는 캐시하지 않음 (아직 미설정일 수 있음)
let _hostCheckCached = false;

const isRunningInHost = (): boolean => {
  if (_hostCheckCached) return true;
  try {
    const result = typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('isHostApp') === 'true';
    if (result) _hostCheckCached = true; // true 확인되면 캐시
    return result;
  } catch {
    return false; // 시크릿 모드/iframe sandbox SecurityError 방어
  }
};

export const getStore = () => {
  // SSR/Jest 환경에서 window가 undefined인 경우를 방어 (jsdom에서는 있지만 Node.js 단순 require 시 없음)
  const w = typeof window !== 'undefined' ? window : undefined;
  if (!w?.__REDUX_STORE__) {
    if (isRunningInHost()) {
      // 호스트 안에서 동작 중인데 호스트 스토어를 찾을 수 없음 → 심각한 오류
      console.error('[mfa-lib] 호스트 스토어를 찾을 수 없습니다. 상태가 동기화되지 않을 수 있습니다.');
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('[mfa-lib] 호스트 스토어 미노출 — 로컬 폴백 사용 중. Remote 간 상태 동기화 안 됨.');
    }
  }
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
    if (typeof window === 'undefined') return; // SSR 환경 방어
    // 중복 호출 방어 — 다른 store 인스턴스가 덮어쓰면 split-brain 발생
    if (window.__REDUX_STORE__ && window.__REDUX_STORE__ !== s) {
        console.error('[Store] exposeStore: 다른 store 인스턴스로 재호출됨. 상태 분기가 발생할 수 있습니다.');
        return;
    }
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
