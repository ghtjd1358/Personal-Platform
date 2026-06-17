import { Response } from 'express'

const isProd = process.env.NODE_ENV === 'production'

export const ok = <T>(res: Response, data: T) =>
  res.json({ data })

export const created = <T>(res: Response, data: T) =>
  res.status(201).json({ data })

export const notFound = (res: Response, code = 'NOT_FOUND') =>
  res.status(404).json({ code })

export const unauthorized = (res: Response, code = 'UNAUTHORIZED') =>
  res.status(401).json({ code })

export const dbError = (res: Response, message: string) =>
  res.status(500).json({ code: 'DB_ERROR', message: isProd ? undefined : message })
