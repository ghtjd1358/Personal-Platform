import React from 'react';
import { CommonButton } from '../button/CommonButton';

export interface EditorHeaderProps {
  isEditMode: boolean;
  isSaving: boolean;
  lastSavedAt?: Date | null;
  hasUnsavedChanges?: boolean;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  publishLabel?: string;
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
  lastSavedAt,
  hasUnsavedChanges,
  onBack,
  onSaveDraft,
  onPublish,
  publishLabel,
}) => {
  return (
    <header className="editor-header">
      <div className="editor-header-left">
        <CommonButton variant="ghost" size="sm" onClick={onBack} className="btn-back">
          ← 나가기
        </CommonButton>
        {!isEditMode && lastSavedAt && (
          <span className={`autosave-indicator ${hasUnsavedChanges ? 'unsaved' : ''}`}>
            {hasUnsavedChanges ? '저장되지 않은 변경사항' : formatLastSaved(lastSavedAt)}
          </span>
        )}
      </div>
      <div className="editor-header-right">
        <CommonButton variant="secondary" onClick={onSaveDraft} disabled={isSaving}>
          임시저장
        </CommonButton>
        <CommonButton variant="primary" onClick={onPublish} disabled={isSaving} loading={isSaving}>
          {publishLabel ?? (isEditMode ? '수정하기' : '발행하기')}
        </CommonButton>
      </div>
    </header>
  );
};

export { EditorHeader };
