import { Session } from '@supabase/supabase-js';
import { User } from '../types';
/** 특정 사용자(또는 전체) roleCache 무효화 */
export declare function clearRoleCache(userId?: string): void;
export declare function applySession(session: Session, signal?: AbortSignal): Promise<User>;
export declare function useSupabaseLogout(): {
    logout: () => Promise<void>;
    isLoading: boolean;
};
//# sourceMappingURL=use-supabase-auth.d.ts.map