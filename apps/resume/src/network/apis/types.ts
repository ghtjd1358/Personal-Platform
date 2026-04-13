/**
 * Experience (경력) 엔티티 타입
 */
export interface Experience {
  id: string;
  user_id: string;
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
}

/**
 * Portfolio (프로젝트) 엔티티 타입
 */
export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description?: string;
  tech_stack?: string[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Portfolio 생성/수정용 DTO
 */
export interface PortfolioInput {
  title: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string;
  tech_stack?: string[];
  order_index?: number;
  user_id?: string;
}
