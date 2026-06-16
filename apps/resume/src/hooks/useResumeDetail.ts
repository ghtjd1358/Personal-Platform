import { useState, useEffect } from 'react';
import { resumesApi } from '@/network';
import type { ResumeDetail } from '@/network/apis/resume/types/resume';

interface UseResumeDetailResult {
  resume: ResumeDetail | null;
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;
  expandedItem: string | null;
  toggleExpanded: (id: string) => void;
}

export function useResumeDetail(id: string | undefined, currentUserId: string | undefined): UseResumeDetailResult {
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isOwner = Boolean(currentUserId && resume && currentUserId === resume.user_id);

  useEffect(() => {
    const load = async () => {
      if (!id) { setError('이력서 ID가 없습니다.'); setIsLoading(false); return; }
      try {
        setIsLoading(true);
        setError(null);
        const data = await resumesApi.getDetailById(id);
        if (!data) { setError('이력서를 찾을 수 없습니다.'); return; }
        if (data.visibility === 'private' && data.user_id !== currentUserId) { setError('비공개 이력서입니다.'); return; }
        setResume(data);
      } catch {
        setError('이력서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, currentUserId]);

  const toggleExpanded = (itemId: string) =>
    setExpandedItem(prev => (prev === itemId ? null : itemId));

  return { resume, isLoading, error, isOwner, expandedItem, toggleExpanded };
}
