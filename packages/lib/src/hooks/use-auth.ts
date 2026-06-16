import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getStore, setAccessToken, setUser, logout, selectAccessToken, selectUser } from '../store/app-store';
import { clearRecentMenu } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
import { User } from '../types';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginFn = (request: LoginRequest) => Promise<LoginResponse>;
export type LogoutFn = () => Promise<void>;
export type RefreshFn = () => Promise<string | null>;

export function useLogin(loginApi?: LoginFn) {
  return useCallback(async (request: LoginRequest): Promise<LoginResponse | null> => {
    try {
      const store = getStore();

      if (!loginApi) {
        throw new Error('loginApi가 제공되지 않았습니다.');
      }

      const response = await loginApi(request);

      store.dispatch(setAccessToken(response.accessToken));
      store.dispatch(setUser(response.user));
      storage.setUser(response.user);

      return response;
    } catch (error) {
      console.error('[Login] 로그인 실패:', error);
      throw error;
    }
  }, [loginApi]);
}

export function useLogout(logoutApi?: LogoutFn) {
  return useCallback(async (): Promise<void> => {
    try {
      const store = getStore();

      if (logoutApi) {
        await logoutApi();
      }

      store.dispatch(logout());
      store.dispatch(clearRecentMenu());
    } catch (error) {
      console.error('[Logout] 로그아웃 실패:', error);
      storage.clearAuth();
      throw error;
    }
  }, [logoutApi]);
}

export function useTokenRefresh(refreshApi?: RefreshFn) {
  return useCallback(async (): Promise<string | null> => {
    try {
      const store = getStore();

      if (!refreshApi) return null;

      const newToken = await refreshApi();

      if (newToken) {
        store.dispatch(setAccessToken(newToken));
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('[Token Refresh] 토큰 갱신 실패:', error);
      const store = getStore();
      store.dispatch(setAccessToken(''));
      throw error;
    }
  }, [refreshApi]);
}

export function useAuthState() {
  const accessToken = useSelector(selectAccessToken);
  const user = useSelector(selectUser);

  return {
    isAuthenticated: !!accessToken,
    user,
    accessToken,
  };
}
