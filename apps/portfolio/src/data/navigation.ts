export interface NavSection {
  id: string;
  label: string;
}

// 포트폴리오 섹션별 네비게이션
export const navSections: NavSection[] = [
  { id: 'portfolio', label: '주요 프로젝트' },
  { id: 'other', label: '기타 프로젝트' },
];
