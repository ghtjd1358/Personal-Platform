import { getSupabase } from '@sonhoseong/mfa-lib';

/**
 * API 응답 공통 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export { getSupabase };

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 페이지네이션 응답
 */
export interface PageListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 정렬 순서
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 포트폴리오 상태
 */
export type PortfolioStatus = 'draft' | 'published' | 'archived';
