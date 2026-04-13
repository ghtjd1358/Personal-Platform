import React from 'react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isBookmarked, onBookmark, onClick }) => {
  const daysUntilDeadline = Math.ceil(
    (new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-card-header">
        <div className="job-company">
          <div className="company-logo">
            {job.companyInfo.logo ? (
              <img src={job.companyInfo.logo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
            ) : (
              job.company[0]
            )}
          </div>
          <div>
            <div className="company-name">{job.company}</div>
            <div className="job-position">{job.position}</div>
          </div>
        </div>
        <button
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <div className="job-meta">
        <span className="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </span>
        <span className="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          {job.salary}
        </span>
        <span className="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          {job.companyInfo.industry}
        </span>
      </div>

      <div className="job-skills">
        {job.skills.slice(0, 4).map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
        {job.skills.length > 4 && (
          <span className="skill-tag" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      <div className="job-deadline">
        {daysUntilDeadline > 0 ? (
          <>마감까지 <strong>{daysUntilDeadline}일</strong> 남음</>
        ) : daysUntilDeadline === 0 ? (
          <strong>오늘 마감!</strong>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>마감됨</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
