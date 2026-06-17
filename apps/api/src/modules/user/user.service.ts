import { supabase } from '../../lib/supabase'

export const userService = {
  getMe: (userId: string) =>
    supabase
      .from('users')
      .select('id, email, name, avatar_url, created_at')
      .eq('id', userId)
      .single(),

  getUserWithRole: async (userId: string) => {
    const [userResult, profileResult] = await Promise.all([
      supabase.from('users').select('id, email, name, avatar_url').eq('id', userId).single(),
      supabase.from('profiles').select('role').eq('id', userId).maybeSingle(),
    ])
    if (userResult.error) return { data: null, error: userResult.error }
    return {
      data: {
        ...userResult.data,
        role: (profileResult.data?.role ?? 'user') as 'admin' | 'user',
      },
      error: null,
    }
  },
}
