import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { supabase } from '../lib/supabase'

const router = Router()

// 내 정보 조회 — KOMCA의 getCommonAuthMe 대응
router.get('/me', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, avatar_url, created_at')
    .eq('id', req.user!.userId)
    .single()

  if (error) {
    res.status(500).json({ code: 'DB_ERROR', message: error.message })
    return
  }

  res.json({ data })
})

export default router
