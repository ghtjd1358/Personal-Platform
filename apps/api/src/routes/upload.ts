import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { supabase } from '../lib/supabase'
import { env } from '../config/env'
import crypto from 'crypto'

const router = Router()

const BUCKET = 'portfolio-images'

// presigned URL 발급 — 클라이언트가 직접 Supabase Storage에 업로드
// (대용량 파일을 Node.js 서버를 통하지 않아 메모리 절약)
router.post('/presign', authenticate, async (req, res) => {
  const { fileName, contentType } = req.body
  const ext = fileName?.split('.').pop() || 'jpg'
  const key = `${req.user!.userId}/${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(key)

  if (error) { res.status(500).json({ code: 'STORAGE_ERROR', message: error.message }); return }

  res.json({
    data: {
      uploadUrl: data.signedUrl,
      token: data.token,
      path: key,
      publicUrl: `${env.supabaseUrl}/storage/v1/object/public/${BUCKET}/${key}`,
    }
  })
})

// 업로드된 파일 삭제
router.delete('/', authenticate, async (req, res) => {
  const { path } = req.body
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) { res.status(500).json({ code: 'STORAGE_ERROR', message: error.message }); return }
  res.json({ data: { path } })
})

export default router
