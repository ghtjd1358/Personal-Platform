import { Job, JobApplication, JobNote, CalendarEvent } from '@/types/job';

// Mock 채용공고 데이터
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    company: '네이버',
    position: '프론트엔드 개발자',
    location: '경기 성남시 분당구',
    salary: '5,000 ~ 7,000만원',
    deadline: '2024-03-15',
    skills: ['React', 'TypeScript', 'Next.js', 'Redux'],
    description: `네이버 검색 서비스의 프론트엔드 개발을 담당합니다.

주요 업무:
- 검색 결과 페이지 UI/UX 개선
- 성능 최적화 및 접근성 향상
- 디자인 시스템 컴포넌트 개발
- A/B 테스트 및 데이터 기반 개선

자격 요건:
- React, TypeScript 실무 경험 3년 이상
- 웹 표준 및 접근성에 대한 이해
- 협업 및 커뮤니케이션 능력`,
    companyInfo: {
      industry: 'IT/인터넷',
      employees: '4,000명 이상',
      founded: '1999년',
      logo: 'https://via.placeholder.com/80?text=N'
    },
    jobUrl: 'https://recruit.navercorp.com/',
    postedAt: '2024-02-01'
  },
  {
    id: 'job-2',
    company: '카카오',
    position: '웹 프론트엔드 개발자',
    location: '경기 성남시 분당구',
    salary: '5,500 ~ 8,000만원',
    deadline: '2024-03-20',
    skills: ['React', 'TypeScript', 'GraphQL', 'Emotion'],
    description: `카카오톡 웹 버전 개발을 담당합니다.

주요 업무:
- 카카오톡 PC 웹 클라이언트 개발
- 실시간 메시징 UI 구현
- 크로스 브라우저 호환성 확보

자격 요건:
- 웹 프론트엔드 개발 경력 5년 이상
- 실시간 통신 (WebSocket) 경험
- 대용량 트래픽 서비스 경험`,
    companyInfo: {
      industry: 'IT/인터넷',
      employees: '6,000명 이상',
      founded: '2010년',
      logo: 'https://via.placeholder.com/80?text=K'
    },
    jobUrl: 'https://careers.kakao.com/',
    postedAt: '2024-02-05'
  },
  {
    id: 'job-3',
    company: '토스',
    position: 'Frontend Engineer',
    location: '서울 강남구',
    salary: '6,000 ~ 9,000만원',
    deadline: '2024-03-25',
    skills: ['React', 'TypeScript', 'React Query', 'Recoil'],
    description: `토스 금융 서비스의 웹 프론트엔드를 개발합니다.

주요 업무:
- 금융 서비스 UI/UX 개발
- 모바일 웹뷰 최적화
- 보안 관련 프론트엔드 구현

자격 요건:
- 프론트엔드 개발 경력 4년 이상
- 금융/핀테크 도메인 경험 우대
- 보안 관련 지식 보유`,
    companyInfo: {
      industry: '금융/핀테크',
      employees: '2,000명 이상',
      founded: '2013년',
      logo: 'https://via.placeholder.com/80?text=T'
    },
    jobUrl: 'https://toss.im/career',
    postedAt: '2024-02-10'
  },
  {
    id: 'job-4',
    company: '쿠팡',
    position: '프론트엔드 개발자',
    location: '서울 송파구',
    salary: '5,500 ~ 7,500만원',
    deadline: '2024-03-18',
    skills: ['React', 'JavaScript', 'Node.js', 'AWS'],
    description: `쿠팡 이커머스 플랫폼의 프론트엔드 개발을 담당합니다.

주요 업무:
- 상품 상세 페이지 개발
- 결제 프로세스 UI 구현
- 성능 최적화 (Core Web Vitals)

자격 요건:
- 프론트엔드 개발 경력 3년 이상
- 대규모 트래픽 처리 경험
- E-commerce 도메인 이해`,
    companyInfo: {
      industry: '유통/이커머스',
      employees: '15,000명 이상',
      founded: '2010년',
      logo: 'https://via.placeholder.com/80?text=C'
    },
    jobUrl: 'https://www.coupang.jobs/',
    postedAt: '2024-02-08'
  },
  {
    id: 'job-5',
    company: '당근마켓',
    position: '웹 개발자',
    location: '서울 서초구',
    salary: '5,000 ~ 7,000만원',
    deadline: '2024-03-30',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    description: `당근마켓 웹 서비스 개발을 담당합니다.

주요 업무:
- 중고거래 웹 플랫폼 개발
- SEO 최적화
- 모바일 반응형 구현

자격 요건:
- 웹 개발 경력 2년 이상
- Next.js SSR/SSG 경험
- UI/UX에 대한 관심`,
    companyInfo: {
      industry: 'IT/스타트업',
      employees: '500명 이상',
      founded: '2015년',
      logo: 'https://via.placeholder.com/80?text=D'
    },
    jobUrl: 'https://about.daangn.com/jobs/',
    postedAt: '2024-02-12'
  },
  {
    id: 'job-6',
    company: '라인',
    position: 'Frontend Developer',
    location: '경기 성남시 분당구',
    salary: '5,500 ~ 8,000만원',
    deadline: '2024-04-01',
    skills: ['Vue.js', 'TypeScript', 'Webpack', 'SCSS'],
    description: `LINE 메신저 관련 웹 서비스 개발을 담당합니다.

주요 업무:
- LINE 웹 스토어 개발
- 글로벌 서비스 다국어 지원
- 크로스 플랫폼 호환성

자격 요건:
- 프론트엔드 개발 경력 4년 이상
- Vue.js 또는 React 숙련
- 영어 커뮤니케이션 가능`,
    companyInfo: {
      industry: 'IT/인터넷',
      employees: '3,000명 이상',
      founded: '2000년',
      logo: 'https://via.placeholder.com/80?text=L'
    },
    jobUrl: 'https://careers.linecorp.com/',
    postedAt: '2024-02-15'
  },
  {
    id: 'job-7',
    company: '배달의민족',
    position: '프론트엔드 엔지니어',
    location: '서울 송파구',
    salary: '5,000 ~ 7,500만원',
    deadline: '2024-03-28',
    skills: ['React', 'TypeScript', 'MobX', 'Storybook'],
    description: `배달의민족 서비스의 웹 프론트엔드를 개발합니다.

주요 업무:
- 사장님 관리 페이지 개발
- 배달 현황 실시간 대시보드
- 디자인 시스템 구축

자격 요건:
- 프론트엔드 개발 경력 3년 이상
- 상태 관리 라이브러리 경험
- 컴포넌트 설계 능력`,
    companyInfo: {
      industry: 'IT/O2O',
      employees: '4,000명 이상',
      founded: '2010년',
      logo: 'https://via.placeholder.com/80?text=B'
    },
    jobUrl: 'https://career.woowahan.com/',
    postedAt: '2024-02-18'
  },
  {
    id: 'job-8',
    company: 'NHN',
    position: '웹 프론트엔드 개발자',
    location: '경기 성남시 분당구',
    salary: '4,500 ~ 6,500만원',
    deadline: '2024-04-05',
    skills: ['JavaScript', 'React', 'jQuery', 'CSS'],
    description: `NHN의 다양한 웹 서비스 개발을 담당합니다.

주요 업무:
- 페이코 웹 서비스 개발
- 게임 포털 UI 구현
- 레거시 코드 현대화

자격 요건:
- 웹 개발 경력 2년 이상
- JavaScript 깊은 이해
- 레거시 마이그레이션 경험 우대`,
    companyInfo: {
      industry: 'IT/게임',
      employees: '5,000명 이상',
      founded: '2013년',
      logo: 'https://via.placeholder.com/80?text=NHN'
    },
    jobUrl: 'https://recruit.nhn.com/',
    postedAt: '2024-02-20'
  }
];

// Mock 지원 현황 데이터
export const mockApplications: JobApplication[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    jobId: 'job-1',
    companyName: '네이버',
    position: '프론트엔드 개발자',
    jobUrl: 'https://recruit.navercorp.com/',
    status: 'interview',
    result: 'pending',
    appliedAt: '2024-02-05',
    interviewAt: '2024-02-20',
    salaryRange: '5,000 ~ 7,000만원',
    location: '경기 성남시 분당구',
    createdAt: '2024-02-03',
    updatedAt: '2024-02-15'
  },
  {
    id: 'app-2',
    userId: 'user-1',
    jobId: 'job-3',
    companyName: '토스',
    position: 'Frontend Engineer',
    jobUrl: 'https://toss.im/career',
    status: 'applied',
    result: 'pending',
    appliedAt: '2024-02-10',
    salaryRange: '6,000 ~ 9,000만원',
    location: '서울 강남구',
    createdAt: '2024-02-08',
    updatedAt: '2024-02-10'
  },
  {
    id: 'app-3',
    userId: 'user-1',
    jobId: 'job-2',
    companyName: '카카오',
    position: '웹 프론트엔드 개발자',
    jobUrl: 'https://careers.kakao.com/',
    status: 'result',
    result: 'passed',
    appliedAt: '2024-01-20',
    interviewAt: '2024-02-01',
    salaryRange: '5,500 ~ 8,000만원',
    location: '경기 성남시 분당구',
    createdAt: '2024-01-18',
    updatedAt: '2024-02-10'
  },
  {
    id: 'app-4',
    userId: 'user-1',
    jobId: 'job-4',
    companyName: '쿠팡',
    position: '프론트엔드 개발자',
    jobUrl: 'https://www.coupang.jobs/',
    status: 'interested',
    result: 'pending',
    salaryRange: '5,500 ~ 7,500만원',
    location: '서울 송파구',
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12'
  },
  {
    id: 'app-5',
    userId: 'user-1',
    jobId: 'job-5',
    companyName: '당근마켓',
    position: '웹 개발자',
    status: 'interested',
    result: 'pending',
    salaryRange: '5,000 ~ 7,000만원',
    location: '서울 서초구',
    createdAt: '2024-02-14',
    updatedAt: '2024-02-14'
  },
  {
    id: 'app-6',
    userId: 'user-1',
    companyName: '라인',
    position: 'Frontend Developer',
    status: 'result',
    result: 'failed',
    appliedAt: '2024-01-10',
    interviewAt: '2024-01-25',
    salaryRange: '5,500 ~ 8,000만원',
    location: '경기 성남시 분당구',
    createdAt: '2024-01-08',
    updatedAt: '2024-02-05'
  }
];

// Mock 메모 데이터
export const mockNotes: JobNote[] = [
  {
    id: 'note-1',
    applicationId: 'app-1',
    userId: 'user-1',
    content: '<p>네이버 1차 면접 준비</p><ul><li>React 최적화 방법</li><li>Virtual DOM 동작 원리</li><li>상태 관리 경험</li></ul>',
    noteType: 'interview',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15'
  },
  {
    id: 'note-2',
    applicationId: 'app-3',
    userId: 'user-1',
    content: '<p>카카오 최종 합격! 3월 1일 입사 예정</p><p>연봉 협상: 6,500만원 확정</p>',
    noteType: 'memo',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: 'note-3',
    applicationId: 'app-6',
    userId: 'user-1',
    content: '<p>라인 불합격 피드백</p><ul><li>영어 면접에서 부족했음</li><li>글로벌 서비스 경험 부족</li></ul><p>다음에는 영어 준비 더 철저히!</p>',
    noteType: 'analysis',
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  }
];

// Mock 캘린더 이벤트
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: '네이버 1차 면접',
    date: '2024-02-20',
    type: 'interview',
    applicationId: 'app-1',
    color: '#03C75A'
  },
  {
    id: 'event-2',
    title: '토스 서류 마감',
    date: '2024-03-25',
    type: 'deadline',
    applicationId: 'app-2',
    color: '#0064FF'
  },
  {
    id: 'event-3',
    title: '네이버 공고 마감',
    date: '2024-03-15',
    type: 'deadline',
    color: '#03C75A'
  },
  {
    id: 'event-4',
    title: '쿠팡 공고 마감',
    date: '2024-03-18',
    type: 'deadline',
    color: '#E31837'
  }
];
