import { getSupabase } from '@sonhoseong/mfa-lib'
import { DownloadResumeCommand, GetResumeUrlCommand } from './types'
import type {
  ResumeProfile,
  ResumeWithUser,
  ResumeDetail,
  CreateResumeRequest,
  UpdateResumeRequest,
  ExperienceItem,
  ProjectItem,
} from './types/resume'

const RESUME_BUCKET = 'hoseong_resumes'

// ============================================
// Resume Profile CRUD
// ============================================

export const resumesApi = {
  // 공개 이력서 목록 조회 (visibility: public)
  getPublicResumes: async (limit = 20, offset = 0) => {
    const { data, error, count } = await getSupabase()
      .from('resume_profile')
      .select('*', { count: 'exact' })
      .eq('visibility', 'public')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // user 정보 없이 resume만 반환
    const resumes = (data || []).map((resume: any) => ({
      ...resume,
      user: {
        id: resume.user_id,
        name: resume.name || resume.title || '개발자',
        avatar_url: resume.profile_image || null,
      }
    }));

    return { data: resumes as ResumeWithUser[], count: count || 0 };
  },

  // 내 이력서 조회 (user_id로 필터)
  getMyResume: async (userId: string) => {
    const { data, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data as ResumeProfile | null;
  },

  // 이력서 상세 조회 (id)
  getById: async (id: string) => {
    const { data, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      user: {
        id: data.user_id,
        name: (data as any).name || data.title || '개발자',
        avatar_url: data.profile_image || null,
      }
    } as ResumeWithUser;
  },

  // 이력서 상세 + 경험/프로젝트 포함
  getDetailById: async (id: string): Promise<ResumeDetail | null> => {
    // 1. Resume 기본 정보
    const { data: resume, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!resume) return null;

    // 2. Experiences
    const { data: experiences } = await getSupabase()
      .from('experiences')
      .select('*')
      .eq('user_id', resume.user_id)
      .order('order_index');

    // 3. Projects (portfolios)
    const { data: projects } = await getSupabase()
      .from('portfolios')
      .select('*')
      .eq('user_id', resume.user_id)
      .order('order_index');

    return {
      ...resume,
      user: {
        id: resume.user_id,
        name: (resume as any).name || resume.title || '개발자',
        avatar_url: resume.profile_image || null,
      },
      experiences: (experiences || []) as ExperienceItem[],
      projects: (projects || []) as ProjectItem[],
      skills: [],
    } as ResumeDetail;
  },

  // 이력서 상세 조회 (user_id로) - 공개 이력서 페이지용
  getDetailByUserId: async (userId: string): Promise<ResumeDetail | null> => {
    // 1. Resume 기본 정보 (.single() 대신 배열로 받아서 406 에러 방지)
    const { data: resumes, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    if (!resumes || resumes.length === 0) return null;

    const resume = resumes[0];

    // 2. Experiences
    const { data: experiences } = await getSupabase()
      .from('experiences')
      .select('*')
      .eq('user_id', userId)
      .order('order_index');

    // 3. Projects (portfolios)
    const { data: projects } = await getSupabase()
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('order_index');

    return {
      ...resume,
      user: {
        id: resume.user_id,
        name: (resume as any).name || resume.title || '개발자',
        avatar_url: resume.profile_image || null,
      },
      experiences: (experiences || []) as ExperienceItem[],
      projects: (projects || []) as ProjectItem[],
      skills: [],
    } as ResumeDetail;
  },

  // 이력서 생성
  create: async (userId: string, data: CreateResumeRequest) => {
    const { data: resume, error } = await getSupabase()
      .from('resume_profile')
      .insert({
        user_id: userId,
        name: data.name,
        title: data.title,
        summary: data.summary || '',
        profile_image: data.profile_image || null,
        contact_email: data.contact_email || null,
        github: data.github || null,
        blog: data.blog || null,
        visibility: data.visibility || 'private',
      })
      .select()
      .single();

    if (error) throw error;
    return resume as ResumeProfile;
  },

  // 이력서 수정
  update: async (id: string, data: UpdateResumeRequest) => {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.profile_image !== undefined) updateData.profile_image = data.profile_image;
    if (data.contact_email !== undefined) updateData.contact_email = data.contact_email;
    if (data.github !== undefined) updateData.github = data.github;
    if (data.blog !== undefined) updateData.blog = data.blog;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;

    const { data: resume, error } = await getSupabase()
      .from('resume_profile')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return resume as ResumeProfile;
  },

  // 이력서 삭제
  delete: async (id: string) => {
    const { error } = await getSupabase()
      .from('resume_profile')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

/**
 * Download resume PDF from Supabase Storage
 */
export const downloadResume = async (command: DownloadResumeCommand = {}) => {
  const { fileName = 'resume.pdf' } = command

  try {
    const { data, error } = await getSupabase().storage
      .from(RESUME_BUCKET)
      .download(fileName)

    if (error) {
      console.error('Error downloading resume:', error)
      throw error
    }

    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error('Failed to download resume:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Get public URL for resume PDF
 */
export const getResumePublicUrl = (command: GetResumeUrlCommand = {}) => {
  const { fileName = 'resume.pdf' } = command

  const { data } = getSupabase().storage
    .from(RESUME_BUCKET)
    .getPublicUrl(fileName)

  return { publicUrl: data.publicUrl }
}
