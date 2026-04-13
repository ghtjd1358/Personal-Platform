export interface ContactLink {
  id: string;
  type: 'email' | 'github' | 'blog' | 'linkedin' | 'other';
  url: string;
  label?: string;
}

export const mockContactLinks: ContactLink[] = [
  { id: '1', type: 'email', url: 'hoseong1358@gmail.com', label: '이메일 보내기' },
  { id: '2', type: 'github', url: 'https://github.com/ghtjd1358', label: 'GitHub' },
  { id: '3', type: 'blog', url: 'https://velog.io/@ghtjd1358/series', label: '블로그' },
];
