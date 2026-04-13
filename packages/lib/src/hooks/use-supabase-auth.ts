/**
 * Supabase Auth Hooks
 * Supabase 인증을 위한 전용 hooks
 */

import { useCallback, useEffect, useState } from 'react';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabase } from '../network/supabase-client';
import { getStore, setAccessToken, setUser, logout } from '../store/app-store';
import { storage } from '../utils/storage';
import { User } from '../types';

/**
 * Supabase User를 앱 User 타입으로 변환
 */
function mapSupabaseUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    role: supabaseUser.user_metadata?.role || 'user',
    avatar: supabaseUser.user_metadata?.avatar_url,
  };
}

/**
 * Supabase 로그인 Hook
 */
export function useSupabaseLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabase();
      const store = getStore();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!data.session || !data.user) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }

      const user = mapSupabaseUser(data.user);

      // Redux store 업데이트
      store.dispatch(setAccessToken(data.session.access_token));
      store.dispatch(setUser(user));

      // Storage에도 저장 (backup)
      storage.setAccessToken(data.session.access_token);
      storage.setUser(user);

      console.log('[Supabase Login] 로그인 성공:', user.email);
      return { session: data.session, user };
    } catch (err: any) {
      const message = err.message || '로그인에 실패했습니다.';
      setError(message);
      console.error('[Supabase Login] 로그인 실패:', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
}

/**
 * Supabase 로그아웃 Hook
 */
export function useSupabaseLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const doLogout = useCallback(async () => {
    setIsLoading(true);

    try {
      const supabase = getSupabase();
      const store = getStore();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn('[Supabase Logout] 서버 로그아웃 실패:', error.message);
      }

      // Redux store 초기화
      store.dispatch(logout());
      store.dispatch({ type: 'recentMenu/resetRecentMenu' });

      // Storage 초기화
      storage.clearAuth();

      console.log('[Supabase Logout] 로그아웃 완료');
    } catch (err) {
      console.error('[Supabase Logout] 로그아웃 실패:', err);
      storage.clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { logout: doLogout, isLoading };
}

/**
 * Supabase 세션 Hook
 * 현재 세션 상태를 반환하고 변경을 구독
 */
export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 세션 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user ? mapSupabaseUser(session.user) : null,
    isLoading,
    isAuthenticated: !!session,
  };
}

/**
 * Supabase Auth 상태 변경 구독 Hook
 * Redux store와 동기화
 */
export function useSupabaseAuthSync() {
  useEffect(() => {
    const supabase = getSupabase();
    const store = getStore();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log('[Supabase Auth] 상태 변경:', event);

        if (session) {
          const user = mapSupabaseUser(session.user);
          store.dispatch(setAccessToken(session.access_token));
          store.dispatch(setUser(user));
          storage.setAccessToken(session.access_token);
          storage.setUser(user);
        } else {
          store.dispatch(logout());
          storage.clearAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
}

/**
 * 토큰 만료 전 선제 갱신 Hook
 * KOMCA 스타일: 만료 5분 전 자동으로 토큰 갱신
 * @param refreshBeforeMinutes 만료 전 갱신 시점 (분), 기본값 5분
 */
export function useTokenAutoRefresh(refreshBeforeMinutes: number = 5) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    const store = getStore();
    let timeoutId: NodeJS.Timeout | null = null;

    const scheduleRefresh = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.expires_at) {
          return;
        }

        const expiresAt = session.expires_at * 1000; // seconds to ms
        const refreshTime = expiresAt - (refreshBeforeMinutes * 60 * 1000);
        const now = Date.now();
        const timeout = refreshTime - now;

        // 이미 만료 시점이 지났으면 즉시 갱신
        if (timeout <= 0) {
          await performRefresh();
          return;
        }

        // 만료 전 갱신 스케줄링
        console.log(`[Token Auto Refresh] ${Math.round(timeout / 1000 / 60)}분 후 토큰 갱신 예정`);

        timeoutId = setTimeout(async () => {
          await performRefresh();
        }, timeout);

      } catch (err) {
        console.error('[Token Auto Refresh] 스케줄링 실패:', err);
      }
    };

    const performRefresh = async () => {
      if (isRefreshing) return;

      setIsRefreshing(true);

      try {
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          const user = mapSupabaseUser(data.session.user);
          store.dispatch(setAccessToken(data.session.access_token));
          store.dispatch(setUser(user));
          storage.setAccessToken(data.session.access_token);
          storage.setUser(user);

          setLastRefreshed(new Date());
          console.log('[Token Auto Refresh] 토큰 선제 갱신 완료');

          // 다음 갱신 스케줄링
          scheduleRefresh();
        }
      } catch (err) {
        console.error('[Token Auto Refresh] 토큰 갱신 실패:', err);
      } finally {
        setIsRefreshing(false);
      }
    };

    // 초기 스케줄링
    scheduleRefresh();

    // 세션 변경 시 재스케줄링
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          scheduleRefresh();
        }
      }
    );

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [refreshBeforeMinutes, isRefreshing]);

  return { isRefreshing, lastRefreshed };
}
