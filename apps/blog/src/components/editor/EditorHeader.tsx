import React from 'react';
import { Button } from '@/components';

interface EditorHeaderProps {
  isEditMode: boolean;
  isSaving: boolean;
  showSettings: boolean;
  lastSavedAt?: Date | null;
  hasUnsavedChanges?: boolean;
  onBack: () => void;
  onToggleSettings: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const formatLastSaved = (date: Date | null) => {
  if (!date) return null;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return '방금 자동 저장됨';
  if (minutes < 60) return `${minutes}분 전 자동 저장됨`;
  return `${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 자동 저장됨`;
};

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isEditMode,
  isSaving,
  showSettings,
  lastSavedAt,
  hasUnsavedChanges,
  onBack,
  onToggleSettings,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <header className="editor-header">
      <div className="editor-header-left">
        <button type="button" className="btn-back" onClick={onBack}>
          ← 나가기
        </button>
        {!isEditMode && lastSavedAt && (
          <span className={`autosave-indicator ${hasUnsavedChanges ? 'unsaved' : ''}`}>
            {hasUnsavedChanges ? '저장되지 않은 변경사항' : formatLastSaved(lastSavedAt)}
          </span>
        )}
      </div>
      <div className="editor-header-right">
        <button
          type="button"
          className={`btn-settings ${showSettings ? 'active' : ''}`}
          onClick={onToggleSettings}
        >
          설정
        </button>
        <Button variant="secondary" onClick={onSaveDraft} disabled={isSaving}>
          임시저장
        </Button>
        <Button variant="primary" onClick={onPublish} disabled={isSaving}>
          {isSaving ? '저장 중...' : isEditMode ? '수정하기' : '발행하기'}
        </Button>
      </div>
    </header>
  );
};

export { EditorHeader };
