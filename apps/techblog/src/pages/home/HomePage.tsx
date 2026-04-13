import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isHostApp } from '@sonhoseong/mfa-lib';
import { mockApplications, mockCalendarEvents } from '@/data/mockJobs';
import { ApplicationStatus } from '@/types/job';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const LINK_PREFIX = isHostApp() ? '/container/jobtracker' : '/jobtracker';

  // 통계 계산
  const stats = {
    total: mockApplications.length,
    interested: mockApplications.filter(a => a.status === 'interested').length,
    applied: mockApplications.filter(a => a.status === 'applied').length,
    interview: mockApplications.filter(a => a.status === 'interview').length,
    result: mockApplications.filter(a => a.status === 'result').length,
    passed: mockApplications.filter(a => a.result === 'passed').length,
    failed: mockApplications.filter(a => a.result === 'failed').length
  };

  const passRate = stats.result > 0
    ? Math.round((stats.passed / stats.result) * 100)
    : 0;

  // 다가오는 일정 (3개)
  const upcomingEvents = mockCalendarEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // 최근 지원 (3개)
  const recentApplications = [...mockApplications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const statusLabels: Record<ApplicationStatus, string> = {
    interested: '관심',
    applied: '지원완료',
    interview: '면접',
    result: '결과'
  };

  return (
    <div className="job-tracker-app">
      <div className="page-header">
        <h1>취업 관리 대시보드</h1>
        <p>지원 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">총 지원</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.interview}</div>
          <div className="stat-label">면접 예정</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{passRate}%</div>
          <div className="stat-label">합격률</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.passed}</div>
          <div className="stat-label">합격</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 단계별 현황 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">단계별 현황</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => navigate(`${LINK_PREFIX}/tracker`)}
            >
              상세보기
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(['interested', 'applied', 'interview', 'result'] as ApplicationStatus[]).map(status => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '80px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {statusLabels[status]}
                </span>
                <div style={{
                  flex: 1,
                  height: '24px',
                  background: 'var(--background)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(stats[status] / stats.total) * 100}%`,
                    height: '100%',
                    background: status === 'result' ? 'var(--success)' :
                               status === 'interview' ? 'var(--warning)' :
                               status === 'applied' ? 'var(--primary)' : 'var(--secondary)',
                    borderRadius: '12px',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <span style={{ width: '30px', fontSize: '14px', fontWeight: '600' }}>
                  {stats[status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 다가오는 일정 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">다가오는 일정</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => navigate(`${LINK_PREFIX}/calendar`)}
            >
              캘린더 보기
            </button>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <p>예정된 일정이 없습니다</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--background)',
                    borderRadius: 'var(--radius)',
                    borderLeft: `4px solid ${event.color || 'var(--primary)'}`
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{event.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(event.date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </div>
                  </div>
                  <span
                    className={`calendar-event ${event.type}`}
                    style={{ position: 'static', padding: '4px 8px' }}
                  >
                    {event.type === 'interview' ? '면접' :
                     event.type === 'deadline' ? '마감' : '지원'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 최근 지원 현황 */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 className="card-title">최근 지원 현황</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => navigate(`${LINK_PREFIX}/tracker`)}
            >
              전체보기
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentApplications.map(app => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--background)',
                  borderRadius: 'var(--radius)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    className="company-logo"
                    style={{ width: '40px', height: '40px', fontSize: '14px' }}
                  >
                    {app.companyName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{app.companyName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {app.position}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: app.status === 'result'
                      ? (app.result === 'passed' ? '#d1fae5' : '#fee2e2')
                      : 'var(--surface)',
                    color: app.status === 'result'
                      ? (app.result === 'passed' ? '#065f46' : '#991b1b')
                      : 'var(--text-primary)',
                    border: app.status !== 'result' ? '1px solid var(--border)' : 'none'
                  }}>
                    {app.status === 'result'
                      ? (app.result === 'passed' ? '합격' : '불합격')
                      : statusLabels[app.status]}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(app.updatedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 빠른 액션 버튼 */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
        justifyContent: 'center'
      }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`${LINK_PREFIX}/search`)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          채용공고 검색
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`${LINK_PREFIX}/tracker`)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          지원 현황 관리
        </button>
      </div>
    </div>
  );
};

export default HomePage;
