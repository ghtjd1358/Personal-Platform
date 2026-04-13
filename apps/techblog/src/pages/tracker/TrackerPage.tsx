import React, { useState } from 'react';
import { mockApplications } from '@/data/mockJobs';
import { JobApplication, ApplicationStatus } from '@/types/job';
import ApplicationDetailModal from '@/components/ApplicationDetailModal';

const TrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [draggedCard, setDraggedCard] = useState<JobApplication | null>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const columns: { id: ApplicationStatus; title: string }[] = [
    { id: 'interested', title: '관심' },
    { id: 'applied', title: '지원완료' },
    { id: 'interview', title: '면접' },
    { id: 'result', title: '결과' }
  ];

  const getColumnApplications = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status);
  };

  const handleDragStart = (e: React.DragEvent, app: JobApplication) => {
    setDraggedCard(app);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    if (!draggedCard) return;

    // 상태 업데이트
    setApplications(prev => prev.map(app =>
      app.id === draggedCard.id
        ? { ...app, status: targetStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : app
    ));
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app =>
      app.id === appId
        ? { ...app, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : app
    ));
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="job-tracker-app">
      <div className="page-header">
        <h1>지원 현황</h1>
        <p>드래그앤드롭으로 지원 상태를 관리하세요</p>
      </div>

      <div className="kanban-board">
        {columns.map(column => {
          const columnApps = getColumnApplications(column.id);
          return (
            <div
              key={column.id}
              className={`kanban-column ${column.id}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="kanban-column-header">
                <span className="kanban-column-title">
                  {column.title}
                  <span className="kanban-count">{columnApps.length}</span>
                </span>
              </div>

              <div className="kanban-cards">
                {columnApps.length === 0 ? (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    border: '2px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--surface)'
                  }}>
                    여기에 드롭하세요
                  </div>
                ) : (
                  columnApps.map(app => (
                    <div
                      key={app.id}
                      className={`kanban-card ${draggedCard?.id === app.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="kanban-card-company">{app.companyName}</div>
                      <div className="kanban-card-position">{app.position}</div>

                      {app.location && (
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {app.location}
                        </div>
                      )}

                      {app.appliedAt && (
                        <div className="kanban-card-date">
                          지원일: {formatDate(app.appliedAt)}
                        </div>
                      )}

                      {app.interviewAt && (
                        <div className="kanban-card-date" style={{ color: 'var(--warning)' }}>
                          면접일: {formatDate(app.interviewAt)}
                        </div>
                      )}

                      {app.status === 'result' && app.result !== 'pending' && (
                        <span className={`kanban-card-result ${app.result}`}>
                          {app.result === 'passed' ? '합격' : '불합격'}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 새 지원 추가 버튼 */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          새 지원 추가
        </button>
      </div>

      {/* 지원 상세 모달 */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusChange={(status) => handleStatusChange(selectedApp.id, status)}
        />
      )}
    </div>
  );
};

export default TrackerPage;
