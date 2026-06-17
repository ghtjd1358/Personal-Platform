import { supabase } from '../../lib/supabase'

export const authService = {
  upsertUser: async (email: string, name: string, avatarUrl?: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ email, name, avatar_url: avatarUrl }, { onConflict: 'email' })
      .select('id, email, name, avatar_url')
      .single()
    return { data, error }
  },
}
