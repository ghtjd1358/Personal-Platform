import { randomUUID } from 'crypto'
import { supabase } from '../../lib/supabase'

export const authService = {
  upsertUser: async (email: string, name: string, avatarUrl?: string) => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ name, avatar_url: avatarUrl })
        .eq('email', email)
        .select('id, email, name, avatar_url')
        .single()
      return { data, error }
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: randomUUID(), email, name, avatar_url: avatarUrl })
      .select('id, email, name, avatar_url')
      .single()
    return { data, error }
  },
}
