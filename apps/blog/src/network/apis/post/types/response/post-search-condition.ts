import { PaginationParams, PostStatus } from '@/network/apis/common';

/** 정렬 기준 — field + direction 조합 6 케이스.
 * 기존 latest/oldest/popular/liked 도 호환 유지 (legacy alias) */
export type PostSortOption =
  | 'date_desc' | 'date_asc'
  | 'views_desc' | 'views_asc'
  | 'likes_desc' | 'likes_asc'
  // legacy aliases
  | 'latest' | 'oldest' | 'popular' | 'liked';

/**
 * 블로그 게시글 검색 조건
 */
export interface PostSearchCondition extends PaginationParams {
  /** 카테고리 ID */
  categoryId?: string;
  /** 태그 ID */
  tagId?: string;
  /** 상태 */
  status?: PostStatus;
  /** 추천 여부 */
  isFeatured?: boolean;
  /** 검색어 */
  search?: string;
  /** 사용자 ID */
  userId?: string;
  /** 정렬 기준 — 미지정 시 latest */
  sort?: PostSortOption;
}
