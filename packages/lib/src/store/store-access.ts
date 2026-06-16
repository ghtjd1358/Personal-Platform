/**
 * Host Store 접근 유틸리티
 * Remote 앱에서 Host의 Redux Store에 접근
 */

import { useSyncExternalStore } from 'react';
import { User, HostRootState } from '../types';
import { Reducer, UnknownAction } from '@reduxjs/toolkit';
import type { AppStore } from './app-store';
import { STORAGE_KEYS } from '../utils/storage';

/**
 * Host Store 가져오기
 */
export const getHostStore = (): AppStore | undefined => {
  return window.__REDUX_STORE__;
};

/**
 * Host Store 상태 가져오기
 */
export const getHostState = (): HostRootState | null => {
  try {
    const store = getHostStore();
    if (store) {
      return store.getState();
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * 현재 로그인된 사용자 가져오기
 */
export const getCurrentUser = (): User | null => {
  try {
    const state = getHostState();
    if (state) {
      return state.app?.user || null;
    }
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * accessToken 가져오기
 * 보안: token 은 메모리(Redux)에만 존재. localStorage fallback 없음 (XSS exfiltration 방어)
 */
export const getAccessToken = (): string => {
  try {
    const state = getHostState();
    return state?.app?.accessToken || '';
  } catch {
    return '';
  }
};

/**
 * 인증 여부 확인
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

/**
 * 현재 서비스 가져오기
 */
export const getCurrentService = (): string => {
  try {
    const state = getHostState();
    return state?.app?.service || '';
  } catch {
    return '';
  }
};

/**
 * Host Store에 액션 디스패치
 */
export const dispatchToHost = (action: UnknownAction): void => {
  try {
    const store = getHostStore();
    if (store) {
      store.dispatch(action);
    }
  } catch (error) {
    console.error('Failed to dispatch to host store:', error);
  }
};

/**
 * Host Store 상태 변경 구독
 */
export const subscribeToHost = (listener: () => void): (() => void) => {
  try {
    const store = getHostStore();
    if (store) {
      return store.subscribe(listener);
    }
    return () => {};
  } catch {
    return () => {};
  }
};

/**
 * 현재 사용자를 React 상태로 구독 (login/logout 시 자동 리렌더링)
 *
 * getCurrentUser() 대신 이 훅을 사용하세요.
 * React 컴포넌트 안에서 비반응형으로 읽으면 로그인/로그아웃 시 화면이 갱신되지 않습니다.
 */
export const useCurrentUser = (): User | null =>
  useSyncExternalStore(subscribeToHost, getCurrentUser, getCurrentUser);

/** accessToken을 React 상태로 구독 */
export const useReactiveAccessToken = (): string =>
  useSyncExternalStore(subscribeToHost, getAccessToken, getAccessToken);

/** 인증 여부를 React 상태로 구독 */
export const useReactiveIsAuthenticated = (): boolean =>
  useSyncExternalStore(subscribeToHost, isAuthenticated, isAuthenticated);

/**
 * 동적으로 Reducer 주입 (Remote 앱에서 자체 상태 관리 시 사용)
 * 주의: 이 함수는 Host의 injectReducer를 호출해야 함
 */
export const injectReducerToHost = (key: string, reducer: Reducer): void => {
  // Host의 window에 노출된 injectReducer 함수 호출
  if (typeof window.__INJECT_REDUCER__ === 'function') {
    window.__INJECT_REDUCER__(key, reducer);
  } else {
    console.warn('Host injectReducer not available');
  }
};