/**
 * JWT 토큰 유틸리티 - KOMCA 패턴 (테스트/개발용)
 *
 * @deprecated 이 파일은 테스트/개발 환경에서만 사용됩니다.
 * 프로덕션에서는 Supabase Auth를 사용합니다 (App.tsx 참고).
 *
 * - Access Token: 15분 만료 (메모리 저장)
 * - Refresh Token: 7일 만료 (HttpOnly Cookie)
 */

import jwt from 'jsonwebtoken';

// 환경 변수에서 시크릿 키 가져오기 (Vercel에서 설정)
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-change-in-production';

// 토큰 만료 시간
const ACCESS_TOKEN_EXPIRES = '15m';  // 15분
const REFRESH_TOKEN_EXPIRES = '7d';  // 7일

// 사용자 타입
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// 테스트 사용자 데이터베이스 (실제로는 DB 사용)
export const TEST_USERS: Record<string, { password: string; user: User }> = {
  'admin@test.com': {
    password: '1234',
    user: {
      id: '1',
      name: '관리자',
      email: 'admin@test.com',
      role: 'admin',
    },
  },
  'user@test.com': {
    password: '1234',
    user: {
      id: '2',
      name: '사용자',
      email: 'user@test.com',
      role: 'user',
    },
  },
};

/**
 * Access Token 생성
 */
export function generateAccessToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
}

/**
 * Refresh Token 생성
 */
export function generateRefreshToken(user: User): string {
  return jwt.sign(
    { id: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
}

/**
 * Access Token 검증
 */
export function verifyAccessToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    // 테스트 유저에서 찾기
    const testUser = Object.values(TEST_USERS).find((u) => u.user.id === decoded.id);
    return testUser?.user || null;
  } catch {
    return null;
  }
}

/**
 * Refresh Token 검증
 */
export function verifyRefreshToken(token: string): { id: string } | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
    return { id: decoded.id };
  } catch {
    return null;
  }
}

/**
 * 사용자 ID로 사용자 찾기
 */
export function findUserById(id: string): User | null {
  const testUser = Object.values(TEST_USERS).find((u) => u.user.id === id);
  return testUser?.user || null;
}

/**
 * HttpOnly Cookie 설정 문자열 생성
 */
export function createRefreshTokenCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7일 (초)
  const isProduction = process.env.NODE_ENV === 'production';

  return [
    `refreshToken=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    `SameSite=Strict`,
    isProduction ? 'Secure' : '',
  ].filter(Boolean).join('; ');
}

/**
 * Refresh Token Cookie 삭제 문자열 생성
 */
export function createExpiredRefreshTokenCookie(): string {
  return [
    `refreshToken=`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=0`,
    `SameSite=Strict`,
  ].join('; ');
}

/**
 * Cookie에서 Refresh Token 추출
 */
export function getRefreshTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies['refreshToken'] || null;
}

// ===============================
// API 응답 유틸리티 (일관된 응답 형식)
// ===============================

/** 성공 응답 타입 */
export interface ApiSuccessResponse<T = unknown> {
  statusCode: number;
  data?: T;
  message?: string;
}

/** 에러 응답 타입 */
export interface ApiErrorResponse {
  statusCode: number;
  error: string;
}

/**
 * 성공 응답 생성
 */
export function successResponse<T>(data?: T, message?: string): ApiSuccessResponse<T> {
  return {
    statusCode: 200,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  };
}

/**
 * 에러 응답 생성
 */
export function errorResponse(statusCode: number, error: string): ApiErrorResponse {
  return {
    statusCode,
    error,
  };
}
