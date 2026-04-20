/**
 * TechBlog Supabase Client
 *
 * Uses the shared Supabase client from @sonhoseong/mfa-lib
 * This file provides local re-exports for convenience
 */

import { getSupabase, initSupabase } from '@sonhoseong/mfa-lib';

// Re-export for local usage
export { getSupabase, initSupabase };

/**
 * Get Supabase client instance
 * @returns Supabase client
 * @throws Error if Supabase is not initialized
 *
 * @example
 * ```ts
 * const supabase = getSupabase();
 * const { data, error } = await supabase.from('jobs').select('*');
 * ```
 */
export const supabase = () => getSupabase();
