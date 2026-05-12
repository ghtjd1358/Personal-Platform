/**
 * Initialize Hook
 * 앱 시작시 초기화 (토큰 갱신, 사용자 정보 로드)
 */
import { User } from '../types';
export interface InitializeOptions {
    refreshToken?: () => Promise<string | null>;
    fetchUserInfo?: () => Promise<User | null>;
    onInitialized?: () => void;
    onError?: (error: Error) => void;
}
/**
 * 앱 초기화 Hook
 */
export declare function useInitialize(options?: InitializeOptions): {
    initialized: boolean;
    loading: boolean;
    error: Error | null;
};
/**
 * 간단한 초기화 Hook (토큰/사용자 정보 복구만)
 */
export declare function useSimpleInitialize(): {
    initialized: boolean;
};
/**
 * Supabase 초기화 Hook
 * 앱 시작 시 Supabase 세션 복구 및 Auth 상태 변경 구독
 */
export declare function useSupabaseInitialize(): {
    initialized: boolean;
};
//# sourceMappingURL=use-initialize.d.ts.map