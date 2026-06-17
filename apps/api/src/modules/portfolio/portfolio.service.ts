import { supabase } from '../../lib/supabase'

const SELECT_PORTFOLIO = '*, portfolio_tags(*), portfolio_tech_stack(*), portfolio_details(*)'

interface PortfolioWriteBody {
  title?: string
  description?: string
  thumbnail_url?: string
  status?: string
  is_featured?: boolean
  show_on_resume?: boolean
  order_index?: number
}

export const portfolioService = {
  getPortfolios: (query: Record<string, string>) => {
    let q = supabase.from('portfolios').select(SELECT_PORTFOLIO).order('order_index')
    if (query.userId) q = q.eq('user_id', query.userId)
    if (query.status) q = q.eq('status', query.status)
    if (query.featured === 'true') q = q.eq('is_featured', true)
    if (query.show_on_resume === 'true') q = q.eq('show_on_resume', true)
    return q
  },

  getPortfolioById: (id: string) =>
    supabase.from('portfolios').select(SELECT_PORTFOLIO).eq('id', id).single(),

  incrementViewCount: (id: string, current: number) => {
    void supabase.from('portfolios').update({ view_count: current + 1 }).eq('id', id)
  },

  createPortfolio: (body: PortfolioWriteBody, userId: string) =>
    supabase
      .from('portfolios')
      .insert({
        title: body.title,
        description: body.description,
        thumbnail_url: body.thumbnail_url,
        status: body.status,
        is_featured: body.is_featured,
        show_on_resume: body.show_on_resume,
        order_index: body.order_index,
        user_id: userId,
      })
      .select()
      .single(),

  updatePortfolio: (id: string, userId: string, body: PortfolioWriteBody) =>
    supabase
      .from('portfolios')
      .update({
        title: body.title,
        description: body.description,
        thumbnail_url: body.thumbnail_url,
        status: body.status,
        is_featured: body.is_featured,
        show_on_resume: body.show_on_resume,
        order_index: body.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single(),

  deletePortfolio: (id: string, userId: string) =>
    supabase.from('portfolios').delete().eq('id', id).eq('user_id', userId),

  getComments: (portfolioId: string) =>
    supabase
      .from('portfolio_comments')
      .select('*, users(id, name, avatar_url)')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false }),

  createComment: (portfolioId: string, userId: string, content: string) =>
    supabase
      .from('portfolio_comments')
      .insert({ portfolio_id: portfolioId, user_id: userId, content })
      .select('*, users(id, name, avatar_url)')
      .single(),

  deleteComment: (commentId: string, userId: string) =>
    supabase.from('portfolio_comments').delete().eq('id', commentId).eq('user_id', userId),

  getLikes: (portfolioId: string, userId?: string) =>
    Promise.all([
      supabase.from('portfolio_likes').select('*', { count: 'exact', head: true }).eq('portfolio_id', portfolioId),
      userId
        ? supabase.from('portfolio_likes').select('id').eq('portfolio_id', portfolioId).eq('user_id', userId).single()
        : Promise.resolve({ data: null }),
    ]),

  toggleLike: async (portfolioId: string, userId: string) => {
    const { data: existing } = await supabase
      .from('portfolio_likes')
      .select('id')
      .eq('portfolio_id', portfolioId)
      .eq('user_id', userId)
      .single()
    if (existing) {
      await supabase.from('portfolio_likes').delete().eq('id', existing.id)
      return { isLiked: false }
    }
    await supabase.from('portfolio_likes').insert({ portfolio_id: portfolioId, user_id: userId })
    return { isLiked: true }
  },
}
