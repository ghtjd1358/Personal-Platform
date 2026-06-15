import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@sonhoseong/mfa-lib';
import { ApplicationStatus } from '@/types/job';
import { LINK_PREFIX } from '@/config/constants';

interface StatusBreakdownCardProps {
  stats: {
    total: number;
    interested: number;
    applied: number;
    interview: number;
    result: number;
  };
  statusLabels: Record<ApplicationStatus, string>;
}

const StatusBreakdownCard: React.FC<StatusBreakdownCardProps> = ({ stats, statusLabels }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">단계별 현황</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`${LINK_PREFIX}/tracker`)}
        >
          상세보기
        </Button>
      </div>
      <div className="status-list">
        {(['interested', 'applied', 'interview', 'result'] as ApplicationStatus[]).map(status => (
          <div key={status} className="status-row">
            <span className="status-row-label">
              {statusLabels[status]}
            </span>
            <div className="status-row-track">
              <div
                className="status-row-bar"
                style={{
                  width: stats.total > 0 ? `${(stats[status] / stats.total) * 100}%` : '0%',
                  background: status === 'result' ? 'var(--success)' :
                             status === 'interview' ? 'var(--warning)' :
                             status === 'applied' ? 'var(--primary)' : 'var(--secondary)',
                }}
              />
            </div>
            <span className="status-row-count">
              {stats[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBreakdownCard;
