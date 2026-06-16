import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { supabase } from '../lib/supabase'

const router = Router()

// ──────────────────────────────────────────────
// Posts 목록
// ──────────────────────────────────────────────

router.get('/posts', async (req, res) => {
  const { search, sort = 'date_desc', page = '1', limit = '12' } = req.query as Record<string, string>

  let query = supabase
    .from('blog_posts')
    .select('*, post_tags(*)', { count: 'exact' })
    .eq('status', 'published')

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const [field, dir] = sort.split('_') as [string, string]
  const colMap: Record<string, string> = { date: 'created_at', views: 'view_count', likes: 'like_count' }
  query = query.order(colMap[field] ?? 'created_at', { ascending: dir === 'asc' })

  const pageNum = Math.max(1, parseInt(page))
  const pageSize = Math.min(50, parseInt(limit))
  query = query.range((pageNum - 1) * pageSize, pageNum * pageSize - 1)

  const { data, count, error } = await query
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }

  res.json({ data, total: count ?? 0 })
})

// ──────────────────────────────────────────────
// Post 상세 — slug
// ──────────────────────────────────────────────

router.get('/posts/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, post_tags(*)')
    .eq('slug', req.params.slug)
    .eq('status', 'published')
    .single()

  if (error || !data) { res.status(404).json({ code: 'NOT_FOUND' }); return }

  // 조회수 fire-and-forget — 실패해도 응답 블로킹 안 함
  supabase.from('blog_posts').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id).catch(() => {})

  res.json({ data })
})

// ──────────────────────────────────────────────
// Post 상세 — id (에디터용)
// ──────────────────────────────────────────────

router.get('/posts/id/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, post_tags(*)')
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
    .single()

  if (error || !data) { res.status(404).json({ code: 'NOT_FOUND' }); return }
  res.json({ data })
})

// ──────────────────────────────────────────────
// Post CRUD (인증 필요)
// ──────────────────────────────────────────────

router.post('/posts', authenticate, async (req, res) => {
  const { tags, ...body } = req.body
  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert({ ...body, user_id: req.user!.userId })
    .select()
    .single()

  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }

  if (tags?.length) {
    await supabase.from('post_tags').insert(tags.map((tag: string) => ({ post_id: post.id, tag })))
  }

  res.status(201).json({ data: post })
})

router.put('/posts/:id', authenticate, async (req, res) => {
  const { tags, ...body } = req.body
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
    .select()
    .single()

  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }

  if (tags) {
    await supabase.from('post_tags').delete().eq('post_id', req.params.id)
    if (tags.length) {
      await supabase.from('post_tags').insert(tags.map((tag: string) => ({ post_id: req.params.id, tag })))
    }
  }

  res.json({ data })
})

router.delete('/posts/:id', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.userId)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.id } })
})

// ──────────────────────────────────────────────
// Likes
// ──────────────────────────────────────────────

router.post('/posts/:id/likes/toggle', authenticate, async (req, res) => {
  const { data: existing } = await supabase
    .from('blog_post_likes')
    .select('id')
    .eq('post_id', req.params.id)
    .eq('user_id', req.user!.userId)
    .single()

  if (existing) {
    await supabase.from('blog_post_likes').delete().eq('id', existing.id)
    res.json({ data: { isLiked: false } })
  } else {
    await supabase.from('blog_post_likes').insert({ post_id: req.params.id, user_id: req.user!.userId })
    res.json({ data: { isLiked: true } })
  }
})

// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

router.get('/posts/:id/comments', async (req, res) => {
  const { data, error } = await supabase
    .from('blog_post_comments')
    .select('*, users(id, name, avatar_url)')
    .eq('post_id', req.params.id)
    .order('created_at', { ascending: true })
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data })
})

router.post('/posts/:id/comments', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('blog_post_comments')
    .insert({ post_id: req.params.id, user_id: req.user!.userId, content: req.body.content })
    .select('*, users(id, name, avatar_url)')
    .single()
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.status(201).json({ data })
})

router.delete('/posts/:id/comments/:commentId', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('blog_post_comments')
    .delete()
    .eq('id', req.params.commentId)
    .eq('user_id', req.user!.userId)
  if (error) { res.status(500).json({ code: 'DB_ERROR', message: error.message }); return }
  res.json({ data: { id: req.params.commentId } })
})

export default router
