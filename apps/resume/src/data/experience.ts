import { mfaImg, bookstoryImg, dorundorunImg } from '../assets/images';

export interface ExperienceTask {
  id: string;
  task: string;
}

export interface ExperienceDetail {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  tasks: ExperienceTask[];
  tags: string[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  tasks: ExperienceTask[];
  tags: string[];
  image?: string;
}

export const mockExperiences: ExperienceDetail[] = [
  {
    id: '1',
    company: '(주)포인정보',
    position: '프론트엔드 개발자',
    start_date: '2025-04',
    end_date: '2026-03',
    is_current: false,
    is_dev: true,
    tasks: [
      { id: '1', task: '**그룹웨어·포털 시스템** 프론트엔드 개발, 재사용 가능한 **커스텀 훅** 설계 및 배포' },
      { id: '2', task: '**외부 리포트 솔루션** 연동 훅 설계 - 문서 출력 기능 공용화' },
      { id: '3', task: '**IBSheet 기반** 관리자 CRUD 페이지 다수 개발 (민원, 신탁, 거래처, 메뉴얼)' },
      { id: '4', task: '**ViewModel 패턴** 활용 - 복잡한 폼 상태 관리 및 양방향 데이터 바인딩 적용' },
    ],
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Webpack', 'Axios', 'AWS', 'S3', 'Jest', 'IBSheet', 'GitHub', 'Jira', 'Confluence']
  },
  {
    id: '2',
    company: '스파르타코딩클럽',
    position: '프론트엔드 부트캠프',
    start_date: '2024-09',
    end_date: '2024-12',
    is_current: false,
    is_dev: true,
    tasks: [
      { id: '4', task: '**TanStack Query** 캐싱 전략 및 **Zustand** 전역 상태 관리 심화 학습' },
      { id: '5', task: '**Jest + RTL** 기반 단위/통합 테스트 작성 실습' },
      { id: '6', task: '**알고리즘** 문제 해결 (Python)' },
      { id: '7', task: '**React 심화** - 렌더링 최적화, 커스텀 훅 패턴' }
    ],
    tags: ['React', 'Next.js', 'React Query', 'Zustand', 'Tailwind CSS', 'Jest', 'Python']
  },
  {
    id: '3',
    company: '포스코미래창조아카데미',
    position: '웹 풀스택 과정',
    start_date: '2023-10',
    end_date: '2024-04',
    is_current: false,
    is_dev: true,
    tasks: [
      { id: '7', task: '**JavaScript** 기초부터 ES6+ 심화 학습' },
      { id: '8', task: '**Node.js + Express** 기반 REST API 구현 실습' },
      { id: '9', task: '**React** 팀 프로젝트 1건, **Vanilla JS** 팀 프로젝트 1건 수행' }
    ],
    tags: ['React', 'TypeScript', 'Redux', 'Spring Boot', 'MySQL', 'Git']
  },
  {
    id: '4',
    company: '데크라코리아(주)',
    position: '비개발 직무',
    start_date: '2019-01',
    end_date: '2022-10',
    is_current: false,
    is_dev: false,
    tasks: [
      { id: '10', task: '국제 규격 관련 플랜 컨설팅' },
      { id: '11', task: '국내 및 해외 전자파 시험(EMI, EMS)' },
      { id: '12', task: 'PCB 및 소프트웨어 디버깅' },
      { id: '13', task: '장비 환경 설정, 유지 보수' }
    ],
    tags: []
  }
];

export const mockProjects: ProjectDetail[] = [
  {
    id: 'p1',
    title: '개인 플랫폼',
    role: '개인 프로젝트 · 설계/개발',
    start_date: '2024-12',
    end_date: null,
    is_current: true,
    tasks: [
      { id: 'pt1', task: '**Module Federation** 기반 Host + 3개 Remote 앱 독립 빌드/배포 아키텍처 설계' },
      { id: 'pt2', task: '**동적 리모트 로더** 구현 - 런타임 remoteEntry.js 로딩, 1분 캐시 버스팅, Graceful Fallback' },
      { id: 'pt3', task: '**토큰 리프레시 큐** 패턴으로 동시 401 발생 시 race condition 해결' },
      { id: 'pt4', task: '**공용 라이브러리** NPM 배포 (@sonhoseong/mfa-lib) - Host/Remote 간 코드 공유' },
      { id: 'pt5', task: '**window.__REDUX_STORE__** 패턴으로 Host-Remote 상태 공유, 동적 Reducer 주입' },
    ],
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Webpack', 'Supabase', 'Axios', 'Vercel'],
    image: mfaImg
  },
  {
    id: 'p2',
    title: '북스토리',
    role: '재고 관리 자동화, 결제, 장바구니 등 여러 서비스를 제공하는 이커머스 플랫폼',
    start_date: '2024-10',
    end_date: '2024-11',
    is_current: false,
    tasks: [
      { id: 'pt4', task: '**번들 최적화** - Code Splitting + Tree Shaking으로 **8.09MB → 397KB (80% 감소)**' },
      { id: 'pt5', task: '**이미지 최적화** - WebP 변환, Resizing으로 품질 유지하며 **사이즈 80% 압축**' },
      { id: 'pt6', task: '**Waterfall 해결** - 비동기 로직 병렬 처리로 Suspense 로딩 최적화' },
      { id: 'pt7', task: '**Lighthouse 개선** - Performance **73 → 89점 (21.9% 향상)**' },
    ],
    tags: ['React', 'TypeScript', 'Vite', 'React Query', 'Zustand', 'React Hook Form', 'Tailwind CSS', 'Firebase', 'Vercel', 'Lighthouse'],
    image: bookstoryImg
  },
  {
    id: 'p3',
    title: '두런두런',
    role: 'AI 만화 캐릭터와 대화하며 영문 퀴즈 풀이하는 영어 교육 웹 서비스',
    start_date: '2024-02',
    end_date: '2024-04',
    is_current: false,
    tasks: [
      { id: 'pt7', task: '**Axios Interceptor** 토큰 갱신 자동화로 인증 로직 중앙 집중화' },
      { id: 'pt8', task: '**Compound Component** 패턴 적용 - 공통 UI 재사용성 및 확장성 향상' },
      { id: 'pt9', task: '**렌더링 최적화** - React.memo + useCallback으로 **리렌더 40% 감소**' }
    ],
    tags: ['React', 'TypeScript', 'Redux', 'Vite', 'React Hook Form', 'Axios', 'Tailwind CSS'],
    image: dorundorunImg
  }
];
