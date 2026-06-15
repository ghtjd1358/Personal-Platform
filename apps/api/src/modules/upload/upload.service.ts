import crypto from 'crypto'
import { supabase } from '../../lib/supabase'
import { env } from '../../config/env'

const BUCKET = 'portfolio-images'

export const uploadService = {
  presign: async (userId: string, fileName: string) => {
    const ext = fileName?.split('.').pop() || 'jpg'
    const key = `${userId}/${crypto.randomUUID()}.${ext}`
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(key)
    if (error || !data) return { result: null, error }
    return {
      result: {
        uploadUrl: data.signedUrl,
        token: data.token,
        path: key,
        publicUrl: `${env.supabaseUrl}/storage/v1/object/public/${BUCKET}/${key}`,
      },
      error: null,
    }
  },

  remove: (path: string) =>
    supabase.storage.from(BUCKET).remove([path]),
}
