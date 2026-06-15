import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import { env } from './config/env'
import authRouter from './modules/auth/auth.router'
import userRouter from './modules/user/user.router'
import portfolioRouter from './modules/portfolio/portfolio.router'
import uploadRouter from './modules/upload/upload.router'
import blogRouter from './modules/blog/blog.router'

const app = express()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(cors({ origin: env.clientUrl, credentials: true }) as any)
app.use(express.json())
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(cookieParser() as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(passport.initialize() as any)

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/portfolios', portfolioRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/blog', blogRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Vercel: export app / 로컬: listen
if (process.env.VERCEL) {
  module.exports = app
} else {
  app.listen(env.port, () => {
    console.log(`[API] http://localhost:${env.port}`)
  })
}
