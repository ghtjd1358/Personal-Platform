import { Router } from 'express'
import passport from 'passport'
import { env } from '../../config/env'
import { authController } from './auth.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${env.clientUrls[0]}/login?error=oauth`, session: false }),
  authController.googleCallback,
)
router.get('/me', authenticate, authController.me)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

export default router
