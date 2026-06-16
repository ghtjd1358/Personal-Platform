import { useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '../utils/storage';
export const getHostStore = () => window.__REDUX_STORE__;
export const getHostState = () => {
    try {
        return getHostStore()?.getState() ?? null;
    }
    catch {
        return null;
    }
};
export const getCurrentUser = () => {
    try {
        const state = getHostState();
        if (state)
            return state.app?.user || null;
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    }
    catch {
        return null;
    }
};
// token은 메모리(Redux)에만 존재한다 — localStorage fallback 없음 (XSS exfiltration 방어)
export const getAccessToken = () => {
    try {
        return getHostState()?.app?.accessToken || '';
    }
    catch {
        return '';
    }
};
export const isAuthenticated = () => !!getAccessToken();
export const getCurrentService = () => {
    try {
        return getHostState()?.app?.service || '';
    }
    catch {
        return '';
    }
};
export const dispatchToHost = (action) => {
    try {
        getHostStore()?.dispatch(action);
    }
    catch (error) {
        console.error('Failed to dispatch to host store:', error);
    }
};
export const subscribeToHost = (listener) => {
    try {
        return getHostStore()?.subscribe(listener) ?? (() => { });
    }
    catch {
        return () => { };
    }
};
// getCurrentUser() 대신 사용 — 로그인/로그아웃 시 자동 리렌더링
export const useCurrentUser = () => useSyncExternalStore(subscribeToHost, getCurrentUser, getCurrentUser);
export const useReactiveAccessToken = () => useSyncExternalStore(subscribeToHost, getAccessToken, getAccessToken);
export const useReactiveIsAuthenticated = () => useSyncExternalStore(subscribeToHost, isAuthenticated, isAuthenticated);
export const injectReducerToHost = (key, reducer) => {
    if (typeof window.__INJECT_REDUCER__ === 'function') {
        window.__INJECT_REDUCER__(key, reducer);
    }
    else {
        console.warn('Host injectReducer not available');
    }
};
