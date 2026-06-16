import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { portfolioController } from './portfolio.controller'

const router = Router()

router.get('/', portfolioController.getPortfolios)
router.get('/:id', portfolioController.getPortfolioById)
router.post('/', authenticate, portfolioController.createPortfolio)
router.put('/:id', authenticate, portfolioController.updatePortfolio)
router.delete('/:id', authenticate, portfolioController.deletePortfolio)

router.get('/:id/comments', portfolioController.getComments)
router.post('/:id/comments', authenticate, portfolioController.createComment)
router.delete('/:id/comments/:commentId', authenticate, portfolioController.deleteComment)

router.get('/:id/likes', portfolioController.getLikes)
router.post('/:id/likes/toggle', authenticate, portfolioController.toggleLike)

export default router
