import { Router } from 'express'
import passport from 'passport'
import { env } from '../../config/env'
import { authController } from './auth.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

if (env.googleClientId && env.googleClientSecret) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${env.clientUrls[0]}/login?error=oauth`, session: false }),
    authController.googleCallback,
  )
} else {
  router.get('/google', (_req, res) => res.status(503).json({ message: 'Google OAuth not configured' }))
  router.get('/google/callback', (_req, res) => res.status(503).json({ message: 'Google OAuth not configured' }))
}
router.get('/me', authenticate, authController.me)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.post('/login', authController.demoLogin)

export default router
