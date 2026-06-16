import { useEffect, useRef, useState } from 'react';
import { getStore, setAccessToken, setUser, logout } from '../store/app-store';
import { storage } from '../utils/storage';
import { User } from '../types';
import { restoreFromStorage } from './use-simple-initialize';

export { useSimpleInitialize, restoreFromStorage } from './use-simple-initialize';
export { useSupabaseInitialize } from './use-supabase-initialize';

export interface InitializeOptions {
  refreshToken?: () => Promise<string | null>;
  fetchUserInfo?: () => Promise<User | null>;
  onInitialized?: () => void;
  onError?: (error: Error) => void;
}

export function useInitialize(options: InitializeOptions = {}) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const optionsRef = useRef(options);
  const ranRef = useRef(false);
  optionsRef.current = options;

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const initialize = async () => {
      const opts = optionsRef.current;
      try {
        const store = getStore();
        restoreFromStorage(store);

        if (opts.refreshToken) {
          try {
            const newToken = await opts.refreshToken();
            if (newToken) {
              store.dispatch(setAccessToken(newToken));

              if (opts.fetchUserInfo) {
                const userInfo = await opts.fetchUserInfo();
                if (userInfo) {
                  store.dispatch(setUser(userInfo));
                  storage.setUser(userInfo);
                } else {
                  // 서버에서 사용자를 찾을 수 없음 (삭제된 계정 등) → restoreFromStorage 캐시 제거
                  store.dispatch(logout());
                }
              }
            }
          } catch (err) {
            console.warn('[Initialize] 토큰 갱신 실패, 비인증 상태로 진행:', err);
          }
        }

        setInitialized(true);
        opts.onInitialized?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('초기화 실패');
        setInitialized(true);
        setError(error);
        opts.onError?.(error);
        console.error('[Initialize] 초기화 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return { initialized, loading, error };
}
