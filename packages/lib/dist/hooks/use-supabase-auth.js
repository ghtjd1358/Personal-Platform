import { useCallback, useState } from 'react';
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
const ROLE_CACHE_TTL = 5 * 60 * 1000;
// MF shared singleton 가정 — lib이 1회만 로드되므로 모듈 레벨 Map으로 충분
const roleCache = new Map();
/** 특정 사용자(또는 전체) roleCache 무효화 */
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
        roleCache.delete(userId);
    }
    if (signal?.aborted)
        return 'user';
    // Promise.race 대신 AbortController — supabase-js가 실제 네트워크 요청을 취소하도록
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
        clearTimeout(timerId);
        if (error) {
            if (error.code === 'PGRST116') {
                roleCache.set(userId, { role: 'user', ts: Date.now() });
                return 'user';
            }
            throw error;
        }
        const role = data?.role ?? 'user';
        roleCache.set(userId, { role, ts: Date.now() });
        return role;
    }
    catch (err) {
        clearTimeout(timerId);
        console.warn('[Auth] profiles 권한 조회 실패, user로 기본 설정:', err);
        return 'user';
    }
}
// 로그인·토큰갱신·세션복구 공통 진입점. signal로 좀비 dispatch 방지
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
            // storage.clearAuth()는 authMiddleware가 logout 액션 감지 시 자동 호출
            clearRoleCache();
            store.dispatch(logout());
            store.dispatch(clearRecentMenu());
            setIsLoading(false);
        }
    }, []);
    return { logout: doLogout, isLoading };
}
