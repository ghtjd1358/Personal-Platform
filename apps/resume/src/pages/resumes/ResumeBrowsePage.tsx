import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, Logo } from '@sonhoseong/mfa-lib';
import { resumesApi } from '@/network';
import type { ResumeWithUser } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';

const ITEMS_PER_PAGE = 12;

const ResumeBrowsePage: React.FC = () => {
  const currentUser = useSelector(selectUser);
  const [resumes, setResumes] = useState<ResumeWithUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadResumes = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentOffset = reset ? 0 : offset;
      const { data, count } = await resumesApi.getPublicResumes(ITEMS_PER_PAGE, currentOffset);

      if (reset) {
        setResumes(data);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setResumes((prev) => [...prev, ...data]);
        setOffset((prev) => prev + ITEMS_PER_PAGE);
      }

      setTotalCount(count);
      setHasMore(currentOffset + data.length < count);
    } catch (err) {
      setError('이력서를 불러오는 중 오류가 발생했습니다.');
      console.error('Failed to load resumes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    loadResumes(true);
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadResumes();
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  // 로딩 스켈레톤 렌더링
  const renderSkeletons = () => (
    <div className="browse-skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="browse-skeleton-card">
          <div className="browse-skeleton-header">
            <div className="browse-skeleton-avatar" />
            <div className="browse-skeleton-info">
              <div className="browse-skeleton-name" />
              <div className="browse-skeleton-title" />
            </div>
          </div>
          <div className="browse-skeleton-body">
            <div className="browse-skeleton-text" />
            <div className="browse-skeleton-text" />
            <div className="browse-skeleton-text" />
          </div>
        </div>
      ))}
    </div>
  );

  // 이력서 카드 렌더링
  const renderResumeCard = (resume: ResumeWithUser) => {
    const avatarUrl = resume.user?.avatar_url ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${resume.user?.name || 'U'}`;

    return (
      <Link
        key={resume.id}
        to={`${LINK_PREFIX}/user/${resume.user_id}`}
        className="resume-card-v2"
      >
        {/* Card Header */}
        <div className="resume-card-v2__header">
          <div className="resume-card-v2__profile">
            {resume.profile_image ? (
              <img
                src={resume.profile_image}
                alt={resume.user?.name || '사용자'}
                className="resume-card-v2__avatar"
              />
            ) : (
              <div className="resume-card-v2__avatar-placeholder">
                {getInitials(resume.user?.name || '익명')}
              </div>
            )}
            <div className="resume-card-v2__info">
              <h3 className="resume-card-v2__name">{resume.name || resume.user?.name || '익명'}</h3>
              <p className="resume-card-v2__title">{resume.title || '개발자'}</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="resume-card-v2__body">
          <p className="resume-card-v2__summary">
            {resume.summary || '안녕하세요! 열정적으로 성장하는 개발자입니다. 새로운 기술을 배우고 적용하는 것을 좋아합니다.'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="resume-card-v2__footer">
          <div className="resume-card-v2__links">
            {resume.contact_email && (
              <span className="resume-card-v2__link" title="이메일">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
            )}
            {resume.github && (
              <span className="resume-card-v2__link" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </span>
            )}
            {resume.blog && (
              <span className="resume-card-v2__link" title="블로그">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </span>
            )}
          </div>
          <span className="resume-card-v2__view-btn">
            이력서 보기
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="resume-browse-page-v2">
      {/* Hero Section */}
      <section className="browse-hero">
        <div className="browse-hero-content">
          <div className="browse-hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h1>
            다양한 <span>개발자들의 이력서</span>를<br />
            둘러보세요
          </h1>
          <p>
            열정적인 개발자들의 경험과 기술 스택을 확인하고,<br />
            영감을 얻거나 네트워킹 기회를 찾아보세요.
          </p>
          <div className="browse-hero-stats">
            <div className="browse-hero-stat">
              <span className="browse-hero-stat-value">{totalCount || '-'}</span>
              <span className="browse-hero-stat-label">공개 이력서</span>
            </div>
            <div className="browse-hero-stat">
              <span className="browse-hero-stat-value">∞</span>
              <span className="browse-hero-stat-label">가능성</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="browse-main">
        <div className="browse-container">
          {/* Section Header */}
          {!isLoading && resumes.length > 0 && (
            <div className="browse-section-header">
              <h2 className="browse-section-title">최신 이력서</h2>
              <span className="browse-section-count">총 {totalCount}개</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="browse-empty">
              <div className="browse-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <h3>오류가 발생했습니다</h3>
              <p>{error}</p>
              <button onClick={() => loadResumes(true)} className="btn-create">
                다시 시도
              </button>
            </div>
          )}

          {/* Loading State - Initial */}
          {isLoading && resumes.length === 0 && !error && (
            <div className="browse-loading">
              <div className="browse-loading-spinner" />
              <span className="browse-loading-text">이력서를 불러오는 중...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && resumes.length === 0 && (
            <div className="browse-empty">
              <div className="browse-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <h3>아직 공개된 이력서가 없습니다</h3>
              <p>첫 번째로 이력서를 공개해보세요!</p>
              {currentUser && (
                <Link to={`${LINK_PREFIX}/mypage/create`} className="btn-create">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  이력서 만들기
                </Link>
              )}
            </div>
          )}

          {/* Resume Cards Grid */}
          {resumes.length > 0 && (
            <>
              <div className="browse-card-grid">
                {resumes.map(renderResumeCard)}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="browse-load-more">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="browse-load-more-btn"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-small" />
                        불러오는 중...
                      </>
                    ) : (
                      <>
                        더 많은 이력서 보기
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeBrowsePage;
