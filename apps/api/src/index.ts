import express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import passport from 'passport'
import { env } from './config/env'
import { configurePassport } from './config/passport'
import authRouter from './modules/auth/auth.router'
import userRouter from './modules/user/user.router'
import portfolioRouter from './modules/portfolio/portfolio.router'
import uploadRouter from './modules/upload/upload.router'
import blogRouter from './modules/blog/blog.router'

const app = express()

// Vercel/nginx 등 리버스 프록시 뒤에서 X-Forwarded-For 신뢰 (rate-limit IP 식별)
app.set('trust proxy', 1)
app.use(helmet())
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.clientUrls.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: ${origin} 허용되지 않음`))
  },
  credentials: true,
}) as any)
app.use(express.json({ limit: '1mb' }))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(cookieParser() as any)

configurePassport()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(passport.initialize() as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }) as any)
// 페이지 로드마다 자동 호출되는 엔드포인트 — 로그인보다 느슨하게
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use('/api/auth/refresh', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }) as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use('/api/auth/me', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }) as any)
// 로그인/회원가입 등 인증 액션 — 엄격하게 유지
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false }) as any)

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/portfolios', portfolioRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/blog', blogRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]', err)
  res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
})

if (process.env.VERCEL) {
  module.exports = app
} else {
  app.listen(env.port, () => {
    console.log(`[API] http://localhost:${env.port}`)
  })
}
