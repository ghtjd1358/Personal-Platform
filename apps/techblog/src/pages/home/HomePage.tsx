import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isHostApp } from '@sonhoseong/mfa-lib';
import { useDashboardStats } from '@/hooks';
import { ApplicationStatus } from '@/types/job';
import { HeroSection } from '@/components';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const LINK_PREFIX = isHostApp() ? '/container/jobtracker' : '/jobtracker';

  // Use hook for dashboard data
  const {
    stats,
    monthlyTrend,
    upcomingEvents,
    recentApplications,
    isLoading,
  } = useDashboardStats();

  const statusLabels: Record<ApplicationStatus, string> = {
    interested: '관심',
    applied: '지원완료',
    interview: '면접',
    result: '결과'
  };

  if (isLoading) {
    return (
      <div className="job-tracker-app">
        <div className="page-header">
          <h1>취업 관리 대시보드</h1>
          <p>지원 현황을 한눈에 확인하세요</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-title">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
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
          <div className="stat-value">{stats.passRate}%</div>
          <div className="stat-label">합격률</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.passed}</div>
          <div className="stat-label">합격</div>
        </div>
      </div>

      {/* 급여 통계 */}
      {stats.salary.applicationsWithSalary > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">💰 급여 현황</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {stats.salary.applicationsWithSalary}개 지원에서 급여 정보 확인
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            padding: '8px 0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                평균 연봉 범위
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary)' }}>
                {stats.salary.avgMinSalary.toLocaleString()}~{stats.salary.avgMaxSalary.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>만원</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                최저 제시 연봉
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>
                {stats.salary.minSalary.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>만원</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                최고 제시 연봉
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--success)' }}>
                {stats.salary.maxSalary.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>만원</div>
            </div>
          </div>
        </div>
      )}

      {/* 월별 지원 트렌드 차트 */}
      {monthlyTrend.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">월별 지원 현황</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px', padding: '16px 0' }}>
            {monthlyTrend.map((data, index) => {
              const maxApplied = Math.max(...monthlyTrend.map(d => d.applied), 1);
              const barHeight = (data.applied / maxApplied) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', width: '100%', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {data.applied > 0 && (
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary)', marginBottom: '4px' }}>
                        {data.applied}
                      </span>
                    )}
                    <div
                      style={{
                        width: '70%',
                        height: `${barHeight}%`,
                        minHeight: data.applied > 0 ? '8px' : '2px',
                        background: data.applied > 0 ? 'linear-gradient(180deg, var(--primary), var(--primary-light, #60a5fa))' : 'var(--border)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease',
                        position: 'relative',
                      }}
                    >
                      {data.passed > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: `${(data.passed / data.applied) * 100}%`,
                            background: 'var(--success)',
                            borderRadius: '0 0 4px 4px',
                          }}
                          title={`합격: ${data.passed}`}
                        />
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{data.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }} />
              지원
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '2px' }} />
              합격
            </div>
          </div>
        </div>
      )}

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
                    width: stats.total > 0 ? `${(stats[status] / stats.total) * 100}%` : '0%',
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
          {recentApplications.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <p>지원 내역이 없습니다</p>
            </div>
          ) : (
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
                        {app.salaryRange && (
                          <span style={{ marginLeft: '8px', color: 'var(--primary)', fontSize: '12px' }}>
                            💰 {app.salaryRange}
                          </span>
                        )}
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
          )}
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
    </>
  );
};

export default HomePage;
