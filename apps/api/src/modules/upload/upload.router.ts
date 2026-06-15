import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { uploadController } from './upload.controller'

const router = Router()

router.post('/presign', authenticate, uploadController.presign)
router.delete('/', authenticate, uploadController.remove)

export default router
