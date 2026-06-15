import { supabase } from '../../lib/supabase'

export const userService = {
  getMe: (userId: string) =>
    supabase
      .from('users')
      .select('id, email, name, avatar_url, created_at')
      .eq('id', userId)
      .single(),
}
