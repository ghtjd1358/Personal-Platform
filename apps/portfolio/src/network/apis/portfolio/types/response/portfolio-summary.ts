/**
 * 포트폴리오 요약 정보 (목록용)
 */
export interface PortfolioSummary {
  /** 포트폴리오 ID */
  id: string;
  /** 사용자 ID */
  user_id: string;
  /** 제목 */
  title: string;
  /** 슬러그 */
  slug: string;
  /** 설명 */
  description: string | null;
  /** 짧은 설명 */
  short_description: string | null;
  /** 커버 이미지 */
  cover_image: string | null;
  /** 배지 */
  badge: string | null;
  /** 카테고리 ID */
  category_id: string | null;
  /** 상태 */
  status: 'draft' | 'published' | 'archived';
  /** 추천 여부 */
  is_featured: boolean;
  /** 공개 여부 */
  is_public: boolean;
  /** 조회수 */
  view_count: number;
  /** 정렬 순서 */
  order_index: number;
  /** 데모 URL */
  demo_url: string | null;
  /** GitHub URL */
  github_url: string | null;
  /** 생성일시 */
  created_at: string;
  /** 수정일시 */
  updated_at: string;
  /** 카테고리 정보 */
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  /** 태그 목록 */
  tags?: {
    id: string;
    tag: string;
    order_index: number;
  }[];
  /** 상세 정보 */
  detail?: {
    id: string;
    portfolio_id: string;
    role: string | null;
    team_size: number | null;
    duration: string | null;
    period: string | null;
    client: string | null;
    overview: string | null;
    challenge: string | null;
    solution: string | null;
    outcome: string | null;
  };
  /** 기술 스택 */
  techStack?: {
    id: string;
    name: string;
    icon: string | null;
    icon_color: string | null;
    order_index: number;
  }[];
}
