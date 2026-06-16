import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtPayload {
  userId: string
  email: string
}

// @types/passport 의 Express.User 와 충돌 방지 — User 를 확장
declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: '인증이 필요합니다.' })
    return
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ code: 'TOKEN_EXPIRED', message: '토큰이 만료되었습니다.' })
  }
}
