import { supabase } from '../../lib/supabase'

export const blogService = {
  getPosts: async (query: Record<string, string>) => {
    const { search, sort = 'date_desc', page = '1', limit = '12' } = query
    const pageNum = Math.max(1, parseInt(page))
    const pageSize = Math.min(50, parseInt(limit))

    let q = supabase
      .from('blog_posts')
      .select('*, blog_post_tags(*)', { count: 'exact' })
      .eq('status', 'published')

    if (search) q = q.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)

    const [field, dir] = sort.split('_')
    const colMap: Record<string, string> = { date: 'created_at', views: 'view_count', likes: 'like_count' }
    q = q.order(colMap[field] ?? 'created_at', { ascending: dir === 'asc' })
    q = q.range((pageNum - 1) * pageSize, pageNum * pageSize - 1)

    return q
  },

  getPostBySlug: (slug: string) =>
    supabase
      .from('blog_posts')
      .select('*, blog_post_tags(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),

  getPostById: (id: string, userId: string) =>
    supabase
      .from('blog_posts')
      .select('*, blog_post_tags(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single(),

  incrementViewCount: (id: string, current: number) => {
    void supabase.from('blog_posts').update({ view_count: current + 1 }).eq('id', id)
  },

  createPost: async (body: Record<string, unknown>, userId: string, tags?: string[]) => {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({ ...body, user_id: userId })
      .select()
      .single()
    if (error || !post) return { post: null, error }
    if (tags?.length) {
      await supabase.from('blog_post_tags').insert(tags.map((tag) => ({ post_id: post.id, tag })))
    }
    return { post, error: null }
  },

  updatePost: async (id: string, userId: string, body: Record<string, unknown>, tags?: string[]) => {
    const { tags: _t, ...fields } = body as { tags?: string[]; [k: string]: unknown }
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    if (error || !data) return { data: null, error }
    if (tags !== undefined) {
      await supabase.from('blog_post_tags').delete().eq('post_id', id)
      if (tags.length) {
        await supabase.from('blog_post_tags').insert(tags.map((tag) => ({ post_id: id, tag })))
      }
    }
    return { data, error: null }
  },

  deletePost: (id: string, userId: string) =>
    supabase.from('blog_posts').delete().eq('id', id).eq('user_id', userId),

  toggleLike: async (postId: string, userId: string) => {
    const { data: existing } = await supabase
      .from('blog_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()
    if (existing) {
      await supabase.from('blog_post_likes').delete().eq('id', existing.id)
      return { isLiked: false }
    }
    await supabase.from('blog_post_likes').insert({ post_id: postId, user_id: userId })
    return { isLiked: true }
  },

  getComments: (postId: string) =>
    supabase
      .from('blog_post_comments')
      .select('*, users(id, name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true }),

  createComment: (postId: string, userId: string, content: string) =>
    supabase
      .from('blog_post_comments')
      .insert({ post_id: postId, user_id: userId, content })
      .select('*, users(id, name, avatar_url)')
      .single(),

  deleteComment: (commentId: string, userId: string) =>
    supabase.from('blog_post_comments').delete().eq('id', commentId).eq('user_id', userId),
}
