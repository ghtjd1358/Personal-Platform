/**
 * Initialize Hook
 * 앱 시작시 초기화 (토큰 갱신, 사용자 정보 로드)
 */

import { useEffect, useState } from 'react';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getStore, setAccessToken, setUser, logout } from '../store/app-store';
import { storage } from '../utils/storage';
import { User } from '../types';
import { getSupabase } from '../network/supabase-client';

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

// 초기화 옵션
export interface InitializeOptions {
  refreshToken?: () => Promise<string | null>;
  fetchUserInfo?: () => Promise<User | null>;
  onInitialized?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 앱 초기화 Hook
 */
export function useInitialize(options: InitializeOptions = {}) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const store = getStore();

        const savedToken = storage.getAccessToken();
        const savedUser = storage.getUser();

        if (savedToken) {
          store.dispatch(setAccessToken(savedToken));

          if (savedUser) {
            store.dispatch(setUser(savedUser));
          }

          if (options.refreshToken) {
            try {
              const newToken = await options.refreshToken();
              if (newToken) {
                store.dispatch(setAccessToken(newToken));
                storage.setAccessToken(newToken);
                console.log('[Initialize] 토큰 갱신 성공');

                if (options.fetchUserInfo) {
                  const userInfo = await options.fetchUserInfo();
                  if (userInfo) {
                    store.dispatch(setUser(userInfo));
                    storage.setUser(userInfo);
                    console.log('[Initialize] 사용자 정보 갱신:', userInfo.email);
                  }
                }
              }
            } catch (refreshError) {
              console.warn('[Initialize] 토큰 갱신 실패, 기존 토큰 사용');
            }
          }
        }

        // Recent Menu 복구
        const savedRecentMenu = storage.getRecentMenu();
        if (savedRecentMenu.length > 0) {
          store.dispatch({ type: 'recentMenu/setRecentMenu', payload: { list: savedRecentMenu } });
        }

        setInitialized(true);
        options.onInitialized?.();
        console.log('[Initialize] 앱 초기화 완료');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('초기화 실패');
        setError(error);
        options.onError?.(error);
        console.error('[Initialize] 초기화 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return { initialized, loading, error };
}

/**
 * 간단한 초기화 Hook (토큰/사용자 정보 복구만)
 */
export function useSimpleInitialize() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const store = getStore();

    const savedToken = storage.getAccessToken();
    const savedUser = storage.getUser();

    if (savedToken) {
      store.dispatch(setAccessToken(savedToken));
    }
    if (savedUser) {
      store.dispatch(setUser(savedUser));
    }

    const savedRecentMenu = storage.getRecentMenu();
    if (savedRecentMenu.length > 0) {
      store.dispatch({ type: 'recentMenu/setRecentMenu', payload: { list: savedRecentMenu } });
    }

    setInitialized(true);
  }, []);

  return { initialized };
}

/**
 * Supabase 초기화 Hook
 * 앱 시작 시 Supabase 세션 복구 및 Auth 상태 변경 구독
 */
export function useSupabaseInitialize() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initialize = async () => {
      const store = getStore();

      try {
        // Supabase 클라이언트 가져오기 (없으면 fallback)
        let supabase;
        try {
          supabase = getSupabase();
        } catch {
          // Supabase가 초기화되지 않은 경우 localStorage에서 복구
          console.warn('[Supabase Init] Supabase 미초기화, localStorage fallback');
          const savedToken = storage.getAccessToken();
          const savedUser = storage.getUser();

          if (savedToken) {
            store.dispatch(setAccessToken(savedToken));
          }
          if (savedUser) {
            store.dispatch(setUser(savedUser));
          }

          // Recent Menu 복구
          const savedRecentMenu = storage.getRecentMenu();
          if (savedRecentMenu.length > 0) {
            store.dispatch({ type: 'recentMenu/setRecentMenuList', payload: savedRecentMenu });
          }

          setInitialized(true);
          return;
        }

        // 1. 현재 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('[Supabase Init] 세션 가져오기 실패:', error.message);
        }

        if (session) {
          const user = mapSupabaseUser(session.user);
          store.dispatch(setAccessToken(session.access_token));
          store.dispatch(setUser(user));
          storage.setAccessToken(session.access_token);
          storage.setUser(user);
          console.log('[Supabase Init] 세션 복구:', user.email);
        } else {
          // 세션 없으면 localStorage에서 복구 시도
          const savedToken = storage.getAccessToken();
          const savedUser = storage.getUser();

          if (savedToken) {
            store.dispatch(setAccessToken(savedToken));
          }
          if (savedUser) {
            store.dispatch(setUser(savedUser));
          }
        }

        // 2. Recent Menu 복구
        const savedRecentMenu = storage.getRecentMenu();
        if (savedRecentMenu.length > 0) {
          store.dispatch({ type: 'recentMenu/setRecentMenuList', payload: savedRecentMenu });
        }

        // 3. Auth 상태 변경 구독
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, session: Session | null) => {
            if (session) {
              const user = mapSupabaseUser(session.user);
              store.dispatch(setAccessToken(session.access_token));
              store.dispatch(setUser(user));
              storage.setAccessToken(session.access_token);
              storage.setUser(user);
            } else if (event === 'SIGNED_OUT') {
              store.dispatch(logout());
              storage.clearAuth();
            }
          }
        );

        cleanup = () => subscription.unsubscribe();
        setInitialized(true);
      } catch (err) {
        console.error('[Supabase Init] 초기화 실패:', err);

        // 에러 발생해도 localStorage에서 복구 시도
        const savedToken = storage.getAccessToken();
        const savedUser = storage.getUser();

        if (savedToken) {
          store.dispatch(setAccessToken(savedToken));
        }
        if (savedUser) {
          store.dispatch(setUser(savedUser));
        }

        setInitialized(true);
      }
    };

    initialize();

    return () => cleanup?.();
  }, []);

  return { initialized };
}
