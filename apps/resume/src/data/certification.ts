export interface CertificationDetail {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
}

export const mockCertifications: CertificationDetail[] = [
  {
    id: '1',
    name: '정보처리기사',
    issuer: '한국산업인력공단',
    issue_date: '2022-06-01'
  }
];
