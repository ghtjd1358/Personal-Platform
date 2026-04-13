import { getSupabase, ApiResponse } from '@/network/apis/common';
import { ProfileDetail } from './types';

export interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
  bio?: string;
  short_bio?: string;
}

/**
 * 사용자 프로필을 수정합니다.
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<ApiResponse<ProfileDetail>> {
  try {
    const supabase = getSupabase();

    // 빈 값 필터링
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (data.name !== undefined && data.name.trim()) {
      updateData.name = data.name.trim();
    }
    if (data.short_bio !== undefined) {
      updateData.short_bio = data.short_bio.trim() || null;
    }
    if (data.bio !== undefined) {
      updateData.bio = data.bio.trim() || null;
    }
    if (data.avatar_url !== undefined) {
      updateData.avatar_url = data.avatar_url || null;
    }

    console.log('[updateProfile] userId:', userId, 'data:', updateData);

    const { data: result, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[updateProfile] Supabase error:', error);
      return { success: false, error: error.message };
    }

    console.log('[updateProfile] Success:', result);
    return { success: true, data: result };
  } catch (err) {
    console.error('[updateProfile] Exception:', err);
    return { success: false, error: '프로필 수정 중 오류가 발생했습니다.' };
  }
}