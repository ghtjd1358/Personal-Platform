import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { userController } from './user.controller'

const router = Router()

router.get('/me', authenticate, userController.getMe)

export default router
