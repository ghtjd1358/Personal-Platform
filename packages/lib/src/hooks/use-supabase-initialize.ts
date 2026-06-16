import { useEffect, useRef, useState } from 'react';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getStore, logout } from '../store/app-store';
import { setUser } from '../store/app-slice';
import { setRecentMenuList } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
import { getSupabase } from '../network/supabase-client';
import { applySession } from './use-supabase-auth';
import { restoreFromStorage } from './use-simple-initialize';

// 모듈 싱글톤 — 중복 마운트 시 첫 번째 init 완료까지 대기
let _mounted = false;
let _initPromise: Promise<void> | null = null;

export function useSupabaseInitialize() {
  const [initialized, setInitialized] = useState(false);
  const ownedRef = useRef(false);

  useEffect(() => {
    if (_mounted) {
      // 첫 번째 init이 끝난 뒤 setInitialized — 미인증 상태에서 렌더 시작하는 race 방지
      _initPromise?.finally(() => setInitialized(true)) ?? setInitialized(true);
      return;
    }
    _mounted = true;
    ownedRef.current = true;

    let subscription: { unsubscribe: () => void } | undefined;
    const ctrl = new AbortController();

    const initialize = async () => {
      const store = getStore();

      try {
        let supabase;
        try {
          supabase = getSupabase();
        } catch {
          restoreFromStorage(store);
          setInitialized(true);
          return;
        }

        // getSession hang 방어 — 5초 타임아웃
        let sessionTimerId: ReturnType<typeof setTimeout> | undefined;
        const sessionTimeout = new Promise<{ data: { session: null }; error: null }>(
          resolve => { sessionTimerId = setTimeout(() => resolve({ data: { session: null }, error: null }), 5000); }
        );
        const { data: { session }, error } = await Promise.race([
          supabase.auth.getSession().finally(() => clearTimeout(sessionTimerId)),
          sessionTimeout,
        ]);

        if (error) {
          console.warn('[Supabase Init] getSession 오류:', error);
          restoreFromStorage(store);
          setInitialized(true);
          return;
        }

        if (!session) {
          restoreFromStorage(store);
          setInitialized(true);
          return;
        }

        // 구독을 applySession 이전에 등록 — applySession throw 시에도 이후 이벤트를 놓치지 않음
        // Supabase는 async 콜백을 await하지 않으므로 authChain으로 직렬화
        let authChain: Promise<void> = Promise.resolve();

        ({ data: { subscription } } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'INITIAL_SESSION') return;

            authChain = authChain.then(async () => {
              if (session) {
                // 큐 실행 시점 store 값 비교 — 이미 반영된 SIGNED_IN 중복 dispatch 방지
                if (event === 'SIGNED_IN' && session.access_token === store.getState().app.accessToken) return;
                await applySession(session, ctrl.signal);
              } else {
                if (!ctrl.signal.aborted) store.dispatch(logout());
              }
            }).catch(err => {
              if (err?.message !== 'applySession aborted') console.error('[Supabase Init] applySession 실패:', err);
            });
          }
        ));

        try {
          await applySession(session, ctrl.signal);
          const savedRecentMenu = storage.getRecentMenu();
          if (savedRecentMenu.length > 0) store.dispatch(setRecentMenuList(savedRecentMenu));
        } catch (err) {
          if ((err as Error)?.message !== 'applySession aborted') {
            console.error('[Supabase Init] 초기 세션 적용 실패:', err);
          }
        }

        setInitialized(true);
      } catch (err) {
        console.error('[Supabase Init] 초기화 실패:', err);
        // access token은 복구하지 않음 (XSS exfiltration 방어)
        const savedUser = storage.getUser();
        if (savedUser) store.dispatch(setUser(savedUser));
        setInitialized(true);
      }
    };

    _initPromise = initialize().finally(() => { _initPromise = null; });

    return () => {
      if (!ownedRef.current) return;
      _mounted = false;
      ctrl.abort();
      subscription?.unsubscribe();
    };
  }, []);

  return { initialized };
}
