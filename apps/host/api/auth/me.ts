/**
 * GET /api/auth/me
 * 현재 사용자 정보 API - KOMCA 패턴
 *
 * Header:
 *   - Authorization: Bearer {accessToken}
 *
 * Response:
 *   - 200: { user }
 *   - 401: { error: '인증이 필요합니다.' }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAccessToken } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      error: '인증이 필요합니다.',
    });
  }

  const accessToken = authHeader.substring(7); // 'Bearer ' 제거

  // Access Token 검증
  const user = verifyAccessToken(accessToken);
  if (!user) {
    return res.status(401).json({
      statusCode: 401,
      error: '인증이 만료되었습니다.',
    });
  }

  return res.status(200).json({
    statusCode: 200,
    data: { user },
  });
}
