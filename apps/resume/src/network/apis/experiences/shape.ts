/**
 * experiences nested row → ExperienceWithDetails 변환.
 * select '*, experience_tasks(...), experience_tags(...)' 응답을 UI 가 쓰기 쉬운 모양으로 평탄화.
 */
import type { ExperienceWithDetails, NestedExpRow } from './types';

export const shapeExperience = (row: NestedExpRow): ExperienceWithDetails => {
    const { experience_tasks, experience_tags, ...rest } = row;
    return {
        ...(rest as Omit<ExperienceWithDetails, 'tasks' | 'tags'>),
        tasks: (experience_tasks || [])
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map((t) => ({ id: t.id, task: t.task })),
        tags: (experience_tags || []).map((t) => t.tag),
    };
};
