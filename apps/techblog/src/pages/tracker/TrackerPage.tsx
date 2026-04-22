import React, { useState } from 'react';
import { JobApplication, ApplicationStatus, ApplicationResult } from '@/types/job';
import { useApplications } from '@/hooks';
import ApplicationDetailModal from '@/components/ApplicationDetailModal';
import CreateApplicationModal from '@/components/CreateApplicationModal';
import '../home/HomePage.editorial.css';
import './TrackerPage.editorial.css';

const TrackerPage: React.FC = () => {
  const {
    isLoading,
    create,
    updateStatus,
    updateResult,
    getByStatus,
  } = useApplications();

  const [draggedCard, setDraggedCard] = useState<JobApplication | null>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const columns: { id: ApplicationStatus; title: string }[] = [
    { id: 'interested', title: '관심' },
    { id: 'applied', title: '지원완료' },
    { id: 'interview', title: '면접' },
    { id: 'result', title: '결과' }
  ];

  const handleDragStart = (e: React.DragEvent, app: JobApplication) => {
    setDraggedCard(app);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    if (!draggedCard) return;

    // Update status via hook (optimistic update)
    await updateStatus(draggedCard.id, targetStatus);
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await updateStatus(appId, newStatus);
    // Update selected app if it's the one being changed
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleResultChange = async (appId: string, newResult: ApplicationResult) => {
    await updateResult(appId, newResult);
    // Update selected app if it's the one being changed
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, result: newResult } : null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="job-tracker-app">
        <div className="page-header">
          <h1>지원 현황</h1>
          <p>드래그앤드롭으로 지원 상태를 관리하세요</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-title">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-tracker-app">
      <div className="page-header">
        <h1>지원 현황</h1>
        <p>드래그앤드롭으로 지원 상태를 관리하세요</p>
      </div>

      <div className="kanban-board">
        {columns.map(column => {
          const columnApps = getByStatus(column.id);
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

                      {app.salaryRange && (
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--primary)',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>💰</span>
                          {app.salaryRange}
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
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
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
          onResultChange={(result) => handleResultChange(selectedApp.id, result)}
        />
      )}

      {/* 새 지원 추가 모달 */}
      {showCreateModal && (
        <CreateApplicationModal
          onClose={() => setShowCreateModal(false)}
          onCreate={create}
        />
      )}
    </div>
  );
};

export default TrackerPage;
