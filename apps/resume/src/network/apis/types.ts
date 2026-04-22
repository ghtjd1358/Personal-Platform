/**
 * Experience (경력) 엔티티 타입
 */
export interface Experience {
  id: string;
  user_id: string;
  resume_id: string | null; // 연결된 이력서 ID
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  description?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Experience 생성/수정용 DTO
 */
export interface ExperienceInput {
  company: string;
  position: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  is_dev: boolean;
  description?: string;
  order_index?: number;
  user_id?: string;
  resume_id?: string; // 연결된 이력서 ID
}

/**
 * Portfolio Core — resume timeline + portfolio 카드 양쪽 모두 노출되는 **필수** 필드.
 * DB 에도 NOT NULL 로 묶여있음 (title/role/start_date/is_current/user_id/slug).
 */
export interface PortfolioCore {
  title: string;
  role: string;
  start_date: string;
  is_current: boolean;
}

/**
 * Portfolio (프로젝트) 엔티티 타입 — DB 행 그대로.
 * Core 필드는 필수, 나머지는 portfolio-section 전용으로 optional.
 */
export interface Portfolio extends PortfolioCore {
  id: string;
  user_id: string;
  resume_id: string | null; // null = resume 미연결 (portfolio 섹션 전용)
  slug: string;
  end_date: string | null;
  order_index: number;

  // portfolio-only 장식
  short_description?: string | null;
  description?: string | null;
  cover_image?: string | null;
  thumbnail?: string | null;
  image_url?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
  figma_url?: string | null;
  other_url?: string | null;
  badge?: string | null;
  is_featured?: boolean;
  category_id?: string | null;

  created_at?: string;
  updated_at?: string;
}

/**
 * Portfolio 생성/수정용 DTO.
 * - Core 는 필수 (title/role/start_date/is_current)
 * - slug 은 안 주면 portfoliosApi.create 가 title 기반 자동 생성
 * - 나머지 portfolio-only 필드는 모두 `?` — resume 만 쓸 거면 안 채워도 됨
 */
export interface PortfolioInput extends PortfolioCore {
  slug?: string;
  user_id?: string;
  resume_id?: string | null;
  end_date?: string | null;
  order_index?: number;

  short_description?: string;
  description?: string;
  cover_image?: string;
  thumbnail?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  figma_url?: string;
  other_url?: string;
  badge?: string;
  is_featured?: boolean;
  category_id?: string;
}
