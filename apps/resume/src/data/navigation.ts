export interface NavSection {
  id: string;
  label: string;
}

export const navSections: NavSection[] = [
  { id: 'skills', label: '기술' },
  { id: 'experience', label: '경력' },
  { id: 'projects', label: '프로젝트' },
];
