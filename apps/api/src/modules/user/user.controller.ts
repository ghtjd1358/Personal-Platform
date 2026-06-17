import { Request, Response } from 'express'
import { userService } from './user.service'
import { ok, dbError } from '../../common/response'

export const userController = {
  getMe: async (req: Request, res: Response) => {
    const { data, error } = await userService.getUserWithRole(req.user!.userId)
    if (error) return dbError(res, error.message)
    ok(res, data)
  },
}
