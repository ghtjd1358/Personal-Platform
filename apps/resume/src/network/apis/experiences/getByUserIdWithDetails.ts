import { getSupabase } from '@sonhoseong/mfa-lib';
import { shapeExperience } from './shape';
import type { ExperienceWithDetails } from './types';

/** user 의 experiences + tasks + tags 를 nested 로 가져와 UI shape 로 변환 */
export const getByUserIdWithDetails = async (userId: string): Promise<ExperienceWithDetails[]> => {
    const { data, error } = await getSupabase()
        .from('experiences')
        .select('*, experience_tasks(id, task, order_index), experience_tags(tag)')
        .eq('user_id', userId)
        .order('order_index');
    if (error) throw error;
    return (data || []).map(shapeExperience);
};
