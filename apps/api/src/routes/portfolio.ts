import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { supabase } from '../lib/supabase'

const router = Router()

// ──────────────────────────────────────────────
// Portfolios
// ──────────────────────────────────────────────

router.get('/', async (req, res) => {
  const { userId, status, featured, show_on_resume } = req.query
  let query = supabase
    .from('portfolios')
    .select(`*, portfolio_tags(*), portfolio_tech_stack(*), portfolio_details(*)`)
    .order('order_index')

  if (userId) query = query.eq('user_id', userId)
  if (status) query = query.eq('status', status)
  if (featured === 'true') query = query.eq('is_featured', true)
  if (show_on_resume === 'true') query = query.eq('show_on_resume', true)

  const { data, error } = await query
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('portfolios')
    .select(`*, portfolio_tags(*), portfolio_tech_stack(*), portfolio_details(*)`)
    .eq('id', req.params.id)
    .single()
  if (error) { res.status(404).json({ code: 'NOT_FOUND' }); return }

  // 조회수 increment (fire-and-forget)
  supabase.from('portfolios').update({ view_count: (data.view_count || 0) + 1 }).eq('id', req.params.id)

  res.json({ data })
})

router.post('/', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('portfolios')
    .insert({ ...req.body, user_id: req.user!.userId })
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.put('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('portfolios')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
    .select()
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.delete('/:id', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.id } })
})

// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

router.get('/:id/comments', async (req, res) => {
  const { data, error } = await supabase
    .from('portfolio_comments')
    .select(`*, users(id, name, avatar_url)`)
    .eq('portfolio_id', req.params.id)
    .order('created_at', { ascending: false })
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.post('/:id/comments', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('portfolio_comments')
    .insert({ portfolio_id: req.params.id, user_id: req.user!.userId, content: req.body.content })
    .select(`*, users(id, name, avatar_url)`)
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.delete('/:id/comments/:commentId', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('portfolio_comments')
    .delete()
    .eq('id', req.params.commentId)
    .eq('user_id', req.user!.userId)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.commentId } })
})

// ──────────────────────────────────────────────
// Likes
// ──────────────────────────────────────────────

router.get('/:id/likes', async (req, res) => {
  const userId = req.query.userId as string
  const { count } = await supabase
    .from('portfolio_likes')
    .select('*', { count: 'exact', head: true })
    .eq('portfolio_id', req.params.id)

  let isLiked = false
  if (userId) {
    const { data } = await supabase
      .from('portfolio_likes')
      .select('id')
      .eq('portfolio_id', req.params.id)
      .eq('user_id', userId)
      .single()
    isLiked = Boolean(data)
  }

  res.json({ data: { count: count ?? 0, isLiked } })
})

router.post('/:id/likes/toggle', authenticate, async (req, res) => {
  const portfolioId = req.params.id
  const userId = req.user!.userId

  const { data: existing } = await supabase
    .from('portfolio_likes')
    .select('id')
    .eq('portfolio_id', portfolioId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    await supabase.from('portfolio_likes').delete().eq('id', existing.id)
    res.json({ data: { isLiked: false } })
  } else {
    await supabase.from('portfolio_likes').insert({ portfolio_id: portfolioId, user_id: userId })
    res.json({ data: { isLiked: true } })
  }
})

export default router
