// 채용공고 타입
export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  deadline: string;
  skills: string[];
  description: string;
  companyInfo: CompanyInfo;
  jobUrl?: string;
  postedAt: string;
}

export interface CompanyInfo {
  industry: string;
  employees: string;
  founded: string;
  logo?: string;
}

// 지원 상태
export type ApplicationStatus = 'interested' | 'applied' | 'interview' | 'result';
export type ApplicationResult = 'pending' | 'passed' | 'failed';

// 지원 현황
export interface JobApplication {
  id: string;
  userId: string;
  jobId?: string;
  companyName: string;
  position: string;
  jobUrl?: string;
  status: ApplicationStatus;
  result: ApplicationResult;
  appliedAt?: string;
  interviewAt?: string;
  salaryRange?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// 메모/노트
export type NoteType = 'memo' | 'interview' | 'analysis';

export interface JobNote {
  id: string;
  applicationId: string;
  userId: string;
  content: string;
  noteType: NoteType;
  createdAt: string;
  updatedAt: string;
}

// 북마크
export interface JobBookmark {
  id: string;
  userId: string;
  jobId: string;
  jobData: Job;
  createdAt: string;
}

// 칸반 보드 컬럼
export interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  applications: JobApplication[];
}

// 통계 데이터
export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  passRate: number;
  monthlyTrend: { month: string; count: number }[];
}

// 캘린더 이벤트
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'interview' | 'deadline' | 'applied';
  applicationId?: string;
  color?: string;
}
