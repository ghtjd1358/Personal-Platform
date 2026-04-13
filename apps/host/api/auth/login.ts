/**
 * POST /api/auth/login
 * 로그인 API - KOMCA 패턴
 *
 * Request Body:
 *   { email: string, password: string }
 *
 * Response:
 *   - 200: { accessToken, user }
 *   - 401: { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
 *
 * Cookie:
 *   - refreshToken (HttpOnly, 7일)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  TEST_USERS,
  generateAccessToken,
  generateRefreshToken,
  createRefreshTokenCookie,
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

  const { email, password } = req.body;

  // 입력 검증
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
  }

  // 사용자 인증
  const testUser = TEST_USERS[email];
  if (!testUser || testUser.password !== password) {
    return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  const { user } = testUser;

  // 토큰 생성
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Refresh Token을 HttpOnly Cookie로 설정
  res.setHeader('Set-Cookie', createRefreshTokenCookie(refreshToken));

  // Access Token과 사용자 정보 응답
  return res.status(200).json({
    statusCode: 200,
    data: {
      accessToken,
      user,
    },
  });
}
