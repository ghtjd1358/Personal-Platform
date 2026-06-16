import { Request, Response } from 'express'
import { blogService } from './blog.service'
import { ok, created, notFound, dbError } from '../../common/response'

// Express v5 타입에서 req.params 값이 string | string[] — 런타임에선 항상 string
const p = (v: string | string[]) => (Array.isArray(v) ? v[0] : v)

export const blogController = {
  getPosts: async (req: Request, res: Response) => {
    const { data, count, error } = await blogService.getPosts(req.query as Record<string, string>)
    if (error) return dbError(res, error.message)
    ok(res, { posts: data, total: count ?? 0 })
  },

  getPostBySlug: async (req: Request, res: Response) => {
    const { data, error } = await blogService.getPostBySlug(p(req.params.slug))
    if (error || !data) return notFound(res)
    blogService.incrementViewCount(data.id, data.view_count || 0)
    ok(res, data)
  },

  getPostById: async (req: Request, res: Response) => {
    const { data, error } = await blogService.getPostById(p(req.params.id), req.user!.userId)
    if (error || !data) return notFound(res)
    ok(res, data)
  },

  createPost: async (req: Request, res: Response) => {
    const { tags, ...body } = req.body
    const { post, error } = await blogService.createPost(body, req.user!.userId, tags)
    if (error || !post) return dbError(res, error?.message ?? '생성 실패')
    created(res, post)
  },

  updatePost: async (req: Request, res: Response) => {
    const { tags, ...body } = req.body
    const { data, error } = await blogService.updatePost(p(req.params.id), req.user!.userId, body, tags)
    if (error || !data) return dbError(res, error?.message ?? '수정 실패')
    ok(res, data)
  },

  deletePost: async (req: Request, res: Response) => {
    const { error } = await blogService.deletePost(p(req.params.id), req.user!.userId)
    if (error) return dbError(res, error.message)
    ok(res, { id: req.params.id })
  },

  toggleLike: async (req: Request, res: Response) => {
    const result = await blogService.toggleLike(p(req.params.id), req.user!.userId)
    ok(res, result)
  },

  getComments: async (req: Request, res: Response) => {
    const { data, error } = await blogService.getComments(p(req.params.id))
    if (error) return dbError(res, error.message)
    ok(res, data)
  },

  createComment: async (req: Request, res: Response) => {
    const { data, error } = await blogService.createComment(p(req.params.id), req.user!.userId, req.body.content)
    if (error || !data) return dbError(res, error?.message ?? '댓글 생성 실패')
    created(res, data)
  },

  deleteComment: async (req: Request, res: Response) => {
    const { error } = await blogService.deleteComment(p(req.params.commentId), req.user!.userId)
    if (error) return dbError(res, error.message)
    ok(res, { id: req.params.commentId })
  },
}
