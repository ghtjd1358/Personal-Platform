/**
 * TechBlog API Common Types & Utilities
 *
 * Follows the same patterns as Blog app for consistency
 */

import { getSupabase } from '@sonhoseong/mfa-lib';

// ============================================
// Response Types
// ============================================

/**
 * Standard API response wrapper
 * All API functions return this type for consistent error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated list response
 */
export interface PageListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Job Tracker Specific Types
// ============================================

/**
 * Application status enum
 */
export type ApplicationStatus = 'interested' | 'applied' | 'interview' | 'result';

/**
 * Application result enum
 */
export type ApplicationResult = 'pending' | 'passed' | 'failed';

/**
 * Note type enum
 */
export type NoteType = 'memo' | 'interview' | 'analysis';

/**
 * Calendar event type enum
 */
export type EventType = 'interview' | 'deadline' | 'applied' | 'reminder';

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

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
export function errorResponse<T>(error: string): ApiResponse<T> {
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

/**
 * Get current user ID from Supabase auth
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Re-export getSupabase for convenience
export { getSupabase };
