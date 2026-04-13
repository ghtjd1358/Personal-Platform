import React, { useState, useMemo } from 'react';
import { mockJobs } from '@/data/mockJobs';
import { Job } from '@/types/job';
import JobCard from '@/components/JobCard';
import JobDetailModal from '@/components/JobDetailModal';

const JobSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');
  const [selectedSkill, setSelectedSkill] = useState('전체');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // 지역 목록 추출
  const locations = useMemo(() => {
    const locs = [...new Set(mockJobs.map(job => job.location.split(' ')[0]))];
    return ['전체', ...locs];
  }, []);

  // 기술 스택 목록 추출
  const skills = useMemo(() => {
    const allSkills = mockJobs.flatMap(job => job.skills);
    const uniqueSkills = [...new Set(allSkills)];
    return ['전체', ...uniqueSkills.slice(0, 10)];
  }, []);

  // 필터링된 채용공고
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesQuery = searchQuery === '' ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = selectedLocation === '전체' ||
        job.location.includes(selectedLocation);

      const matchesSkill = selectedSkill === '전체' ||
        job.skills.includes(selectedSkill);

      return matchesQuery && matchesLocation && matchesSkill;
    });
  }, [searchQuery, selectedLocation, selectedSkill]);

  const toggleBookmark = (jobId: string) => {
    setBookmarks(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ width: '150px' }}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* 기술 스택 필터 */}
      <div className="filter-tags">
        {skills.map(skill => (
          <button
            key={skill}
            className={`filter-tag ${selectedSkill === skill ? 'active' : ''}`}
            onClick={() => setSelectedSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* 검색 결과 */}
      <div style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        총 <strong style={{ color: 'var(--primary)' }}>{filteredJobs.length}</strong>개의 채용공고
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">검색 결과가 없습니다</div>
          <div className="empty-state-desc">다른 검색어나 필터를 시도해보세요</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={bookmarks.includes(job.id)}
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
          isBookmarked={bookmarks.includes(selectedJob.id)}
          onBookmark={() => toggleBookmark(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default JobSearchPage;
