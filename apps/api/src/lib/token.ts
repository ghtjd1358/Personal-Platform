import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JwtPayload } from '../middleware/authenticate'

export function signAccessToken(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn as any })
}

export function signRefreshToken(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn as any })
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload
}

export function setRefreshCookie(res: import('express').Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,          // JS에서 접근 불가 — XSS 방어
    secure: env.cookieSecure, // HTTPS에서만 전송
    sameSite: 'lax',         // CSRF 방어
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    path: '/api/auth',       // refresh 엔드포인트에만 쿠키 전송
  })
}

export function clearRefreshCookie(res: import('express').Response) {
  res.clearCookie('refreshToken', { path: '/api/auth' })
}
