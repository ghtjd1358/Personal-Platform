import React, { useState } from 'react';
import { Button, LoadingSpinner } from '@sonhoseong/mfa-lib';
import { JobApplication, JobNote, ApplicationStatus, ApplicationResult, ApplicationSource, NoteType } from '@/types/job';
import { useNotes } from '@/hooks';
import NoteEditor from '../editor/NoteEditor';

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
        className="modal-content modal-container--app"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">{application.companyName}</div>
            <div className="modal-subtitle">
              {application.position}
            </div>
          </div>
          <Button.Icon aria-label="닫기" className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button.Icon>
        </div>

        {/* 탭 */}
        <div className="modal-tab-row">
          <Button
            variant="text"
            onClick={() => setActiveTab('info')}
            className="modal-tab-button"
            style={{
              borderBottom: activeTab === 'info' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'info' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'info' ? '600' : '400',
            }}
          >
            정보
          </Button>
          <Button
            variant="text"
            onClick={() => setActiveTab('notes')}
            className="modal-tab-button"
            style={{
              borderBottom: activeTab === 'notes' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'notes' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'notes' ? '600' : '400',
            }}
            rightIcon={notes.length > 0 ? (
              <span className="modal-tab-badge">
                {notes.length}
              </span>
            ) : undefined}
          >
            노트
          </Button>
        </div>

        <div className="modal-body modal-body--min-400">
          {activeTab === 'info' ? (
            <>
              {/* 상태 변경 */}
              <div className="section-mb-24">
                <h4 className="section-heading">
                  지원 상태
                </h4>
                <div className="status-button-row">
                  {statusOptions.map(status => (
                    <Button
                      key={status.value}
                      size="sm"
                      variant={application.status === status.value ? 'primary' : 'secondary'}
                      onClick={() => onStatusChange(status.value)}
                      style={{
                        borderColor: application.status === status.value ? status.color : undefined,
                        background: application.status === status.value ? status.color : undefined
                      }}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="info-grid-panel">
                <div>
                  <div className="info-grid-label">
                    근무지
                  </div>
                  <div className="info-grid-value">
                    {application.location || '-'}
                  </div>
                </div>
                <div>
                  <div className="info-grid-label">
                    연봉
                  </div>
                  <div className="info-grid-value">
                    {application.salaryRange || '-'}
                  </div>
                </div>
                <div>
                  <div className="info-grid-label">
                    지원일
                  </div>
                  <div className="info-grid-value">
                    {formatDate(application.appliedAt)}
                  </div>
                </div>
                <div>
                  <div className="info-grid-label">
                    면접일
                  </div>
                  <div className="info-grid-value">
                    {formatDate(application.interviewAt)}
                  </div>
                </div>
                <div>
                  <div className="info-grid-label">
                    지원 경로
                  </div>
                  <div className="info-grid-value">
                    {application.source ? sourceLabels[application.source] : '-'}
                  </div>
                </div>
              </div>

              {/* 공고 링크 */}
              {application.jobUrl && (
                <div>
                  <h4 className="section-heading">
                    채용공고 링크
                  </h4>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
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
                <div className="section-mt-24">
                  <h4 className="section-heading">
                    결과
                  </h4>
                  <Button.Group gap="sm">
                    <Button
                      variant={application.result === 'passed' ? 'primary' : 'secondary'}
                      style={{
                        background: application.result === 'passed' ? 'var(--success)' : undefined,
                        color: application.result === 'passed' ? 'white' : undefined
                      }}
                      onClick={() => onResultChange?.('passed')}
                    >
                      합격
                    </Button>
                    <Button
                      variant={application.result === 'failed' ? 'danger' : 'secondary'}
                      style={{
                        background: application.result === 'failed' ? 'var(--danger)' : undefined,
                        color: application.result === 'failed' ? 'white' : undefined
                      }}
                      onClick={() => onResultChange?.('failed')}
                    >
                      불합격
                    </Button>
                  </Button.Group>
                </div>
              )}
            </>
          ) : notesLoading ? (
            <LoadingSpinner message="노트 로딩 중..." />
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
