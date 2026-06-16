import { Session } from '@supabase/supabase-js';
import { User } from '../types';
/** 특정 사용자(또는 전체) roleCache 무효화 — 로그아웃 또는 권한 변경 즉시 반영 시 호출 */
export declare function clearRoleCache(userId?: string): void;
export declare function applySession(session: Session, signal?: AbortSignal): Promise<User>;
export declare function useSupabaseLogin(): {
    login: (email: string, password: string) => Promise<{
        session: Session;
        user: User;
    }>;
    isLoading: boolean;
    error: string | null;
};
export declare function useSupabaseLogout(): {
    logout: () => Promise<void>;
    isLoading: boolean;
};
export declare function useSupabaseSession(): {
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
};
/** @deprecated 이전 버전 호환용. 실제 값은 globalThis Symbol에서 읽음 — 직접 import 하지 마세요. */
export declare const _authSyncMounted: boolean;
export declare function useSupabaseAuthSync(): void;
export declare function useTokenAutoRefresh(refreshBeforeMinutes?: number): {
    lastRefreshed: Date | null;
};
//# sourceMappingURL=use-supabase-auth.d.ts.map