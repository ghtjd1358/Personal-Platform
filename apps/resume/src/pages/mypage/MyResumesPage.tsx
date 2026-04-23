import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, useToast, selectAccessToken } from '@sonhoseong/mfa-lib';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';

interface ResumeCardData extends ResumeProfile {
  experienceCount: number;
  projectCount: number;
}

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="browse-skeleton-card" style={{ padding: '24px' }}>
          <div className="browse-skeleton-header">
            <div className="browse-skeleton-avatar" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            <div className="browse-skeleton-info" style={{ flex: 1 }}>
              <div className="browse-skeleton-name" style={{ width: '40%', marginBottom: '8px' }} />
              <div className="browse-skeleton-title" style={{ width: '60%' }} />
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
          <div className="browse-loading">
            <div className="browse-loading-spinner" />
            <span className="browse-loading-text">이력서를 불러오는 중...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="browse-empty">
            <div className="browse-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>아직 이력서가 없습니다</h3>
            <p>첫 번째 이력서를 만들어 나만의 커리어를 기록해보세요!</p>
            <Link to={`${LINK_PREFIX}/mypage/create`} className="btn-create">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              첫 이력서 만들기
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resumes.map((resume) => (
              <Link
                key={resume.id}
                to={`${LINK_PREFIX}/mypage/${resume.id}`}
                className="my-resume-card"
              >
                {/* Icon */}
                <div className="my-resume-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>

                {/* Content */}
                <div className="my-resume-card__content">
                  <div className="my-resume-card__header">
                    <h3 className="my-resume-card__name">{resume.resume_name || '이력서'}</h3>
                    <div className="my-resume-card__badges">
                      {resume.is_primary && (
                        <span className="my-resume-card__badge my-resume-card__badge--primary">
                          ⭐ 대표
                        </span>
                      )}
                      <span className={`my-resume-card__badge my-resume-card__badge--${resume.visibility === 'public' ? 'public' : 'private'}`}>
                        {resume.visibility === 'public' ? '🌐 공개' : '🔒 비공개'}
                      </span>
                    </div>
                  </div>
                  <p className="my-resume-card__title">{resume.title || '직함 없음'}</p>
                  <div className="my-resume-card__stats">
                    <span className="my-resume-card__stat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      경력 {resume.experienceCount}건
                    </span>
                    <span className="my-resume-card__stat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      프로젝트 {resume.projectCount}건
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="my-resume-card__actions">
                  {resume.visibility === 'public' && (
                    <button
                      onClick={(e) => handleCopyLink(resume.id, e)}
                      className="my-resume-card__action-btn my-resume-card__action-btn--link"
                      title="공유 링크 복사"
                    >
                      📋 링크 복사
                    </button>
                  )}
                  {!resume.is_primary && (
                    <button
                      onClick={(e) => handleSetPrimary(resume.id, e)}
                      className="my-resume-card__action-btn my-resume-card__action-btn--primary"
                      title="대표 이력서로 설정"
                    >
                      ⭐ 대표 설정
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumesPage;
