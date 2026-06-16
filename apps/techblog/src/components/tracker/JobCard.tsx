import React from 'react';
import { Button, Card, Badge } from '@sonhoseong/mfa-lib';
import { Job } from '@/types/job';
import { useJobCard } from '@/hooks/useJobCard';

interface JobCardProps {
  job: Job;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isBookmarked, onBookmark, onClick }) => {
  const { daysUntilDeadline, visibleSkills, hiddenSkillCount, logoFallback } = useJobCard(job);

  return (
    <Card className="job-card" onClick={onClick}>
      <Card.Meta className="job-card-header">
        <div className="job-company">
          <div className="company-logo">
            {job.companyInfo.logo
              ? <img src={job.companyInfo.logo} alt={job.company} className="company-logo-img" />
              : logoFallback}
          </div>
          <div>
            <div className="company-name">{job.company}</div>
            <div className="job-position">{job.position}</div>
          </div>
        </div>
        <Button.Icon
          aria-label={isBookmarked ? '북마크 해제' : '북마크'}
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onBookmark(); }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Button.Icon>
      </Card.Meta>

      <Card.Meta className="job-meta">
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
      </Card.Meta>

      <Card.Tags className="job-skills">
        {visibleSkills.map(skill => (
          <Badge key={skill} variant="default" className="skill-tag">{skill}</Badge>
        ))}
        {hiddenSkillCount > 0 && (
          <Badge variant="ghost" className="skill-tag">
            +{hiddenSkillCount}
          </Badge>
        )}
      </Card.Tags>

      <Card.Footer className="job-deadline">
        {daysUntilDeadline > 0 ? (
          <>마감까지 <strong>{daysUntilDeadline}일</strong> 남음</>
        ) : daysUntilDeadline === 0 ? (
          <strong>오늘 마감!</strong>
        ) : (
          <span className="job-deadline-closed">마감됨</span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default JobCard;
