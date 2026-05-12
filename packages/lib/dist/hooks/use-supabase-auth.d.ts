/**
 * Supabase Auth Hooks
 * Supabase 인증을 위한 전용 hooks
 */
import { Session } from '@supabase/supabase-js';
import { User } from '../types';
/**
 * Supabase 로그인 Hook
 */
export declare function useSupabaseLogin(): {
    login: (email: string, password: string) => Promise<{
        session: Session;
        user: User;
    }>;
    isLoading: boolean;
    error: string | null;
};
/**
 * Supabase 로그아웃 Hook
 */
export declare function useSupabaseLogout(): {
    logout: () => Promise<void>;
    isLoading: boolean;
};
/**
 * Supabase 세션 Hook
 * 현재 세션 상태를 반환하고 변경을 구독
 */
export declare function useSupabaseSession(): {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
};
/**
 * Supabase Auth 상태 변경 구독 Hook
 * Redux store와 동기화
 */
export declare function useSupabaseAuthSync(): void;
/**
 * 토큰 만료 전 선제 갱신 Hook
 * KOMCA 스타일: 만료 5분 전 자동으로 토큰 갱신
 * @param refreshBeforeMinutes 만료 전 갱신 시점 (분), 기본값 5분
 */
export declare function useTokenAutoRefresh(refreshBeforeMinutes?: number): {
    isRefreshing: boolean;
    lastRefreshed: Date | null;
};
//# sourceMappingURL=use-supabase-auth.d.ts.map