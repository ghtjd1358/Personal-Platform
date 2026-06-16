import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@sonhoseong/mfa-lib';
import { useDashboardStats } from '@/hooks';
import { ApplicationStatus } from '@/types/job';
import { HeroSection, StatCard } from '@/components';
import { LINK_PREFIX } from '@/config/constants';
import {
  SalaryStatsCard,
  MonthlyTrendChart,
  StatusBreakdownCard,
  UpcomingEventsCard,
  RecentApplicationsCard,
} from './components';
import './HomePage.editorial.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    stats,
    monthlyTrend,
    upcomingEvents,
    recentApplications,
  } = useDashboardStats();

  const statusLabels: Record<ApplicationStatus, string> = {
    interested: '관심',
    applied: '지원완료',
    interview: '면접',
    result: '결과'
  };

  return (
    <>
      <HeroSection />
      <div className="job-tracker-app">
        <div className="page-header">
          <h1>취업 관리 대시보드</h1>
          <p>지원 현황을 한눈에 확인하세요</p>
        </div>

        <div className="stats-grid">
          <StatCard value={stats.total} label="총 지원" />
          <StatCard value={stats.interview} label="면접 예정" />
          <StatCard value={`${stats.passRate}%`} label="합격률" />
          <StatCard value={stats.passed} label="합격" />
        </div>

        <SalaryStatsCard salary={stats.salary} />

        <MonthlyTrendChart monthlyTrend={monthlyTrend} />

        <div className="home-two-col-grid">
          <StatusBreakdownCard stats={stats} statusLabels={statusLabels} />

          <UpcomingEventsCard upcomingEvents={upcomingEvents} />

          <RecentApplicationsCard
            recentApplications={recentApplications}
            statusLabels={statusLabels}
          />
        </div>

        <div className="home-cta-row">
          <Button
            variant="primary"
            onClick={() => navigate(`${LINK_PREFIX}/search`)}
            leftIcon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
          >
            채용공고 검색
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(`${LINK_PREFIX}/tracker`)}
            leftIcon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
            )}
          >
            지원 현황 관리
          </Button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
