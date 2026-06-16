import React from 'react';
import { Card, Button } from '@sonhoseong/mfa-lib';
import type { JobApplication } from '@/types/job';
import { ApplicationStatusBadge } from '../badges/ApplicationStatusBadge';

/**
 * 지원 내역 카드 — TrackerPage 칸반 보드에서 사용 예정.
 *
 * 현재 TrackerPage 는 "준비 중" placeholder 라 사용처가 비어 있지만,
 * 칸반 재개 시 바로 끼울 수 있도록 lib `Card` + `ApplicationStatusBadge` 기반으로 미리 정리.
 */
interface ApplicationCardProps {
  application: JobApplication;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onClick,
  onDelete,
  className = '',
}) => {
  return (
    <Card className={`application-card ${className}`.trim()} onClick={onClick}>
      <Card.Meta className="application-card-header">
        <div className="application-card-company">
          <div className="application-card-company-name">{application.companyName}</div>
          <div className="application-card-position">{application.position}</div>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </Card.Meta>

      {(application.location || application.salaryRange) && (
        <Card.Meta className="application-card-meta">
          {application.location && (
            <span className="application-card-meta-item">📍 {application.location}</span>
          )}
          {application.salaryRange && (
            <span className="application-card-meta-item">💰 {application.salaryRange}</span>
          )}
        </Card.Meta>
      )}

      {onDelete && (
        <Card.Footer className="application-card-footer">
          <Button.Icon
            aria-label="지원 내역 삭제"
            className="application-card-delete-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
            </svg>
          </Button.Icon>
        </Card.Footer>
      )}
    </Card>
  );
};

export { ApplicationCard };
export type { ApplicationCardProps };
