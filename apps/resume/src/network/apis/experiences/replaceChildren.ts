import { getSupabase } from '@sonhoseong/mfa-lib';

/**
 * tasks / tags 를 교체 저장. delete-all + re-insert 전략.
 * experience_tasks 엔 자식 FK 없어 안전. 다만 네트워크 왕복 3회 발생.
 */
export const replaceChildren = async (
    experienceId: string,
    tasks: string[],
    tags: string[],
): Promise<void> => {
    const sb = getSupabase();
    const [delTasks, delTags] = await Promise.all([
        sb.from('experience_tasks').delete().eq('experience_id', experienceId),
        sb.from('experience_tags').delete().eq('experience_id', experienceId),
    ]);
    if (delTasks.error) throw delTasks.error;
    if (delTags.error) throw delTags.error;

    if (tasks.length > 0) {
        const rows = tasks.map((t, i) => ({ experience_id: experienceId, task: t, order_index: i }));
        const { error } = await sb.from('experience_tasks').insert(rows);
        if (error) throw error;
    }
    if (tags.length > 0) {
        const rows = tags.map((t) => ({ experience_id: experienceId, tag: t }));
        const { error } = await sb.from('experience_tags').insert(rows);
        if (error) throw error;
    }
};
