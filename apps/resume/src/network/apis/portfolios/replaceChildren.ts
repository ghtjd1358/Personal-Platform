import { getSupabase } from '@sonhoseong/mfa-lib';

/**
 * portfolio 자식(tasks/tags) 전체 교체.
 * delete-all + re-insert 전략 — diff patch 대신 단순/안전. order_index 는 배열 순서로 부여.
 * 두 자식 테이블 delete 는 병렬 (서로 FK 의존 없음), insert 는 순차 (에러 분리 포착).
 */
export const replaceChildren = async (
    portfolioId: string,
    tasks: string[],
    tags: string[],
): Promise<void> => {
    const sb = getSupabase();
    const [delTasks, delTags] = await Promise.all([
        sb.from('portfolio_tasks').delete().eq('portfolio_id', portfolioId),
        sb.from('portfolio_tags').delete().eq('portfolio_id', portfolioId),
    ]);
    if (delTasks.error) throw delTasks.error;
    if (delTags.error) throw delTags.error;

    if (tasks.length > 0) {
        const rows = tasks.map((t, i) => ({ portfolio_id: portfolioId, task: t, order_index: i }));
        const { error } = await sb.from('portfolio_tasks').insert(rows);
        if (error) throw error;
    }
    if (tags.length > 0) {
        const rows = tags.map((t, i) => ({ portfolio_id: portfolioId, tag: t, order_index: i }));
        const { error } = await sb.from('portfolio_tags').insert(rows);
        if (error) throw error;
    }
};
