import { getSupabase } from '@sonhoseong/mfa-lib';

// ============================================
// Response Types
// ============================================

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

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
 * 정렬 옵션
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 게시글 상태
 */
export type PostStatus = 'draft' | 'published' | 'archived';

// ============================================
// Helper Functions
// ============================================

/**
 * Create success response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error response
 */
export function errorResponse<T = never>(error: string): ApiResponse<T> {
  return {
    success: false,
    error,
  };
}

/**
 * Calculate pagination metadata
 */
export function createPaginationMeta<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PageListResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export { getSupabase };
