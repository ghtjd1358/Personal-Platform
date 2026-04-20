import React, { useState } from 'react';
import { JobApplication, JobNote, ApplicationStatus, ApplicationResult, ApplicationSource, NoteType } from '@/types/job';
import { useNotes } from '@/hooks';
import NoteEditor from './NoteEditor';

interface ApplicationDetailModalProps {
  application: JobApplication;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onResultChange?: (result: ApplicationResult) => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onStatusChange,
  onResultChange,
}) => {
  const {
    notes,
    isLoading: notesLoading,
    create: createNote,
    remove: removeNote,
  } = useNotes(application.id);

  const [activeTab, setActiveTab] = useState<'info' | 'notes'>('info');

  const statusOptions: { value: ApplicationStatus; label: string; color: string }[] = [
    { value: 'interested', label: '관심', color: 'var(--secondary)' },
    { value: 'applied', label: '지원완료', color: 'var(--primary)' },
    { value: 'interview', label: '면접', color: 'var(--warning)' },
    { value: 'result', label: '결과', color: 'var(--success)' }
  ];

  const sourceLabels: Record<ApplicationSource, string> = {
    wanted: '원티드',
    saramin: '사람인',
    jobkorea: '잡코리아',
    linkedin: '링크드인',
    remember: '리멤버',
    direct: '회사 직접',
    referral: '추천/소개',
    other: '기타',
  };

  const handleAddNote = async (noteData: Omit<JobNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    await createNote(noteData.content, noteData.noteType);
  };

  const handleDeleteNote = async (noteId: string) => {
    await removeNote(noteId);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px' }}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">{application.companyName}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {application.position}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 탭 */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px'
        }}>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'info' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'info' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'info' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            정보
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'notes' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'notes' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'notes' ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            노트
            {notes.length > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {notes.length}
              </span>
            )}
          </button>
        </div>

        <div className="modal-body" style={{ minHeight: '400px' }}>
          {activeTab === 'info' ? (
            <>
              {/* 상태 변경 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  지원 상태
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => onStatusChange(status.value)}
                      className={`btn btn-sm ${application.status === status.value ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        borderColor: application.status === status.value ? status.color : undefined,
                        background: application.status === status.value ? status.color : undefined
                      }}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 기본 정보 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 'var(--radius)',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    근무지
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {application.location || '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    연봉
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {application.salaryRange || '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    지원일
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {formatDate(application.appliedAt)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    면접일
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {formatDate(application.interviewAt)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    지원 경로
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {application.source ? sourceLabels[application.source] : '-'}
                  </div>
                </div>
              </div>

              {/* 공고 링크 */}
              {application.jobUrl && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                    채용공고 링크
                  </h4>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    공고 바로가기
                  </a>
                </div>
              )}

              {/* 결과 (result 상태일 때) */}
              {application.status === 'result' && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                    결과
                  </h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className={`btn ${application.result === 'passed' ? '' : 'btn-secondary'}`}
                      style={{
                        background: application.result === 'passed' ? 'var(--success)' : undefined,
                        color: application.result === 'passed' ? 'white' : undefined
                      }}
                      onClick={() => onResultChange?.('passed')}
                    >
                      합격
                    </button>
                    <button
                      className={`btn ${application.result === 'failed' ? '' : 'btn-secondary'}`}
                      style={{
                        background: application.result === 'failed' ? 'var(--danger)' : undefined,
                        color: application.result === 'failed' ? 'white' : undefined
                      }}
                      onClick={() => onResultChange?.('failed')}
                    >
                      불합격
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : notesLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              노트 로딩 중...
            </div>
          ) : (
            <NoteEditor
              applicationId={application.id}
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
