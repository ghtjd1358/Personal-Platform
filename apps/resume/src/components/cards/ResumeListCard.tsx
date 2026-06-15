import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@sonhoseong/mfa-lib';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';

export interface ResumeCardData extends ResumeProfile {
  experienceCount: number;
  projectCount: number;
}

/**
 * 내 이력서 목록 카드 (MyResumesPage 전용).
 *
 * 공개/비공개·대표 표시는 Badge 프리미티브. 행동 핸들러는 props 로 위임 — Link 안의
 * action button 이므로 stopPropagation 은 페이지의 onCopyLink/onSetPrimary 안에서 처리.
 */
interface ResumeListCardProps {
  resume: ResumeCardData;
  onCopyLink?: (id: string, e: React.MouseEvent) => void;
  onSetPrimary?: (id: string, e: React.MouseEvent) => void;
}

const ResumeListCard: React.FC<ResumeListCardProps> = ({
  resume,
  onCopyLink,
  onSetPrimary,
}) => {
  return (
    <Link
      to={`${LINK_PREFIX}/mypage/${resume.id}`}
      className="my-resume-card"
    >
      {/* Icon */}
      <div className="my-resume-card__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>

      {/* Content */}
      <div className="my-resume-card__content">
        <div className="my-resume-card__header">
          <h3 className="my-resume-card__name">{resume.resume_name || '이력서'}</h3>
          <div className="my-resume-card__badges">
            {resume.is_primary && (
              <Badge variant="primary" className="my-resume-card__badge my-resume-card__badge--primary">
                ⭐ 대표
              </Badge>
            )}
            <Badge
              variant={resume.visibility === 'public' ? 'success' : 'default'}
              className={`my-resume-card__badge my-resume-card__badge--${resume.visibility === 'public' ? 'public' : 'private'}`}
            >
              {resume.visibility === 'public' ? '🌐 공개' : '🔒 비공개'}
            </Badge>
          </div>
        </div>
        <p className="my-resume-card__title">{resume.title || '직함 없음'}</p>
        <div className="my-resume-card__stats">
          <span className="my-resume-card__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            경력 {resume.experienceCount}건
          </span>
          <span className="my-resume-card__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            프로젝트 {resume.projectCount}건
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="my-resume-card__actions">
        {resume.visibility === 'public' && onCopyLink && (
          <button
            onClick={(e) => onCopyLink(resume.id, e)}
            className="my-resume-card__action-btn my-resume-card__action-btn--link"
            title="공유 링크 복사"
          >
            📋 링크 복사
          </button>
        )}
        {!resume.is_primary && onSetPrimary && (
          <button
            onClick={(e) => onSetPrimary(resume.id, e)}
            className="my-resume-card__action-btn my-resume-card__action-btn--primary"
            title="대표 이력서로 설정"
          >
            ⭐ 대표 설정
          </button>
        )}
      </div>
    </Link>
  );
};

export { ResumeListCard };
export type { ResumeListCardProps };
