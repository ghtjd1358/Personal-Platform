import { SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';
export interface SupabaseClientConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
}
export declare function initSupabase(config: SupabaseClientConfig): SupabaseClient;
export declare function getSupabase(): SupabaseClient;
export type { SupabaseClient, Session, SupabaseUser };
//# sourceMappingURL=supabase-client.d.ts.map