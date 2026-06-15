import { Request, Response } from 'express'
import { portfolioService } from './portfolio.service'
import { ok, created, notFound, dbError } from '../../common/response'

const p = (v: string | string[]) => (Array.isArray(v) ? v[0] : v)

export const portfolioController = {
  getPortfolios: async (req: Request, res: Response) => {
    const { data, error } = await portfolioService.getPortfolios(req.query as Record<string, string>)
    if (error) return dbError(res, error.message)
    ok(res, data)
  },

  getPortfolioById: async (req: Request, res: Response) => {
    const { data, error } = await portfolioService.getPortfolioById(p(req.params.id))
    if (error || !data) return notFound(res)
    portfolioService.incrementViewCount(p(req.params.id), data.view_count || 0)
    ok(res, data)
  },

  createPortfolio: async (req: Request, res: Response) => {
    const { data, error } = await portfolioService.createPortfolio(req.body, req.user!.userId)
    if (error || !data) return dbError(res, error?.message ?? '생성 실패')
    created(res, data)
  },

  updatePortfolio: async (req: Request, res: Response) => {
    const { data, error } = await portfolioService.updatePortfolio(p(req.params.id), req.user!.userId, req.body)
    if (error || !data) return dbError(res, error?.message ?? '수정 실패')
    ok(res, data)
  },

  deletePortfolio: async (req: Request, res: Response) => {
    const { error } = await portfolioService.deletePortfolio(p(req.params.id), req.user!.userId)
    if (error) return dbError(res, error.message)
    ok(res, { id: req.params.id })
  },

  getComments: async (req: Request, res: Response) => {
    const { data, error } = await portfolioService.getComments(p(req.params.id))
    if (error) return dbError(res, error.message)
    ok(res, data)
  },

  createComment: async (req: Request, res: Response) => {
    const { data, error } = await portfolioService.createComment(p(req.params.id), req.user!.userId, req.body.content)
    if (error || !data) return dbError(res, error?.message ?? '댓글 생성 실패')
    created(res, data)
  },

  deleteComment: async (req: Request, res: Response) => {
    const { error } = await portfolioService.deleteComment(p(req.params.commentId), req.user!.userId)
    if (error) return dbError(res, error.message)
    ok(res, { id: req.params.commentId })
  },

  getLikes: async (req: Request, res: Response) => {
    const [{ count }, { data }] = await portfolioService.getLikes(p(req.params.id), req.query.userId as string)
    ok(res, { count: count ?? 0, isLiked: Boolean(data) })
  },

  toggleLike: async (req: Request, res: Response) => {
    const result = await portfolioService.toggleLike(p(req.params.id), req.user!.userId)
    ok(res, result)
  },
}
