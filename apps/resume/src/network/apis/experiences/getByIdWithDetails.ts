import { getSupabase } from '@sonhoseong/mfa-lib';
import { shapeExperience } from './shape';
import type { ExperienceWithDetails } from './types';

/** id 로 단일 experience + tasks + tags 조회, 없으면 null */
export const getByIdWithDetails = async (id: string): Promise<ExperienceWithDetails | null> => {
    const { data, error } = await getSupabase()
        .from('experiences')
        .select('*, experience_tasks(id, task, order_index), experience_tags(tag)')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? shapeExperience(data) : null;
};
