import { Request, Response } from 'express'
import { env } from '../../config/env'
import {
  signAccessToken,
  signRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  verifyRefreshToken,
} from '../../lib/token'
import { authService } from './auth.service'
import { userService } from '../user/user.service'
import { ok, unauthorized, notFound } from '../../common/response'

export const authController = {
  googleCallback: (req: Request, res: Response) => {
    const payload = { userId: req.user!.userId, email: req.user!.email }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    setRefreshCookie(res, refreshToken)

    // access_token_once: JS 접근 허용 non-HttpOnly 쿠키 — 5초 내 AuthCallbackPage가 읽고 즉시 삭제
    res.cookie('access_token_once', accessToken, {
      httpOnly: false,
      secure: env.cookieSecure,
      sameSite: 'lax',
      maxAge: 5 * 1000,
      path: '/',
    })
    res.redirect(`${env.clientUrls[0]}/auth/callback`)
  },

  refresh: (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) { unauthorized(res); return }

    try {
      const payload = verifyRefreshToken(refreshToken)
      const newAccessToken = signAccessToken({ userId: payload.userId, email: payload.email })
      ok(res, { accessToken: newAccessToken })
    } catch {
      clearRefreshCookie(res)
      unauthorized(res, 'REFRESH_TOKEN_EXPIRED')
    }
  },

  logout: (_req: Request, res: Response) => {
    clearRefreshCookie(res)
    ok(res, { message: '로그아웃 완료' })
  },

  me: async (req: Request, res: Response) => {
    const { data, error } = await userService.getUserWithRole(req.user!.userId)
    if (error || !data) { notFound(res, 'USER_NOT_FOUND'); return }
    ok(res, { user: data })
  },

  // 포트폴리오 체험용 데모 로그인 — DEMO_ACCOUNT_EMAIL/PASSWORD 환경변수로 제어
  demoLogin: async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {}
    if (!env.demoEmail || !env.demoPassword) { unauthorized(res, 'DEMO_NOT_CONFIGURED'); return }
    if (email !== env.demoEmail || password !== env.demoPassword) { unauthorized(res, 'INVALID_CREDENTIALS'); return }

    const { data, error } = await authService.upsertUser(env.demoEmail, '데모 계정')
    if (error || !data) { unauthorized(res, 'DEMO_USER_ERROR'); return }

    const payload = { userId: data.id, email: data.email }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)
    setRefreshCookie(res, refreshToken)
    ok(res, { accessToken })
  },
}
