import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabase } from '../network/supabase-client';
import { getStore, setAccessToken, setUser, logout } from '../store/app-store';
import { clearRecentMenu } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
function mapSupabaseUser(supabaseUser, role = 'user') {
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        role,
        avatar: supabaseUser.user_metadata?.avatar_url,
    };
}
const ROLE_CACHE_TTL = 5 * 60 * 1000; // 5분
// MF dual-load 방어: 두 lib 인스턴스가 각자 roleCache를 가지면 한 쪽 캐시만 히트됨
// globalThis에 보관해 단일 캐시 인스턴스 보장
const ROLE_CACHE_KEY = Symbol.for('mfa:roleCache');
const _g = globalThis;
if (!_g[ROLE_CACHE_KEY])
    _g[ROLE_CACHE_KEY] = new Map();
const roleCache = _g[ROLE_CACHE_KEY];
/** 특정 사용자(또는 전체) roleCache 무효화 — 로그아웃 또는 권한 변경 즉시 반영 시 호출 */
export function clearRoleCache(userId) {
    if (userId)
        roleCache.delete(userId);
    else
        roleCache.clear();
}
// profiles 테이블에서 서버 제어 role 조회 (user_metadata는 클라이언트 수정 가능)
async function fetchProfileRole(userId, signal) {
    const cached = roleCache.get(userId);
    if (cached) {
        if (Date.now() - cached.ts < ROLE_CACHE_TTL)
            return cached.role;
        roleCache.delete(userId); // TTL 만료 엔트리 즉시 evict — 메모리 누적 방지
    }
    if (signal?.aborted)
        return 'user';
    // 내부 AbortController: 외부 signal + 4초 타임아웃을 단일 abort 소스로 합침
    // Promise.race 패턴은 JS promise만 reject하고 실제 fetch는 계속 실행됨(zombie 응답 캐시 오염 가능)
    // abort()를 써야 supabase-js가 실제 네트워크 요청을 취소함
    const inner = new AbortController();
    if (signal)
        signal.addEventListener('abort', () => inner.abort(), { once: true });
    const timerId = setTimeout(() => inner.abort(), 4000);
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('profiles').select('role').eq('id', userId)
            .abortSignal(inner.signal)
            .single();
        clearTimeout(timerId); // 성공 시 타이머 취소 — 타이머 누수 방지
        if (error) {
            // PGRST116 = 행 없음 (신규 가입 등) → 'user'로 fall-back (정상 케이스)
            // 그 외 = 네트워크/서버 오류 → catch 블록에서 fail-close 처리
            if (error.code === 'PGRST116') {
                roleCache.set(userId, { role: 'user', ts: Date.now() });
                return 'user';
            }
            throw error;
        }
        const role = data?.role ?? 'user';
        roleCache.set(userId, { role, ts: Date.now() }); // 성공 시 캐시 저장
        return role;
    }
    catch (err) {
        clearTimeout(timerId);
        // 프로필 조회 실패 시 최소 권한으로 fail-close
        // localStorage 캐시는 신뢰하지 않음 (권한 상승 취약점 방지)
        console.warn('[Auth] profiles 권한 조회 실패, user로 기본 설정:', err);
        return 'user';
    }
}
// 로그인·토큰갱신·세션복구에서 반복되는 store+storage 동기화를 단일 진입점으로
// signal: 컴포넌트 언마운트 시 abort → 이미 언마운트된 컴포넌트에 zombie dispatch 방지
export async function applySession(session, signal) {
    const store = getStore();
    const role = await fetchProfileRole(session.user.id, signal);
    if (signal?.aborted)
        throw new Error('applySession aborted');
    const user = mapSupabaseUser(session.user, role);
    store.dispatch(setAccessToken(session.access_token));
    store.dispatch(setUser(user));
    storage.setUser(user);
    return user;
}
export function useSupabaseLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const supabase = getSupabase();
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
            const user = await applySession(data.session);
            return { session: data.session, user };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
            setError(message);
            console.error('[Supabase Login] 로그인 실패:', message);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return { login, isLoading, error };
}
export function useSupabaseLogout() {
    const [isLoading, setIsLoading] = useState(false);
    const doLogout = useCallback(async () => {
        setIsLoading(true);
        const supabase = getSupabase();
        const store = getStore();
        try {
            await supabase.auth.signOut();
        }
        catch (err) {
            console.error('[Supabase Logout] 로그아웃 실패:', err);
        }
        finally {
            // signOut 성공/실패 무관하게 Redux 상태도 반드시 로그아웃 처리
            // storage.clearAuth() 는 authMiddleware 가 logout 액션을 감지하여 자동 호출
            // roleCache.clear(): 로그아웃 직후 재로그인 시 stale role(admin→user 강등 등) 사용 방지
            clearRoleCache();
            store.dispatch(logout());
            store.dispatch(clearRecentMenu());
            setIsLoading(false);
        }
    }, []);
    return { logout: doLogout, isLoading };
}
export function useSupabaseSession() {
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let mounted = true; // 언마운트 후 비동기 콜백이 setState 호출하는 것 방지
        const supabase = getSupabase();
        // 현재 세션 가져오기
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted)
                return;
            setSession(session);
            setIsLoading(false);
        });
        // 세션 변경 구독
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted)
                return;
            setSession(session);
        });
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);
    // user 필드 미노출 — mapSupabaseUser의 기본 role='user'로 admin이 user로 다운그레이드됨.
    // 인증된 사용자 정보는 Redux store(useSelector(selectUser))에서 읽어야 함
    // (applySession이 profiles 테이블에서 서버 role을 조회한 뒤 dispatch함)
    return {
        session,
        isLoading,
        isAuthenticated: !!session,
    };
}
// MF 환경에서 lib 가 두 인스턴스로 로드될 수 있으므로 모듈 레벨 플래그는 신뢰 불가.
// globalThis + Symbol.for 로 진짜 단일 인스턴스 가드를 만든다.
const MFA_AUTH_SYNC = Symbol.for('mfa:authSyncMounted');
const isAuthSyncMounted = () => !!globalThis[MFA_AUTH_SYNC];
const setAuthSyncMounted = (v) => { globalThis[MFA_AUTH_SYNC] = v; };
/** @deprecated 이전 버전 호환용. 실제 값은 globalThis Symbol에서 읽음 — 직접 import 하지 마세요. */
export const _authSyncMounted = false; // getter 대신 false 상수 (consumer는 isAuthSyncMounted() 사용)
export function useSupabaseAuthSync() {
    const ownedRef = useRef(false); // 이 인스턴스가 구독을 소유하는지 추적
    useEffect(() => {
        if (isAuthSyncMounted()) {
            console.warn('[Auth] useSupabaseAuthSync가 중복 마운트됨. useSupabaseInitialize와 함께 사용하지 마세요.');
            return; // cleanup 없음 — 소유권 없음. subscription이 undefined인 상태에서 unsubscribe() 호출 방지
        }
        setAuthSyncMounted(true);
        ownedRef.current = true;
        const supabase = getSupabase();
        const store = getStore();
        // AbortController: cleanup 시 abort → 진행 중인 applySession이 dispatch 전에 조기 종료
        // zombie dispatch (언마운트 후 store 변경) 방지
        const ctrl = new AbortController();
        // onAuthStateChange 콜백을 직렬화 — Supabase는 async 콜백을 await하지 않으므로
        // 연속 이벤트(TOKEN_REFRESHED 직후 SIGNED_IN 등)가 동시에 applySession을 실행하면
        // fetchProfileRole 응답 순서에 따라 최종 Redux 상태가 결정됨 (비결정론적)
        let authQueue = Promise.resolve();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // INITIAL_SESSION은 useSupabaseInitialize에서 이미 처리됨
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
                    // SIGNED_OUT, USER_DELETED, 세션 만료 등 — 모든 null 세션 케이스 처리
                    if (!ctrl.signal.aborted)
                        store.dispatch(logout());
                }
            }).catch(err => {
                if (err?.message !== 'applySession aborted') {
                    console.error('[Auth] applySession 실패:', err);
                }
            });
        });
        return () => {
            if (!ownedRef.current)
                return; // 소유권 없으면 cleanup 스킵 (subscription이 없음)
            setAuthSyncMounted(false);
            ctrl.abort();
            subscription.unsubscribe();
        };
    }, []);
}
export function useTokenAutoRefresh(refreshBeforeMinutes = 5) {
    const isRefreshingRef = useRef(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    useEffect(() => {
        const supabase = getSupabase();
        let timeoutId = null;
        const scheduleRefresh = async () => {
            if (timeoutId)
                clearTimeout(timeoutId);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.expires_at)
                    return;
                const timeout = session.expires_at * 1000 - refreshBeforeMinutes * 60 * 1000 - Date.now();
                if (timeout <= 0) {
                    await performRefresh();
                    return;
                }
                timeoutId = setTimeout(() => { performRefresh(); }, timeout);
            }
            catch (err) {
                console.error('[Token Auto Refresh] 갱신 스케줄링 실패:', err);
            }
        };
        const performRefresh = async () => {
            if (isRefreshingRef.current)
                return;
            isRefreshingRef.current = true;
            try {
                const { data, error } = await supabase.auth.refreshSession();
                if (error)
                    throw error;
                if (data.session) {
                    await applySession(data.session);
                    setLastRefreshed(new Date());
                    scheduleRefresh();
                }
            }
            catch (err) {
                console.error('[Token Auto Refresh] 토큰 갱신 실패:', err);
            }
            finally {
                isRefreshingRef.current = false;
            }
        };
        scheduleRefresh();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                scheduleRefresh();
            }
        });
        return () => {
            if (timeoutId)
                clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    }, [refreshBeforeMinutes]);
    // isRefreshing 은 ref 라 reactive 하지 않아 consumer 에게 잘못된 값 노출 → 제거
    return { lastRefreshed };
}
