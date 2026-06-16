import React from 'react';
import { useToast, Button, Badge } from '@sonhoseong/mfa-lib';
import { Job } from '@/types/job';

interface JobDetailModalProps {
  job: Job;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, isBookmarked, onBookmark, onClose }) => {
  const toast = useToast();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-container--app" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="job-modal-header-info">
            <div className="company-logo company-logo--lg">
              {job.companyInfo.logo ? (
                <img src={job.companyInfo.logo} alt={job.company} className="company-logo-img" />
              ) : (
                job.company[0]
              )}
            </div>
            <div>
              <div className="modal-title">{job.company}</div>
              <div className="modal-subtitle">{job.position}</div>
            </div>
          </div>
          <Button.Icon aria-label="닫기" className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button.Icon>
        </div>

        <div className="modal-body">
          {/* 기본 정보 */}
          <div className="info-grid-panel">
            <div>
              <div className="info-grid-label">근무지</div>
              <div className="info-grid-value">{job.location}</div>
            </div>
            <div>
              <div className="info-grid-label">연봉</div>
              <div className="info-grid-value">{job.salary}</div>
            </div>
            <div>
              <div className="info-grid-label">마감일</div>
              <div className="info-grid-value">
                {new Date(job.deadline).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div className="info-grid-label">등록일</div>
              <div className="info-grid-value">
                {new Date(job.postedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* 기술 스택 */}
          <div className="section-mb-24">
            <h4 className="section-heading">기술 스택</h4>
            <div className="job-skills">
              {job.skills.map(skill => (
                <Badge key={skill} variant="default" className="skill-tag">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="section-mb-24">
            <h4 className="section-heading">상세 내용</h4>
            <div className="job-description-body">
              {job.description}
            </div>
          </div>

          {/* 기업 정보 */}
          <div>
            <h4 className="section-heading">기업 정보</h4>
            <div className="info-grid-panel info-grid-panel--cols-3 info-grid-panel--no-mb">
              <div>
                <div className="info-grid-label">업종</div>
                <div className="info-grid-value">{job.companyInfo.industry}</div>
              </div>
              <div>
                <div className="info-grid-label">사원수</div>
                <div className="info-grid-value">{job.companyInfo.employees}</div>
              </div>
              <div>
                <div className="info-grid-label">설립연도</div>
                <div className="info-grid-value">{job.companyInfo.founded}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="secondary"
            onClick={onBookmark}
            leftIcon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            )}
          >
            {isBookmarked ? '관심 등록됨' : '관심 등록'}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              toast.success('지원 목록에 추가되었습니다!');
            }}
            leftIcon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            )}
          >
            지원하기
          </Button>
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              공고 보기
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
