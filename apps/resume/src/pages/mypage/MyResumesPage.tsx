import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, useToast, selectAccessToken, LoadingSpinner, EmptyState } from '@sonhoseong/mfa-lib';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import { LINK_PREFIX } from '@/config/constants';
import { ResumeListCard, type ResumeCardData } from '../../components/cards/ResumeListCard';

const MyResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const accessToken = useSelector(selectAccessToken);
  const user = getCurrentUser();

  const [resumes, setResumes] = useState<ResumeCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UUID 형식 검증 함수
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // 데이터 로드
  useEffect(() => {
    if (!accessToken) {
      navigate(`${LINK_PREFIX}/login`);
      return;
    }

    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      if (!isValidUUID(user.id)) {
        console.error('Invalid user ID format. Please re-login.');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        navigate(`${LINK_PREFIX}/login`);
        return;
      }

      try {
        setIsLoading(true);

        // 내 모든 이력서 조회
        const resumeList = await resumesApi.getMyResumes(user.id);

        // 각 이력서별 경력/프로젝트 개수 조회
        const resumesWithCounts = await Promise.all(
          resumeList.map(async (resume) => {
            const [expCount, projCount] = await Promise.all([
              experiencesApi.countByResumeId(resume.id),
              portfoliosApi.countByResumeId(resume.id),
            ]);
            return {
              ...resume,
              experienceCount: expCount,
              projectCount: projCount,
            };
          })
        );

        setResumes(resumesWithCounts);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to load resumes:', message);
        toast.error('이력서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken, user?.id, navigate]);

  // 링크 복사
  const handleCopyLink = useCallback((resumeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${LINK_PREFIX}/resumes/${resumeId}`;
    navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다!');
  }, [toast]);

  // 대표 이력서 설정
  const handleSetPrimary = useCallback(async (resumeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) return;

    try {
      await resumesApi.setPrimaryResume(user.id, resumeId);

      // 로컬 상태 업데이트
      setResumes(prev => prev.map(r => ({
        ...r,
        is_primary: r.id === resumeId,
      })));

      toast.success('대표 이력서로 설정되었습니다.');
    } catch (err) {
      console.error('Failed to set primary resume:', err);
      toast.error('대표 이력서 설정에 실패했습니다.');
    }
  }, [user?.id, toast]);

  if (!accessToken) {
    return null;
  }

  // 로딩 스켈레톤
  const renderSkeletons = () => (
    <div className="browse-skeleton-list">
      {[1, 2, 3].map((i) => (
        <div key={i} className="browse-skeleton-card">
          <div className="browse-skeleton-header">
            <div className="browse-skeleton-avatar" />
            <div className="browse-skeleton-info">
              <div className="browse-skeleton-name" />
              <div className="browse-skeleton-title" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="my-resumes-page">
      {/* Hero Section */}
      <section className="my-resumes-hero">
        <div className="my-resumes-hero-content">
          <div className="my-resumes-hero-text">
            <h1>내 이력서</h1>
            <p>여러 개의 이력서를 관리하고 공유하세요</p>
          </div>
          <div className="my-resumes-hero-action">
            <Link to={`${LINK_PREFIX}/mypage/create`} className="btn-create-resume">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              새 이력서 만들기
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="my-resumes-content">
        {isLoading ? (
          <LoadingSpinner message="이력서를 불러오는 중..." className="browse-loading" />
        ) : resumes.length === 0 ? (
          <EmptyState
            description="아직 이력서가 없습니다. 첫 번째 이력서를 만들어 나만의 커리어를 기록해보세요!"
            action={
              <Link to={`${LINK_PREFIX}/mypage/create`} className="btn-create">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                첫 이력서 만들기
              </Link>
            }
          />
        ) : (
          <div className="browse-skeleton-list">
            {resumes.map((resume) => (
              <ResumeListCard
                key={resume.id}
                resume={resume}
                onCopyLink={handleCopyLink}
                onSetPrimary={handleSetPrimary}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumesPage;
