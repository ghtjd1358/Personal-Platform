import { useState, useEffect } from 'react';
import { storage } from '@sonhoseong/mfa-lib';
import { resumesApi } from '@/network';
import type { ResumeDetail } from '@/network/apis/resume/types/resume';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface UseUserResumeResult {
  resume: ResumeDetail | null;
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;
  isStandalone: boolean;
  defaultAvatar: string;
}

export function useUserResume(userId: string | undefined, currentUserId: string | undefined): UseUserResumeResult {
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUserId === userId;
  const isStandalone = !storage.isHostApp();
  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${resume?.user?.name || 'U'}`;

  useEffect(() => {
    const load = async () => {
      if (!userId) { setError('사용자 ID가 없습니다.'); setIsLoading(false); return; }
      if (!UUID_RE.test(userId)) { setError('잘못된 사용자 ID 형식입니다.'); setIsLoading(false); return; }
      try {
        setIsLoading(true);
        setError(null);
        const data = await resumesApi.getDetailByUserId(userId);
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
  }, [userId, currentUserId]);

  return { resume, isLoading, error, isOwner, isStandalone, defaultAvatar };
}
