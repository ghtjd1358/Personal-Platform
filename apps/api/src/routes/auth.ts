import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from '../config/env'
import { supabase } from '../lib/supabase'
import { signAccessToken, signRefreshToken, setRefreshCookie, clearRefreshCookie, verifyRefreshToken } from '../lib/token'

const router = Router()

passport.use(new GoogleStrategy(
  {
    clientID: env.googleClientId,
    clientSecret: env.googleClientSecret,
    callbackURL: env.googleCallbackUrl,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value!
      const name = profile.displayName
      const avatarUrl = profile.photos?.[0].value

      // upsert: 첫 로그인이면 생성, 재로그인이면 업데이트
      const { data, error } = await supabase
        .from('users')
        .upsert({ email, name, avatar_url: avatarUrl, provider: 'google' }, { onConflict: 'email' })
        .select('id, email, name, avatar_url')
        .single()

      if (error) return done(error)
      return done(null, data)
    } catch (err) {
      return done(err)
    }
  }
))

// Google OAuth 시작
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

// Google OAuth 콜백
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${env.clientUrl}/login?error=oauth`, session: false }),
  (req, res) => {
    const user = req.user as { id: string; email: string }
    const payload = { userId: user.id, email: user.email }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    setRefreshCookie(res, refreshToken)

    // accessToken을 단기 쿠키로 전달 — URL 노출(히스토리/리퍼러) 방지
    // 프론트는 /auth/callback에서 즉시 읽고 삭제
    res.cookie('access_token_once', accessToken, {
      httpOnly: false,        // JS에서 읽어야 함
      secure: env.cookieSecure,
      sameSite: 'lax',
      maxAge: 60 * 1000,      // 1분 — 읽은 뒤 프론트에서 삭제
      path: '/',
    })
    res.redirect(`${env.clientUrl}/auth/callback`)
  }
)

// AccessToken 재발급 — RefreshToken 쿠키 검증
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) {
    res.status(401).json({ code: 'NO_REFRESH_TOKEN' })
    return
  }

  try {
    const payload = verifyRefreshToken(refreshToken)
    const newAccessToken = signAccessToken({ userId: payload.userId, email: payload.email })

    res.json({ data: { accessToken: newAccessToken } })
  } catch {
    clearRefreshCookie(res)
    res.status(401).json({ code: 'REFRESH_TOKEN_EXPIRED' })
  }
})

// 로그아웃
router.post('/logout', (_req, res) => {
  clearRefreshCookie(res)
  res.json({ data: { message: '로그아웃 완료' } })
})

export default router
