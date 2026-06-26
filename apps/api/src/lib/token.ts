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

const isLocal = process.env.NODE_ENV !== 'production'

export function setRefreshCookie(res: import('express').Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? 'lax' : 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  })
}

export function clearRefreshCookie(res: import('express').Response) {
  res.clearCookie('refreshToken', { path: '/api/auth', secure: !isLocal, sameSite: isLocal ? 'lax' : 'none' })
}
