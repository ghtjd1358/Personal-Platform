import React, { useState, useEffect, useCallback } from 'react';
import { resumesApi } from '@/network';
import { ResumeCard } from '@/components/resume';
import type { ResumeWithUser } from '@/network/apis/resume/types/resume';

const ITEMS_PER_PAGE = 12;

const ResumeBrowsePage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeWithUser[]>([]);
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

  return (
    <div className="resume-browse-page">
      <div className="resume-browse-header">
        <h1 className="resume-browse-title">이력서 둘러보기</h1>
        <p className="resume-browse-subtitle">
          다양한 개발자들의 이력서를 구경해보세요
        </p>
      </div>

      {error && (
        <div className="resume-browse-error">
          <p>{error}</p>
          <button onClick={() => loadResumes(true)}>다시 시도</button>
        </div>
      )}

      {resumes.length === 0 && !isLoading ? (
        <div className="resume-browse-empty">
          <div className="resume-browse-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
            </svg>
          </div>
          <p>아직 공개된 이력서가 없습니다.</p>
          <span>첫 번째로 이력서를 공개해보세요!</span>
        </div>
      ) : (
        <>
          <div className="resume-browse-grid">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>

          {hasMore && (
            <div className="resume-browse-load-more">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="btn-load-more"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    불러오는 중...
                  </>
                ) : (
                  '더 보기'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {isLoading && resumes.length === 0 && (
        <div className="resume-browse-loading">
          <div className="resume-browse-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="resume-card-skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-header" />
                  <div className="skeleton-title" />
                  <div className="skeleton-text" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBrowsePage;
