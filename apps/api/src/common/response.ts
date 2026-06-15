import { Response } from 'express'

export const ok = <T>(res: Response, data: T) =>
  res.json({ data })

export const created = <T>(res: Response, data: T) =>
  res.status(201).json({ data })

export const notFound = (res: Response, code = 'NOT_FOUND') =>
  res.status(404).json({ code })

export const dbError = (res: Response, message: string) =>
  res.status(500).json({ code: 'DB_ERROR', message })

export const unauthorized = (res: Response) =>
  res.status(401).json({ code: 'UNAUTHORIZED' })
