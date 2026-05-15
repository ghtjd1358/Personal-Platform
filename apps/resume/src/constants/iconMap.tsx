/**
 * iconMap — 백워드 호환 정적 Record<string, ReactNode>.
 *
 * @deprecated 신규 코드는 `iconResolver.resolveIcon(key, color?)` 사용 (DB 의 skills.icon_color 로 동적 컬러 가능).
 * 이 파일은 IconPicker / ResumeDetailPage / MyResumeDetailPage 등 기존 소비처 호환 위해 유지.
 *
 * 내부적으로 iconResolver 의 ICON_FACTORIES 를 default 브랜드 컬러로 호출해 빌드.
 * 단일 source of truth 는 iconResolver.tsx.
 */
import React from 'react';
import { listIconKeys, resolveIcon } from './iconResolver';

export const iconMap: Record<string, React.ReactNode> = Object.fromEntries(
  listIconKeys().map((key) => [key, resolveIcon(key)]),
);
