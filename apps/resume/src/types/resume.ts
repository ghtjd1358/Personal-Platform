/**
 * Resume 도메인 타입 정의
 * 이전 `src/data/*.ts` 에 mock 값과 섞여 있던 interface 들을 여기로 이관.
 * 런타임 mock 값은 Supabase 도입으로 전부 제거됨 — 이 파일은 순수 타입만.
 */

export interface ProfileDetail {
  name: string;
  email: string;
}

export interface ResumeProfileDetail {
  title: string;
  summary: string;
  contact_email: string;
  github: string;
  blog: string;
}

export interface SkillDetail {
  id: string;
  name: string;
  icon?: string;
  icon_color?: string;
}

export interface SkillCategoryDetail {
  id: string;
  name: string;
  icon?: string;
  skills: SkillDetail[];
}

export interface ExperienceTask {
  id: string;
  task: string;
}

/**
 * 카드/모달/타임라인에서 사용하는 rich tag — DB portfolio_tags / experience_tags 가
 * skills 와 JOIN 된 결과. iconKey 는 skills.icon (= iconResolver 의 키), iconColor 는 skills.icon_color.
 * skill 매칭이 안 된 niche tech 는 iconKey/iconColor null → 텍스트 fallback 로만 렌더.
 */
export interface PortfolioTag {
  name: string;
  iconKey?: string | null;
  iconColor?: string | null;
}

export interface ExperienceDetail {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  tasks: ExperienceTask[];
  tags: PortfolioTag[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  tasks: ExperienceTask[];
  tags: PortfolioTag[];
  image?: string;
}

export interface CertificationDetail {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
}

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface PortfolioSection {
  heading: string;
  problem?: string;
  cause?: string;
  thinking?: string;
  solution?: string[];
}

export interface PortfolioItem {
  id: number;
  badge: string;
  title: string;
  image?: string;
  link?: string;
  desc: string;
  tags: PortfolioTag[];
  detail?: {
    period?: string;
    role?: string;
    team?: string;
    description?: string;
    tasks?: string[];
    results?: string[];
    sections?: PortfolioSection[];
    links?: PortfolioLink[];
    /** Notion 상세 페이지 URL — 있으면 PortfolioModal body 가 NotionContent 로 분기 (기존 sections 폴백). */
    notion_url?: string;
  };
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface ContactLink {
  id: string;
  type: 'email' | 'github' | 'blog' | 'linkedin' | 'other';
  url: string;
  label?: string;
}
