import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from '../../config/env'
import { authService } from './auth.service'
import { authController } from './auth.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value!
        const { data, error } = await authService.upsertUser(
          email,
          profile.displayName,
          profile.photos?.[0].value,
        )
        if (error || !data) return done(error)
        // JwtPayload 형태로 매핑 — req.user 타입 일관성
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return done(null, { userId: data.id, email: data.email } as any)
      } catch (err) {
        return done(err)
      }
    },
  ),
)

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
