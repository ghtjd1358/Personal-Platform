import { Request, Response } from 'express'
import { env } from '../../config/env'
import {
  signAccessToken,
  signRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  verifyRefreshToken,
} from '../../lib/token'
import { userService } from '../user/user.service'
import { ok } from '../../common/response'

export const authController = {
  googleCallback: (req: Request, res: Response) => {
    // req.user = JwtPayload { userId, email } — passport done()에서 설정
    const payload = { userId: req.user!.userId, email: req.user!.email }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    setRefreshCookie(res, refreshToken)

    // accessToken을 단기 쿠키로 전달 — URL 노출(히스토리/리퍼러) 방지
    res.cookie('access_token_once', accessToken, {
      httpOnly: false,
      secure: env.cookieSecure,
      sameSite: 'lax',
      maxAge: 60 * 1000,
      path: '/',
    })
    res.redirect(`${env.clientUrls[0]}/auth/callback`)
  },

  refresh: (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) { res.status(401).json({ code: 'NO_REFRESH_TOKEN' }); return }

    try {
      const payload = verifyRefreshToken(refreshToken)
      const newAccessToken = signAccessToken({ userId: payload.userId, email: payload.email })
      res.json({ data: { accessToken: newAccessToken } })
    } catch {
      clearRefreshCookie(res)
      res.status(401).json({ code: 'REFRESH_TOKEN_EXPIRED' })
    }
  },

  logout: (_req: Request, res: Response) => {
    clearRefreshCookie(res)
    res.json({ data: { message: '로그아웃 완료' } })
  },

  me: async (req: Request, res: Response) => {
    const { data, error } = await userService.getUserWithRole(req.user!.userId)
    if (error || !data) { res.status(404).json({ code: 'USER_NOT_FOUND' }); return }
    ok(res, { user: data })
  },
}
