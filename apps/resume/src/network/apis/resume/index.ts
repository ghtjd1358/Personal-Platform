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
const PROFILE_IMAGES_BUCKET = 'profile-images'

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
    const resumes = (data || []).map((resume) => ({
      ...resume,
      user: {
        id: resume.user_id,
        name: resume.name || resume.title || '개발자',
        avatar_url: resume.profile_image || null,
      }
    }));

    return { data: resumes as ResumeWithUser[], count: count || 0 };
  },

  // 내 이력서 조회 (user_id로 필터) - 하위 호환성 유지
  getMyResume: async (userId: string) => {
    const { data, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data as ResumeProfile | null;
  },

  // 내 모든 이력서 목록 조회 (다중 이력서 지원)
  getMyResumes: async (userId: string) => {
    const { data, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false }) // 대표 이력서 먼저
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ResumeProfile[];
  },

  // 대표 이력서 조회
  getPrimaryResume: async (userId: string) => {
    const { data, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as ResumeProfile | null;
  },

  // 대표 이력서 설정
  setPrimaryResume: async (userId: string, resumeId: string) => {
    // 1. 모든 이력서의 is_primary를 false로
    await getSupabase()
      .from('resume_profile')
      .update({ is_primary: false })
      .eq('user_id', userId);

    // 2. 선택한 이력서만 is_primary = true
    const { error } = await getSupabase()
      .from('resume_profile')
      .update({ is_primary: true })
      .eq('id', resumeId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
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
        name: data.name || data.title || '개발자',
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

    // 2. Experiences (resume_id로 조회, fallback으로 user_id)
    const { data: experiences } = await getSupabase()
      .from('experiences')
      .select('*')
      .eq('resume_id', id)
      .order('order_index');

    // 3. Projects/portfolios (resume_id로 조회)
    const { data: projects } = await getSupabase()
      .from('portfolios')
      .select('*')
      .eq('resume_id', id)
      .order('order_index');

    return {
      ...resume,
      user: {
        id: resume.user_id,
        name: resume.name || resume.title || '개발자',
        avatar_url: resume.profile_image || null,
      },
      experiences: (experiences || []) as ExperienceItem[],
      projects: (projects || []) as ProjectItem[],
      skills: [],
    } as ResumeDetail;
  },

  // 이력서 상세 조회 (user_id로) - 대표 이력서 반환
  getDetailByUserId: async (userId: string): Promise<ResumeDetail | null> => {
    // 1. 대표 이력서 우선, 없으면 최근 업데이트 이력서
    const { data: resumes, error } = await getSupabase()
      .from('resume_profile')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) throw error;
    if (!resumes || resumes.length === 0) return null;

    const resume = resumes[0];

    // 2. Experiences (resume_id로 조회)
    const { data: experiences } = await getSupabase()
      .from('experiences')
      .select('*')
      .eq('resume_id', resume.id)
      .order('order_index');

    // 3. Projects/portfolios (resume_id로 조회)
    const { data: projects } = await getSupabase()
      .from('portfolios')
      .select('*')
      .eq('resume_id', resume.id)
      .order('order_index');

    return {
      ...resume,
      user: {
        id: resume.user_id,
        name: resume.name || resume.title || '개발자',
        avatar_url: resume.profile_image || null,
      },
      experiences: (experiences || []) as ExperienceItem[],
      projects: (projects || []) as ProjectItem[],
      skills: [],
    } as ResumeDetail;
  },

  // 이력서 생성
  create: async (userId: string, data: CreateResumeRequest) => {
    // 첫 이력서인 경우 자동으로 대표 이력서로 설정
    const { data: existingResumes } = await getSupabase()
      .from('resume_profile')
      .select('id')
      .eq('user_id', userId);

    const isFirst = !existingResumes || existingResumes.length === 0;
    const isPrimary = data.is_primary ?? isFirst;

    // 대표 이력서로 설정하는 경우, 기존 대표 이력서 해제
    if (isPrimary && !isFirst) {
      await getSupabase()
        .from('resume_profile')
        .update({ is_primary: false })
        .eq('user_id', userId);
    }

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
        resume_name: data.resume_name || '기본 이력서',
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (error) throw error;
    return resume as ResumeProfile;
  },

  // 이력서 수정
  update: async (id: string, data: UpdateResumeRequest, userId?: string) => {
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
    if (data.resume_name !== undefined) updateData.resume_name = data.resume_name;

    // is_primary 변경 시 다른 이력서들 업데이트
    if (data.is_primary === true && userId) {
      await getSupabase()
        .from('resume_profile')
        .update({ is_primary: false })
        .eq('user_id', userId)
        .neq('id', id);
      updateData.is_primary = true;
    } else if (data.is_primary !== undefined) {
      updateData.is_primary = data.is_primary;
    }

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

// ============================================
// Profile Image Upload
// ============================================

export interface UploadProfileImageResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

/**
 * Upload profile image to Supabase Storage
 * @param file - Image file to upload
 * @param userId - User ID for unique file naming
 */
export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<UploadProfileImageResult> => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: '지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP, GIF만 허용)',
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: '파일 크기가 5MB를 초과합니다.',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await getSupabase().storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get public URL
    const { data: urlData } = getSupabase().storage
      .from(PROFILE_IMAGES_BUCKET)
      .getPublicUrl(fileName);

    return {
      success: true,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Failed to upload profile image:', error);
    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다.',
    };
  }
};

/**
 * Delete profile image from Supabase Storage
 * @param imageUrl - Full URL of the image to delete
 */
export const deleteProfileImage = async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split(`/${PROFILE_IMAGES_BUCKET}/`);
    if (urlParts.length < 2) {
      return { success: false, error: '유효하지 않은 이미지 URL입니다.' };
    }

    const filePath = urlParts[1];

    const { error } = await getSupabase().storage
      .from(PROFILE_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to delete profile image:', error);
    return { success: false, error: '이미지 삭제 중 오류가 발생했습니다.' };
  }
};
