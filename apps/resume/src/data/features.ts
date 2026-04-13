export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  /** 이미지 import해서 전달 (예: reactImg) */
  image?: string;
}

export const mockFeatures: FeatureItem[] = [
    {
      id: 'react',
      title: 'React 기반 개발',
      description: 'React/TypeScript 환경에서 엄격한 타입 규칙을 적용하며 개발. 그룹웨어 공통 기능 담당, 재사용 가능한 커스텀 훅 설계 및 팀 내 공유.',
    },
    {
      id: 'architecture',
      title: '최적화 및 아키텍처 설계',
      description: 'Webpack Module Federation 기반 MFA 환경에서 도메인별 화면 개발 수행. 기획 단계에서 UX 개선점 제안 및 반영 경험.',
    },
    {
      id: 'teamwork',
      title: '커뮤니케이션 및 협업',
      description: '공통 코드 컨벤션 및 타입 정책 기반 일관된 코드 품질 유지. 외부 솔루션 연동 훅 문서화 및 팀 내 공유.',
    },
];
