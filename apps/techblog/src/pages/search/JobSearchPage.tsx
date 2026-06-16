import React, { useState } from 'react';
import { Button, EmptyState, LoadingSpinner } from '@sonhoseong/mfa-lib';
import { Job } from '@/types/job';
import { useJobs, useJobBookmarks } from '@/hooks';
import JobCard from '@/components/tracker/JobCard';
import JobDetailModal from '@/components/modals/JobDetailModal';

const JobSearchPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Use hooks for data fetching
  const {
    jobs,
    isLoading,
    locations,
    skills,
    currentSearch,
    currentLocation,
    currentSkill,
    setSearch,
    setLocation,
    setSkill,
    pagination,
  } = useJobs();

  const { isBookmarked, toggle: toggleBookmark } = useJobBookmarks();

  return (
    <div className="job-tracker-app">
      <div className="page-header">
        <h1>채용공고 검색</h1>
        <p>관심있는 채용공고를 찾아보세요</p>
      </div>

      {/* 검색 바 */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="회사명, 포지션, 기술 스택으로 검색..."
            value={currentSearch}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input"
          value={currentLocation}
          onChange={(e) => setLocation(e.target.value)}
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* 기술 스택 필터 */}
      <div className="filter-tags">
        {skills.map(skill => (
          <Button
            key={skill}
            size="sm"
            variant={currentSkill === skill ? 'primary' : 'ghost'}
            className={`filter-tag ${currentSkill === skill ? 'active' : ''}`}
            onClick={() => setSkill(skill)}
          >
            {skill}
          </Button>
        ))}
      </div>

      {/* 검색 결과 */}
      <div className="search-results-meta">
        총 <strong className="search-results-meta-count">{pagination.total}</strong>개의 채용공고
      </div>

      {isLoading ? (
        <LoadingSpinner message="로딩 중" />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없습니다"
          description="다른 검색어나 필터를 시도해보세요"
        />
      ) : (
        <div className="search-results-grid">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={isBookmarked(job.id)}
              onBookmark={() => toggleBookmark(job.id)}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>
      )}

      {/* 채용공고 상세 모달 */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isBookmarked={isBookmarked(selectedJob.id)}
          onBookmark={() => toggleBookmark(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default JobSearchPage;
