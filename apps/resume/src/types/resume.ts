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

export interface ExperienceDetail {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  tasks: ExperienceTask[];
  tags: string[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  tasks: ExperienceTask[];
  tags: string[];
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
  tags: string[];
  detail?: {
    period?: string;
    role?: string;
    team?: string;
    description?: string;
    tasks?: string[];
    results?: string[];
    sections?: PortfolioSection[];
    links?: PortfolioLink[];
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
