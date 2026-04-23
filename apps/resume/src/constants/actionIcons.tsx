/**
 * Action icons — UI 컨트롤용 아이콘 모음.
 * iconMap.tsx (기술 스택/brand 아이콘) 과 역할 분리.
 *
 * 사용 예:
 *   import { EditIcon } from '@/constants/actionIcons';
 *   <CommonButton leftIcon={<EditIcon />}>편집</CommonButton>
 *
 * 사이즈는 props 으로 받아서 CommonButton size 에 맞춰 조정 가능.
 * 기본값은 14px — size="sm" 기준. md/lg 에선 18/22 권장.
 */
import React from 'react';

interface IconProps {
    size?: number;
}

/** 연필 모양 — 편집 */
export const EditIcon: React.FC<IconProps> = ({ size = 14 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
    >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
