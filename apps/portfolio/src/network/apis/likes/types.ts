/**
 * 좋아요 상태 정보
 */
export interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
}

/**
 * 좋아요 토글 결과
 */
export interface ToggleLikeResult {
  isLiked: boolean;
  likeCount: number;
}

/**
 * 좋아요 레코드 (DB 테이블 매핑)
 */
export interface PortfolioLike {
  id: string;
  portfolio_id: string;
  user_id: string;
  created_at: string;
}
