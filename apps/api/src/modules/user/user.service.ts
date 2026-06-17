import { supabase } from '../../lib/supabase'

export const userService = {
  getUserWithRole: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, avatar_url, role')
      .eq('id', userId)
      .single()
    if (error) return { data: null, error }
    return {
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
        role: (data.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
      },
      error: null,
    }
  },
}
