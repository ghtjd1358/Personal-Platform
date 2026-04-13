import { PaginationParams, PortfolioStatus } from '../../../common';

/**
 * 포트폴리오 검색 조건
 */
export interface PortfolioSearchCondition extends PaginationParams {
  /** 카테고리 ID */
  categoryId?: string;
  /** 상태 */
  status?: PortfolioStatus;
  /** 추천 여부 */
  isFeatured?: boolean;
  /** 공개 여부 */
  isPublic?: boolean;
  /** 검색어 */
  search?: string;
  /** 사용자 ID */
  userId?: string;
}
