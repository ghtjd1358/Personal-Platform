// useSupabaseInitialize: Supabase 인증 사용 시
// useInitialize: Node.js JWT 기반 인증 사용 시
// useSimpleInitialize: 인증 없이 초기화만 필요할 때
// 셋 중 하나만 Root 당 한 번 마운트할 것
import { useEffect, useRef, useState } from 'react';
import { getStore, setAccessToken, setUser, logout } from '../store/app-store';
import { setRecentMenuList } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
import { getSupabase } from '../network/supabase-client';
import { applySession } from './use-supabase-auth';
// 모듈 싱글톤 — 중복 마운트 시 첫 번째 init 완료까지 대기
let _supabaseInitMounted = false;
let _initPromise = null;
const isSupabaseInitMounted = () => _supabaseInitMounted;
const setSupabaseInitMounted = (v) => { _supabaseInitMounted = v; };
// 세 가지 init hook이 공통으로 사용하는 localStorage 복구 로직
// 보안: access token 은 localStorage 에서 복구하지 않음 (XSS exfiltration 방어)
//      token 은 Redux 메모리에만 존재, 새로고침 시 refresh flow 로 재발급
// 앱 재시작 시 localStorage에 저장된 사용자 정보를 Redux로 복구
function restoreFromStorage(store) {
    const savedUser = storage.getUser();
    if (savedUser)
        store.dispatch(setUser(savedUser));
    const savedRecentMenu = storage.getRecentMenu();
    if (savedRecentMenu.length > 0) {
        store.dispatch(setRecentMenuList(savedRecentMenu));
    }
}
/**
 * 앱 초기화 Hook
 */
export function useInitialize(options = {}) {
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const optionsRef = useRef(options);
    const ranRef = useRef(false); // React Strict Mode 이중 마운트 시 refreshToken 2회 호출 방지
    optionsRef.current = options;
    useEffect(() => {
        if (ranRef.current)
            return;
        ranRef.current = true;
        const initialize = async () => {
            const opts = optionsRef.current;
            try {
                const store = getStore();
                // 1단계: 로컬 저장소에서 사용자 정보 복구 (토큰은 서버에서 새로 받음)
                restoreFromStorage(store);
                // 2단계: 서버에 최신 토큰 요청 (refresh token 사용 — httpOnly 쿠키로 전송)
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
                                }
                                else {
                                    // 서버에서 사용자를 찾을 수 없음 (삭제된 계정 등) → 로컬 캐시 제거
                                    // restoreFromStorage 로 복구된 cached user 가 남는 것을 방지
                                    store.dispatch(logout());
                                }
                            }
                        }
                    }
                    catch (err) {
                        // 갱신 실패 시 비인증 상태로 진행
                        console.warn('[Initialize] 토큰 갱신 실패, 비인증 상태로 진행:', err);
                    }
                }
                // 3단계: 초기화 완료 표시
                setInitialized(true);
                opts.onInitialized?.();
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error('초기화 실패');
                setInitialized(true); // 에러 시에도 로딩 상태 해제
                setError(error);
                opts.onError?.(error);
                console.error('[Initialize] 초기화 에러:', error);
            }
            finally {
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
        restoreFromStorage(getStore());
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
    const ownedRef = useRef(false); // 이 인스턴스가 구독을 소유하는지 추적
    useEffect(() => {
        if (isSupabaseInitMounted()) {
            // 첫 번째 init이 끝난 뒤 setInitialized — 미인증 상태에서 렌더 시작하는 race 방지
            _initPromise?.finally(() => setInitialized(true)) ?? setInitialized(true);
            return;
        }
        setSupabaseInitMounted(true);
        ownedRef.current = true;
        // subscription을 effect 스코프에 선언 — initialize() 내부에서 할당 후 cleanup이 직접 참조
        // lazy cleanup 변수 패턴은 할당 전 unmount 시 subscription을 leak할 수 있어 제거
        let subscription;
        const ctrl = new AbortController(); // 언마운트 시 abort → zombie dispatch 방지
        const initialize = async () => {
            const store = getStore();
            try {
                // Supabase 클라이언트 가져오기 (없으면 fallback)
                let supabase;
                try {
                    supabase = getSupabase();
                }
                catch {
                    // Supabase 미초기화 시 localStorage에서 복구
                    restoreFromStorage(store);
                    setInitialized(true);
                    return;
                }
                // 1단계: 현재 Supabase 세션 확인 (최대 5초 대기) — 네트워크 hang 방어
                let sessionTimerId;
                const sessionTimeout = new Promise(resolve => {
                    sessionTimerId = setTimeout(() => resolve({ data: { session: null }, error: null }), 5000);
                });
                const { data: { session }, error } = await Promise.race([
                    supabase.auth.getSession().finally(() => clearTimeout(sessionTimerId)), // 성공 시 타이머 취소
                    sessionTimeout,
                ]);
                // getSession 오류 시 localStorage 폴백 (네트워크/Storage 문제 등)
                if (error) {
                    console.warn('[Supabase Init] getSession 오류:', error);
                    restoreFromStorage(store);
                    setInitialized(true);
                    return;
                }
                // 2단계: 세션 없으면 localStorage 복구 후 조기 종료 (구독 불필요)
                if (!session) {
                    restoreFromStorage(store);
                    setInitialized(true);
                    return;
                }
                // 3단계: 실시간 구독을 applySession 이전에 먼저 등록
                // applySession이 throw해도 이후 로그인/로그아웃 이벤트를 놓치지 않게 함
                // 콜백을 직렬화 — Supabase는 async 콜백을 await하지 않아 동시 applySession 경쟁 발생 가능
                let authQueue = Promise.resolve();
                ({ data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'INITIAL_SESSION')
                        return;
                    authQueue = authQueue.then(async () => {
                        if (session) {
                            // 큐 실행 시점의 store 값과 비교 — 이벤트 도착 시점 비교는 pending task의 dispatch를 무시함
                            if (event === 'SIGNED_IN' && session.access_token === store.getState().app.accessToken)
                                return;
                            await applySession(session, ctrl.signal);
                        }
                        else {
                            if (!ctrl.signal.aborted)
                                store.dispatch(logout());
                        }
                    }).catch(err => {
                        if (err?.message !== 'applySession aborted') {
                            console.error('[Supabase Init] applySession 실패:', err);
                        }
                    });
                }));
                // 4단계: 초기 세션 적용 (구독 등록 이후) — 실패해도 구독은 유지됨
                try {
                    await applySession(session, ctrl.signal);
                    const savedRecentMenu = storage.getRecentMenu();
                    if (savedRecentMenu.length > 0) {
                        store.dispatch(setRecentMenuList(savedRecentMenu));
                    }
                }
                catch (err) {
                    if (err?.message !== 'applySession aborted') {
                        console.error('[Supabase Init] 초기 세션 적용 실패:', err);
                    }
                }
                setInitialized(true);
            }
            catch (err) {
                console.error('[Supabase Init] 초기화 실패:', err);
                // 에러 발생해도 localStorage에서 사용자 정보만 복구 시도
                // 보안: access token 은 localStorage 에서 복구하지 않음 (XSS exfiltration 방어)
                const savedUser = storage.getUser();
                if (savedUser) {
                    store.dispatch(setUser(savedUser));
                }
                setInitialized(true);
            }
        };
        _initPromise = initialize().finally(() => { _initPromise = null; });
        return () => {
            if (!ownedRef.current)
                return;
            setSupabaseInitMounted(false);
            ctrl.abort();
            subscription?.unsubscribe();
        };
    }, []);
    return { initialized };
}
