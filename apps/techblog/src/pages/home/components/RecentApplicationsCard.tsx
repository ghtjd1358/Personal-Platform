import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '@sonhoseong/mfa-lib';
import { ApplicationStatus } from '@/types/job';
import { LINK_PREFIX } from '@/config/constants';

interface RecentApplication {
  id: string;
  companyName: string;
  position: string;
  salaryRange?: string;
  status: ApplicationStatus;
  result?: 'passed' | 'failed' | string;
  updatedAt: string;
}

interface RecentApplicationsCardProps {
  recentApplications: RecentApplication[];
  statusLabels: Record<ApplicationStatus, string>;
}

const RecentApplicationsCard: React.FC<RecentApplicationsCardProps> = ({
  recentApplications,
  statusLabels,
}) => {
  const navigate = useNavigate();

  return (
    <div className="card home-card-full">
      <div className="card-header">
        <h3 className="card-title">최근 지원 현황</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`${LINK_PREFIX}/tracker`)}
        >
          전체보기
        </Button>
      </div>
      {recentApplications.length === 0 ? (
        <EmptyState description="지원 내역이 없습니다" />
      ) : (
        <div className="recent-app-list">
          {recentApplications.map(app => (
            <div
              key={app.id}
              className="recent-app-row"
            >
              <div className="recent-app-row-left">
                <div className="company-logo company-logo--md">
                  {app.companyName[0]}
                </div>
                <div>
                  <div className="recent-app-row-name">{app.companyName}</div>
                  <div className="recent-app-row-position">
                    {app.position}
                    {app.salaryRange && (
                      <span className="recent-app-row-salary">
                        💰 {app.salaryRange}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="recent-app-row-right">
                <span
                  className={`recent-app-status-badge ${
                    app.status === 'result'
                      ? (app.result === 'passed'
                        ? 'recent-app-status-badge--passed'
                        : 'recent-app-status-badge--failed')
                      : 'recent-app-status-badge--default'
                  }`}
                >
                  {app.status === 'result'
                    ? (app.result === 'passed' ? '합격' : '불합격')
                    : statusLabels[app.status]}
                </span>
                <span className="recent-app-row-date">
                  {new Date(app.updatedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplicationsCard;
