import { User } from '../types';
export { useSimpleInitialize, restoreFromStorage } from './use-simple-initialize';
export { useSupabaseInitialize } from './use-supabase-initialize';
export interface InitializeOptions {
    refreshToken?: () => Promise<string | null>;
    fetchUserInfo?: () => Promise<User | null>;
    onInitialized?: () => void;
    onError?: (error: Error) => void;
}
export declare function useInitialize(options?: InitializeOptions): {
    initialized: boolean;
    loading: boolean;
    error: Error | null;
};
//# sourceMappingURL=use-initialize.d.ts.map