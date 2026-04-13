/**
 * POST /api/auth/logout
 * 로그아웃 API - KOMCA 패턴
 *
 * Response:
 *   - 200: { message: '로그아웃 되었습니다.' }
 *
 * Cookie:
 *   - refreshToken 삭제
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createExpiredRefreshTokenCookie, successResponse, errorResponse } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse(405, 'Method not allowed'));
  }

  // Refresh Token Cookie 삭제
  res.setHeader('Set-Cookie', createExpiredRefreshTokenCookie());

  return res.status(200).json(successResponse(undefined, '로그아웃 되었습니다.'));
}
