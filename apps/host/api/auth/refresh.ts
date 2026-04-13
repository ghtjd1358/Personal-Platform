/**
 * POST /api/auth/refresh
 * 토큰 갱신 API - KOMCA 패턴
 *
 * Cookie:
 *   - refreshToken (HttpOnly)
 *
 * Response:
 *   - 200: { accessToken }
 *   - 401: { error: '인증이 만료되었습니다.' }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  verifyRefreshToken,
  findUserById,
  generateAccessToken,
  generateRefreshToken,
  createRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cookie에서 Refresh Token 추출
  const refreshToken = getRefreshTokenFromCookie(req.headers.cookie);

  if (!refreshToken) {
    return res.status(401).json({
      statusCode: 401,
      error: '인증이 만료되었습니다. 다시 로그인해주세요.',
    });
  }

  // Refresh Token 검증
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({
      statusCode: 401,
      error: '인증이 만료되었습니다. 다시 로그인해주세요.',
    });
  }

  // 사용자 찾기
  const user = findUserById(decoded.id);
  if (!user) {
    return res.status(401).json({
      statusCode: 401,
      error: '사용자를 찾을 수 없습니다.',
    });
  }

  // 새 토큰 생성
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // 새 Refresh Token을 Cookie로 설정 (Rotating Refresh Token)
  res.setHeader('Set-Cookie', createRefreshTokenCookie(newRefreshToken));

  // 새 Access Token 응답
  return res.status(200).json({
    statusCode: 200,
    data: {
      accessToken: newAccessToken,
      user,
    },
  });
}
