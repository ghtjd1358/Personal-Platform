import { storage, initSupabase } from '@sonhoseong/mfa-lib'

// host 플래그 제거 (standalone 명시)
storage.removeHostApp()

// Supabase 싱글톤 초기화 — React 트리 마운트 전에 완료돼야 함
initSupabase({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
})
