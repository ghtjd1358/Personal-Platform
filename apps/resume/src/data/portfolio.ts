import { mfaImg } from '../assets/images';

export interface PortfolioLink {
  label: string;
  url: string;
}

// 노션 스타일 섹션 (문제/원인/고민/해결 구조)
export interface PortfolioSection {
  heading: string;  // 섹션 제목
  problem?: string;  // 문제
  cause?: string;    // 원인
  thinking?: string; // 고민
  solution?: string[];  // 해결 (리스트)
}

export interface PortfolioItem {
  id: number;
  badge: string;
  title: string;
  image?: string;
  link?: string;
  desc: string;
  tags: string[];
  detail?: {
    period?: string;
    role?: string;
    team?: string;
    description?: string;
    tasks?: string[];      // 기존 호환
    results?: string[];    // 기존 호환
    sections?: PortfolioSection[];  // 노션 스타일 섹션
    links?: PortfolioLink[];
  };
}

export const mockPortfolioData: PortfolioItem[] = [
  {
    id: 1,
    badge: '개인',
    title: '개인 플랫폼',
    image: mfaImg,
    desc: 'Webpack Module Federation 기반 Micro Frontend 아키텍처 포트폴리오 플랫폼.',
    tags: ['React', 'TypeScript', 'Webpack', 'Module Federation', 'Redux Toolkit', 'Supabase'],
    detail: {
      period: '2024.12 ~ 진행 중',
      role: '풀스택 개발',
      team: '개인 프로젝트',
      description: '모놀리식 프론트엔드의 빌드 시간 증가 및 배포 병목 문제를 해결하기 위해 Micro Frontend 아키텍처를 직접 설계하고 구현한 프로젝트입니다.',
      sections: [
        {
          heading: '성과',
          solution: [
            'Webpack Module Federation 기반 Host/Remote 모듈 독립 빌드·배포 구조 설계',
            '동적 리모트 로더 구현 - 런타임 remoteEntry.js 로딩, 1분 단위 캐시 버스팅, Graceful Fallback',
            '공통 로직을 NPM 라이브러리(@sonhoseong/mfa-lib)로 분리·배포, 버전 관리 기반 독립적 사용',
            'shared 설정으로 React/Redux 싱글톤 보장 및 버전 충돌 방지',
            'window.__REDUX_STORE__ 패턴으로 Host-Remote 상태 공유, 동적 Reducer 주입으로 강결합 제거',
            'Supabase Auth 연동 및 토큰 만료 5분 전 선제 갱신 (useTokenAutoRefresh)',
            '권한 기반 메뉴 필터링 (usePermission)',
            '로컬 개발 시 Host/Remote 동시 실행 환경 구성 (포트 분리)',
          ],
        },
        {
          heading: '문제 해결',
          solution: [
            'Remote 로드 실패 시 앱 크래시 방지 → Graceful Fallback 패턴 적용으로 null 반환',
            '동시 401 발생 시 중복 토큰 갱신 → subscribeTokenRefresh 큐 패턴으로 해결',
            '라우트 전환 시 플리커 현상 → DeferredComponent 150ms 지연 렌더링으로 개선',
          ],
        },
        {
          heading: '주요 기능',
          solution: [
            '이력서/블로그/포트폴리오를 하나의 플랫폼에서 통합 관리',
            '관리자 페이지에서 경력, 프로젝트, 스킬 CRUD 기능',
            '블로그 글 작성/편집 (TipTap 에디터), 시리즈, 태그, 댓글 기능',
            '로그인/로그아웃, 권한별 메뉴 접근 제어',
          ],
        },
      ],
      links: [
        { label: '서비스 링크', url: 'https://host-git-main-sonhoseongs-projects.vercel.app/' },
        { label: 'GitHub (Host)', url: 'https://github.com/ghtjd1358/Frontend_Host' },
        { label: 'GitHub (Blog)', url: 'https://github.com/ghtjd1358/Frontend_Remote_Blog' },
        { label: 'GitHub (Resume)', url: 'https://github.com/ghtjd1358/Frontend_Remote_Resume' },
      ],
    },
  },
  {
    id: 2,
    badge: '개인',
    title: '북스토리',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    desc: '재고 관리 자동화, 결제, 장바구니 등 여러 서비스를 제공하는 이커머스 플랫폼.',
    tags: ['React', 'TypeScript', 'TanStack Query', 'Zustand', 'Tailwind CSS', 'Framer Motion', 'Firebase'],
    detail: {
      period: '2024.10 - 2024.11 (4주)',
      role: '프론트엔드 개발',
      team: '개인 프로젝트',
      description: '재고 관리 자동화, 결제, 장바구니 등 여러 서비스를 제공하는 이커머스 플랫폼입니다.',
      sections: [
        {
          heading: '성과',
          solution: [
            '코드 스플리팅, 트리쉐이킹, 청크 스플리팅을 활용한 번들러 최적화 - 번들 사이즈 8.09MB → 397.08KB로 80% 감축 및 초기 로딩 속도 개선',
            'WebP, Resizing 기법으로 이미지 크기 압축, 품질 유지 - 이미지 업로드 시 품질 유지 및 사이즈 80% 압축, 로딩 속도 개선',
            'JS 제어, Preload, Helmet, Vite 이미지 최적화를 활용하여 Lighthouse 지표 개선 - 라이트하우스 성능 점수 73→89점, 21.9% 개선',
          ],
        },
        {
          heading: '문제 해결',
          solution: [
            '비동기 로직 병렬 처리하여 Suspense에 의한 Waterfall 현상 개선',
            'DeferredComponent 렌더링으로 깜빡임 현상 개선',
            'Prefetch 적용으로 인한 불필요한 네트워크 요청 setTimeout으로 해결',
          ],
        },
        {
          heading: '주요 기능',
          solution: [
            'TanStack Query + Intersection Observer를 활용한 무한스크롤 구현',
            '검색 및 무한스크롤에 Debounce와 Throttle 적용',
            'Error Boundary로 선언적 에러 처리',
            'Zustand + React Query로 로그인 상태 및 세션 관리',
            'React Hook Form + Zod로 폼 유효성 검사',
            '카카오 우편번호 API와 포트원 SDK로 주소 및 결제 기능 구현',
          ],
        },
      ],
      links: [
        { label: 'GitHub', url: 'https://github.com/ghtjd1358/e-commerce' },
        { label: '서비스 링크', url: 'https://e-commerce-indol-six-20.vercel.app/' },
        { label: '블로그', url: 'https://velog.io/@ghtjd1358/series/projectdogundogun' },
      ],
    },
  },
  {
    id: 3,
    badge: '팀',
    title: '두런두런',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop',
    desc: 'AI 만화 캐릭터와 대화하며 영문 퀴즈를 풀이하는 영어 교육 웹 서비스.',
    tags: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Java', 'Spring Boot', 'MySQL', 'MongoDB'],
    detail: {
      period: '2024.02 - 2024.04 (5주)',
      role: '프론트엔드 개발',
      team: '6명 (FE 3, BE 3)',
      description: 'AI 만화 캐릭터와 대화하며 영문 퀴즈를 풀이하는 영어 교육 웹 서비스입니다.',
      sections: [
        {
          heading: '성과',
          solution: [
            'Axios Interceptor를 활용한 인증 관리 중앙 집중화 - 일관된 방식으로 인증 헤더 삽입 및 만료 체크를 자동화, 토큰 관리 로직 분리',
            'Compound Component 패턴으로 공통 컴포넌트를 여러 서브 컴포넌트로 분할 - 서브 컴포넌트 합성 설계로 재사용성과 확장성 강화',
            'React.memo와 useCallback을 활용한 렌더링 최적화 - UI 컴포넌트 재렌더링 최소화',
          ],
        },
        {
          heading: '문제 해결',
          solution: [
            'Redux Persist 도입으로 사용자 권한 상태 유지 문제 해결',
            'createAsyncThunk 도입으로 비동기 상태 관리 개편',
          ],
        },
        {
          heading: '담당 기능',
          solution: [
            'AI 캐릭터 음성, 텍스트 호출 받아 사용자에게 전달',
            'Redux를 활용한 사용자 인증 및 상태 관리',
            '전역 로딩 및 에러 처리 담당',
            'useState, 이벤트 핸들링, 배열 조작을 활용한 동적 영문 퀴즈 구현',
            'React Hook Form으로 폼 유효성 검사',
          ],
        },
      ],
      links: [
        { label: 'GitHub', url: 'https://github.com/symbicort/DoRun-DoRun-nest.js/tree/main' },
        { label: '서비스 (중지)', url: 'https://43.201.109.188.sslip.io/' },
      ],
    },
  },
];
