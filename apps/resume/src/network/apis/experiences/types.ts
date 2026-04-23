/**
 * Experiences 도메인 타입.
 * - ExperienceWithDetails: experiences + experience_tasks + experience_tags 를
 *   한 왕복으로 가져와 쉐이핑한 shape (tasks: {id,task}[], tags: string[])
 * - NestedExpRow: Supabase select nested 응답의 raw row 형태 (shape 직전)
 */

export interface ExperienceWithDetails {
    id: string;
    user_id: string;
    resume_id: string | null;
    company: string;
    position: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    is_dev: boolean;
    description?: string | null;
    order_index: number;
    tasks: { id: string; task: string }[];
    tags: string[];
}

export type NestedExpRow = {
    id: string;
    experience_tasks?: { id: string; task: string; order_index: number }[];
    experience_tags?: { tag: string }[];
    [key: string]: unknown;
};
