/**
 * TechIconResolver — DB skills.icon (key 문자열) → React 아이콘 노드 매핑.
 *
 * - factory 기반: 각 키 → `(color?: string) => ReactNode`
 * - color 없으면 default brand color, 있으면 override (DB skills.icon_color)
 * - 키 조회는 case-insensitive fallback 지원 (DB 값 대소문자 불일치 방어)
 *
 * 사용:
 *   resolveIcon(skill.icon, skill.icon_color)   // DB-driven
 *   resolveIcon('React')                         // default 브랜드 컬러
 *   listIconKeys()                               // IconPicker grid 용
 */
import React from 'react';
/**
 * DB `skills.icon` 키 + 선택적 `skills.icon_color` → ReactNode.
 * 대소문자 불일치는 소문자 폴백으로 자동 처리.
 * 미등록 키는 null 반환.
 */
export declare function resolveIcon(key: string | null | undefined, color?: string | null): React.ReactNode | null;
/** 등록된 모든 키 정렬 반환 — IconPicker grid 용 */
export declare function listIconKeys(): string[];
/** iconMap 호환 정적 Record — 기존 소비처 backward compat */
export declare const techIconMap: Record<string, React.ReactNode>;
//# sourceMappingURL=TechIconResolver.d.ts.map