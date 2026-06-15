import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, useToast, useAsyncConfirm, selectAccessToken, LoadingSpinner, ErrorState } from '@sonhoseong/mfa-lib';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile, ProjectItem } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import {
  ResumeManagementHeader,
  ResumeHero,
  ResumeTimelineSection,
  type ExperienceDetail,
  type ProjectDetail,
} from './components';

const MyResumeDetailPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const confirmDialog = useAsyncConfirm();
  const accessToken = useSelector(selectAccessToken);
  const user = getCurrentUser();

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [experiences, setExperiences] = useState<ExperienceDetail[]>([]);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (!accessToken) {
      navigate(`${LINK_PREFIX}/login`);
      return;
    }

    if (!resumeId) {
      navigate(`${LINK_PREFIX}/mypage`);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);

        const resumeData = await resumesApi.getById(resumeId);

        if (resumeData.user_id !== user?.id) {
          toast.error('접근 권한이 없습니다.');
          navigate(`${LINK_PREFIX}/mypage`);
          return;
        }

        setResume(resumeData);

        // 경력/프로젝트 조회
        const { data: expData } = await experiencesApi.getByResumeId(resumeId);
        setExperiences((expData || []) as ExperienceDetail[]);

        const { data: projData } = await portfoliosApi.getByResumeId(resumeId);
        setProjects(
          (projData || []).map((p: ProjectItem) => ({
            ...p,
            image: p.image_url || undefined,
          })) as ProjectDetail[]
        );
      } catch (err) {
        console.error('Failed to load resume detail:', err);
        toast.error('이력서를 불러오는 중 오류가 발생했습니다.');
        navigate(`${LINK_PREFIX}/mypage`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken, resumeId, user?.id, navigate, toast]);

  // 공개/비공개 토글
  const handleToggleVisibility = useCallback(async () => {
    if (!resume || !user?.id) return;

    try {
      setIsSaving(true);
      const newVisibility = resume.visibility === 'public' ? 'private' : 'public';
      await resumesApi.update(resume.id, { visibility: newVisibility }, user.id);
      setResume({ ...resume, visibility: newVisibility });
      toast.success(newVisibility === 'public' ? '이력서가 공개되었습니다.' : '이력서가 비공개로 설정되었습니다.');
    } catch (err) {
      toast.error('설정 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [resume, user?.id, toast]);

  // 대표 이력서 설정
  const handleSetPrimary = useCallback(async () => {
    if (!resume || !user?.id || resume.is_primary) return;

    try {
      setIsSaving(true);
      await resumesApi.setPrimaryResume(user.id, resume.id);
      setResume({ ...resume, is_primary: true });
      toast.success('대표 이력서로 설정되었습니다.');
    } catch (err) {
      toast.error('대표 이력서 설정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [resume, user?.id, toast]);

  // 링크 복사
  const handleCopyLink = useCallback(() => {
    if (!resumeId) return;
    const url = `${window.location.origin}${LINK_PREFIX}/resumes/${resumeId}`;
    navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다!');
  }, [resumeId, toast]);

  // 이력서 삭제
  const handleDelete = useCallback(async () => {
    if (!resume) return;

    const ok = await confirmDialog(
      `"${resume.resume_name || '이력서'}"를 삭제하시겠습니까?\n\n연결된 경력과 프로젝트도 함께 삭제됩니다.`,
      '이력서 삭제'
    );
    if (!ok) return;

    try {
      setIsSaving(true);
      await resumesApi.delete(resume.id);
      toast.success('이력서가 삭제되었습니다.');
      navigate(`${LINK_PREFIX}/mypage`);
    } catch (err) {
      toast.error('이력서 삭제에 실패했습니다.');
      setIsSaving(false);
    }
  }, [resume, navigate, toast, confirmDialog]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  }, []);

  if (!accessToken) return null;

  if (isLoading) {
    return <LoadingSpinner fullPage message="이력서를 불러오는 중" />;
  }

  if (!resume) {
    return (
      <ErrorState
        message="이력서를 찾을 수 없습니다."
        backHref={`${LINK_PREFIX}/mypage`}
        backLabel="목록으로 돌아가기"
      />
    );
  }

  return (
    <div className="my-resume-detail-page">
      <ResumeManagementHeader
        resume={resume}
        resumeId={resumeId!}
        isSaving={isSaving}
        onToggleVisibility={handleToggleVisibility}
        onSetPrimary={handleSetPrimary}
        onCopyLink={handleCopyLink}
        onDelete={handleDelete}
      />

      <ResumeHero resume={resume} />

      <ResumeTimelineSection
        resumeId={resumeId!}
        experiences={experiences}
        projects={projects}
        expandedItem={expandedItem}
        onToggleExpand={handleToggleExpand}
      />
    </div>
  );
};

export default MyResumeDetailPage;
