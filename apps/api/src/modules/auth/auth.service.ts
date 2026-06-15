import { supabase } from '../../lib/supabase'

export const authService = {
  upsertUser: async (email: string, name: string, avatarUrl?: string) => {
    const { data, error } = await supabase
      .from('users')
      .upsert({ email, name, avatar_url: avatarUrl, provider: 'google' }, { onConflict: 'email' })
      .select('id, email, name, avatar_url')
      .single()
    return { data, error }
  },
}
