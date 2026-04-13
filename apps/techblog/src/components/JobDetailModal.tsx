import React from 'react';
import { Job } from '@/types/job';

interface JobDetailModalProps {
  job: Job;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, isBookmarked, onBookmark, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="company-logo" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
              {job.companyInfo.logo ? (
                <img src={job.companyInfo.logo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
              ) : (
                job.company[0]
              )}
            </div>
            <div>
              <div className="modal-title">{job.company}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{job.position}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* 기본 정보 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '24px',
            padding: '16px',
            background: 'var(--background)',
            borderRadius: 'var(--radius)'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>근무지</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.location}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>연봉</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.salary}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>마감일</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {new Date(job.deadline).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>등록일</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {new Date(job.postedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* 기술 스택 */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>기술 스택</h4>
            <div className="job-skills">
              {job.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* 상세 설명 */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>상세 내용</h4>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              color: 'var(--text-primary)'
            }}>
              {job.description}
            </div>
          </div>

          {/* 기업 정보 */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>기업 정보</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              padding: '16px',
              background: 'var(--background)',
              borderRadius: 'var(--radius)'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>업종</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.companyInfo.industry}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>사원수</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.companyInfo.employees}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>설립연도</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{job.companyInfo.founded}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className={`btn ${isBookmarked ? 'btn-secondary' : 'btn-secondary'}`}
            onClick={onBookmark}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {isBookmarked ? '관심 등록됨' : '관심 등록'}
          </button>
          <button className="btn btn-primary" onClick={() => {
            // 지원하기 로직 (칸반보드에 추가)
            alert('지원 목록에 추가되었습니다!');
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            지원하기
          </button>
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
