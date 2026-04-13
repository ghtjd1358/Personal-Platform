/**
 * Auth Hooks
 * 로그인, 로그아웃, 토큰 갱신
 */

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getStore, setAccessToken, setUser, logout, selectAccessToken, selectUser } from '../store/app-store';
import { storage } from '../utils/storage';
import { User } from '../types';

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

// 로그인 요청 타입
export interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 함수 타입
export type LoginFn = (request: LoginRequest) => Promise<LoginResponse>;

// 로그아웃 함수 타입
export type LogoutFn = () => Promise<void>;

// 토큰 갱신 함수 타입
export type RefreshFn = () => Promise<string | null>;

/**
 * 로그인 Hook
 */
export function useLogin(loginApi?: LoginFn) {
  return useCallback(async (request: LoginRequest): Promise<LoginResponse | null> => {
    try {
      const store = getStore();
      let response: LoginResponse;

      if (loginApi) {
        response = await loginApi(request);
      } else {
        // Mock 로그인 (개발용)
        if (request.username === 'admin@test.com' && request.password === '1234') {
          response = {
            accessToken: `mock-token-${Date.now()}`,
            user: {
              id: '1',
              name: '관리자',
              email: request.username,
              role: 'admin',
            },
          };
        } else {
          throw new Error('아이디/비밀번호를 확인해주세요.');
        }
      }

      // Store에 저장
      store.dispatch(setAccessToken(response.accessToken));
      store.dispatch(setUser(response.user));

      // Storage에도 저장 (새로고침 대비)
      storage.setAccessToken(response.accessToken);
      storage.setUser(response.user);

      console.log('[Login] 로그인 성공:', response.user.email);
      return response;
    } catch (error) {
      console.error('[Login] 로그인 실패:', error);
      throw error;
    }
  }, [loginApi]);
}

/**
 * 로그아웃 Hook
 */
export function useLogout(logoutApi?: LogoutFn) {
  return useCallback(async (): Promise<void> => {
    try {
      const store = getStore();

      // API 호출 (있는 경우)
      if (logoutApi) {
        await logoutApi();
      }

      // Store 초기화
      store.dispatch(logout());
      store.dispatch({ type: 'recentMenu/resetRecentMenu' });

      // Storage 초기화
      storage.clearAuth();

      console.log('[Logout] 로그아웃 완료');
    } catch (error) {
      console.error('[Logout] 로그아웃 실패:', error);
      storage.clearAuth();
      throw error;
    }
  }, [logoutApi]);
}

/**
 * 토큰 갱신 Hook
 */
export function useTokenRefresh(refreshApi?: RefreshFn) {
  return useCallback(async (): Promise<string | null> => {
    try {
      const store = getStore();

      if (!refreshApi) {
        console.warn('[Token Refresh] refresh API가 설정되지 않았습니다.');
        return null;
      }

      const newToken = await refreshApi();

      if (newToken) {
        store.dispatch(setAccessToken(newToken));
        storage.setAccessToken(newToken);
        console.log('[Token Refresh] 토큰 갱신 성공');
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('[Token Refresh] 토큰 갱신 실패:', error);
      const store = getStore();
      store.dispatch(setAccessToken(''));
      storage.setAccessToken('');
      throw error;
    }
  }, [refreshApi]);
}

/**
 * 인증 상태 확인 Hook
 * useSelector를 사용하여 상태 변경시 리렌더링 보장
 */
export function useAuthState() {
  const accessToken = useSelector(selectAccessToken);
  const user = useSelector(selectUser);

  return {
    isAuthenticated: !!accessToken,
    user,
    accessToken,
  };
}
