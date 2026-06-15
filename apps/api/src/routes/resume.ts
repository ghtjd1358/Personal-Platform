import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { supabase } from '../lib/supabase'

const router = Router()

// ──────────────────────────────────────────────
// Experiences
// ──────────────────────────────────────────────

router.get('/experiences', async (req, res) => {
  const userId = req.query.userId as string
  const query = supabase
    .from('experiences')
    .select(`*, experience_tasks(*), experience_tags(*)`)
    .order('order_index')

  if (userId) query.eq('user_id', userId)

  const { data, error } = await query
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.get('/experiences/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('experiences')
    .select(`*, experience_tasks(*), experience_tags(*)`)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
    .single()
  if (error || !data) { res.status(404).json({ code: 'NOT_FOUND' }); return }
  res.json({ data })
})

router.put('/experiences/:id/tasks', authenticate, async (req, res) => {
  const tasks: string[] = req.body.tasks ?? []
  await supabase.from('experience_tasks').delete().eq('experience_id', req.params.id)
  if (tasks.length) {
    await supabase.from('experience_tasks').insert(
      tasks.map((task, i) => ({ experience_id: req.params.id, task, order_index: i }))
    )
  }
  res.json({ data: { id: req.params.id } })
})

router.put('/experiences/:id/tags', authenticate, async (req, res) => {
  const tags: string[] = req.body.tags ?? []
  await supabase.from('experience_tags').delete().eq('experience_id', req.params.id)
  if (tags.length) {
    await supabase.from('experience_tags').insert(
      tags.map((tag) => ({ experience_id: req.params.id, tag }))
    )
  }
  res.json({ data: { id: req.params.id } })
})

router.post('/experiences', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert({ ...req.body, user_id: req.user!.userId })
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.put('/experiences/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('experiences')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.delete('/experiences/:id', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.id } })
})

// ──────────────────────────────────────────────
// Skills
// ──────────────────────────────────────────────

router.get('/skills', async (req, res) => {
  const userId = req.query.userId as string
  const query = supabase
    .from('skill_categories')
    .select(`*, skills(*)`)
    .order('order_index')

  if (userId) query.eq('user_id', userId)

  const { data, error } = await query
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.post('/skills/categories', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('skill_categories')
    .insert({ ...req.body, user_id: req.user!.userId })
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.post('/skills', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .insert(req.body)
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.put('/skills/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.delete('/skills/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('skills').delete().eq('id', req.params.id)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.id } })
})

// ──────────────────────────────────────────────
// Features (주요 작업물)
// ──────────────────────────────────────────────

router.get('/features', async (req, res) => {
  const userId = req.query.userId as string
  const query = supabase.from('features').select('*').order('order_index')
  if (userId) query.eq('user_id', userId)
  const { data, error } = await query
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.post('/features', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('features')
    .insert({ ...req.body, user_id: req.user!.userId })
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.put('/features/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('features')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.delete('/features/:id', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('features')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.id } })
})

// ──────────────────────────────────────────────
// Resume PDF — Supabase Storage signed URL
// ──────────────────────────────────────────────

router.get('/pdf-url', async (_req, res) => {
  const BUCKET = 'hoseong_resumes'
  const FILE = 'resume_v2.pdf'

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(FILE, 60 * 60) // 1시간 유효

  if (error || !data) {
    res.status(500).json({ code: 'STORAGE_ERROR', message: error?.message })
    return
  }

  res.json({ data: { url: data.signedUrl } })
})

export default router
