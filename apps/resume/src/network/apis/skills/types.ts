/** Skills 도메인 공통 타입. consumer 는 `from '@/network/apis'` 경유 — 내부 폴더 구조 변경 격리. */

export interface SkillCategoryWithSkills {
    id: string;
    label: string;
    order_index: number;
    skills: {
        id: string;
        name: string;
        icon?: string;
        icon_color?: string;
        order_index: number;
    }[];
}

export interface SkillCategoryInput {
    label: string;
    order_index?: number;
}

export interface SkillInput {
    category_id: string;
    name: string;
    icon?: string;
    icon_color?: string;
    order_index?: number;
}
