import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { blogController } from './blog.controller'

const router = Router()

router.get('/posts', blogController.getPosts)
router.get('/posts/id/:id', authenticate, blogController.getPostById)
router.get('/posts/:slug', blogController.getPostBySlug)
router.post('/posts', authenticate, blogController.createPost)
router.put('/posts/:id', authenticate, blogController.updatePost)
router.delete('/posts/:id', authenticate, blogController.deletePost)

router.post('/posts/:id/likes/toggle', authenticate, blogController.toggleLike)

router.get('/posts/:id/comments', blogController.getComments)
router.post('/posts/:id/comments', authenticate, blogController.createComment)
router.delete('/posts/:id/comments/:commentId', authenticate, blogController.deleteComment)

export default router
