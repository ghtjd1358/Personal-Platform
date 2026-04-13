// Resume visibility options
export type ResumeVisibility = 'public' | 'private';

// Resume profile - basic info
export interface ResumeProfile {
  id: string;
  user_id: string;
  name: string; // 이름
  title: string; // 직함 (예: "프론트엔드 개발자")
  summary: string;
  profile_image: string | null;
  contact_email: string | null;
  github: string | null;
  blog: string | null;
  visibility: ResumeVisibility;
  created_at: string;
  updated_at: string;
}

// Resume with user info for listing
export interface ResumeWithUser extends ResumeProfile {
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

// Resume detail with all related data
export interface ResumeDetail extends ResumeProfile {
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
}

// Experience item
export interface ExperienceItem {
  id: string;
  user_id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  tasks: { id: string; task: string }[];
  tags: string[];
  order_index: number;
}

// Project item
export interface ProjectItem {
  id: string;
  user_id: string;
  title: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  tasks: { id: string; task: string }[];
  tags: string[];
  image_url: string | null;
  order_index: number;
}

// Skill category
export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  skills: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  icon?: string;
  icon_color?: string;
}

// API Request types
export interface CreateResumeRequest {
  name: string;
  title: string;
  summary?: string;
  profile_image?: string;
  contact_email?: string;
  github?: string;
  blog?: string;
  visibility?: ResumeVisibility;
}

export interface UpdateResumeRequest {
  name?: string;
  title?: string;
  summary?: string;
  profile_image?: string | null;
  contact_email?: string | null;
  github?: string | null;
  blog?: string | null;
  visibility?: ResumeVisibility;
}

// API Response types
export interface GetResumesResponse {
  data: ResumeWithUser[];
  count: number;
}

export interface GetResumeDetailResponse {
  data: ResumeDetail;
}
