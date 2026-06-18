import { useSyncExternalStore } from 'react';
import { User, HostRootState } from '../types';
import { Reducer, UnknownAction } from '@reduxjs/toolkit';
import type { AppStore } from './app-store';
import { storage } from '../utils/storage';

export const getHostStore = (): AppStore | undefined => window.__REDUX_STORE__;

export const getHostState = (): HostRootState | null => {
  try {
    return getHostStore()?.getState() ?? null;
  } catch {
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const state = getHostState();
    return state?.app?.user ?? storage.getUser();
  } catch {
    return null;
  }
};

// token은 메모리(Redux)에만 존재한다 — localStorage fallback 없음 (XSS exfiltration 방어)
export const getAccessToken = (): string => {
  try {
    return getHostState()?.app?.accessToken || '';
  } catch {
    return '';
  }
};

export const isAuthenticated = (): boolean => !!getAccessToken();

export const getCurrentService = (): string => {
  try {
    return getHostState()?.ui?.service || '';
  } catch {
    return '';
  }
};

export const dispatchToHost = (action: UnknownAction): void => {
  try {
    getHostStore()?.dispatch(action);
  } catch (error) {
    console.error('Failed to dispatch to host store:', error);
  }
};

export const subscribeToHost = (listener: () => void): (() => void) => {
  try {
    return getHostStore()?.subscribe(listener) ?? (() => {});
  } catch {
    return () => {};
  }
};

// useSyncExternalStore용 stable snapshot — localStorage fallback 제거 (JSON.parse는 매번 새 객체 생성 → React 19 getSnapshot 계약 위반)
const getUserSnapshot = (): User | null => getHostStore()?.getState()?.app?.user ?? null;

// getCurrentUser() 대신 사용 — 로그인/로그아웃 시 자동 리렌더링
export const useCurrentUser = (): User | null =>
  useSyncExternalStore(subscribeToHost, getUserSnapshot, getUserSnapshot);

export const useReactiveAccessToken = (): string =>
  useSyncExternalStore(subscribeToHost, getAccessToken, getAccessToken);

export const useReactiveIsAuthenticated = (): boolean =>
  useSyncExternalStore(subscribeToHost, isAuthenticated, isAuthenticated);

export const injectReducerToHost = (key: string, reducer: Reducer): void => {
  if (typeof window.__INJECT_REDUCER__ === 'function') {
    window.__INJECT_REDUCER__(key, reducer);
  } else {
    console.warn('Host injectReducer not available');
  }
};
