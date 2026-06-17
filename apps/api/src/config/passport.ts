import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './env'
import { authService } from '../modules/auth/auth.service'

export function configurePassport() {
  if (!env.googleClientId || !env.googleClientSecret) return

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) return done(new Error('Google 프로필에 이메일 없음'))
          const { data, error } = await authService.upsertUser(
            email,
            profile.displayName,
            profile.photos?.[0]?.value,
          )
          if (error || !data) {
            console.error('[Passport] upsertUser 실패:', error)
            return done(error ?? new Error('upsertUser 실패'))
          }
          return done(null, { userId: data.id, email: data.email })
        } catch (err) {
          return done(err)
        }
      },
    ),
  )
}
