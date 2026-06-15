import React from 'react';
import { Badge, type BadgeVariant } from '@sonhoseong/mfa-lib';
import type { ApplicationStatus } from '@/types/job';

/**
 * 지원 상태 배지.
 *
 * lib `Badge` 위에 ApplicationStatus → variant/label 매핑을 캡슐화한다.
 * TrackerPage / ApplicationCard / ApplicationDetailModal 등 어디서 쓰든 라벨/색이 통일된다.
 */
interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const STATUS_VARIANT: Record<ApplicationStatus, BadgeVariant> = {
  interested: 'default',
  applied: 'info',
  interview: 'warning',
  result: 'success',
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  interested: '관심',
  applied: '지원',
  interview: '면접',
  result: '결과',
};

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status, className = '' }) => (
  <Badge
    variant={STATUS_VARIANT[status]}
    className={`application-status-badge application-status-badge--${status} ${className}`.trim()}
  >
    {STATUS_LABEL[status]}
  </Badge>
);

export { ApplicationStatusBadge };
export type { ApplicationStatusBadgeProps };
