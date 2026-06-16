/**
 * Host Store 접근 유틸리티
 * Remote 앱에서 Host의 Redux Store에 접근
 */
import { User, HostRootState } from '../types';
import { Reducer, UnknownAction } from '@reduxjs/toolkit';
import type { AppStore } from './app-store';
/**
 * Host Store 가져오기
 */
export declare const getHostStore: () => AppStore | undefined;
/**
 * Host Store 상태 가져오기
 */
export declare const getHostState: () => HostRootState | null;
/**
 * 현재 로그인된 사용자 가져오기
 */
export declare const getCurrentUser: () => User | null;
/**
 * accessToken 가져오기
 * 보안: token 은 메모리(Redux)에만 존재. localStorage fallback 없음 (XSS exfiltration 방어)
 */
export declare const getAccessToken: () => string;
/**
 * 인증 여부 확인
 */
export declare const isAuthenticated: () => boolean;
/**
 * 현재 서비스 가져오기
 */
export declare const getCurrentService: () => string;
/**
 * Host Store에 액션 디스패치
 */
export declare const dispatchToHost: (action: UnknownAction) => void;
/**
 * Host Store 상태 변경 구독
 */
export declare const subscribeToHost: (listener: () => void) => (() => void);
/**
 * 현재 사용자를 React 상태로 구독 (login/logout 시 자동 리렌더링)
 *
 * getCurrentUser() 대신 이 훅을 사용하세요.
 * React 컴포넌트 안에서 비반응형으로 읽으면 로그인/로그아웃 시 화면이 갱신되지 않습니다.
 */
export declare const useCurrentUser: () => User | null;
/** accessToken을 React 상태로 구독 */
export declare const useReactiveAccessToken: () => string;
/** 인증 여부를 React 상태로 구독 */
export declare const useReactiveIsAuthenticated: () => boolean;
/**
 * 동적으로 Reducer 주입 (Remote 앱에서 자체 상태 관리 시 사용)
 * 주의: 이 함수는 Host의 injectReducer를 호출해야 함
 */
export declare const injectReducerToHost: (key: string, reducer: Reducer) => void;
//# sourceMappingURL=store-access.d.ts.map