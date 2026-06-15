import { Request, Response } from 'express'
import { uploadService } from './upload.service'
import { ok } from '../../common/response'

export const uploadController = {
  presign: async (req: Request, res: Response) => {
    const { fileName } = req.body
    const { result, error } = await uploadService.presign(req.user!.userId, fileName)
    if (error || !result) { res.status(500).json({ code: 'STORAGE_ERROR', message: error?.message }); return }
    ok(res, result)
  },

  remove: async (req: Request, res: Response) => {
    const { path } = req.body
    const { error } = await uploadService.remove(path)
    if (error) { res.status(500).json({ code: 'STORAGE_ERROR', message: error.message }); return }
    ok(res, { path })
  },
}
