import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env'

// SERVICE_ROLE_KEY: 서버에서만 사용, RLS 우회 가능 — 절대 클라이언트에 노출 금지
export const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
