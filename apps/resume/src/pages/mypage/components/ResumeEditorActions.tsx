import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ResumeEditorActionsProps {
  isSaving: boolean;
  isEditMode: boolean;
  isCreateMode: boolean;
  disabled: boolean;
}

const ResumeEditorActions: React.FC<ResumeEditorActionsProps> = ({
  isSaving,
  isEditMode,
  isCreateMode,
  disabled,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="resume-editor-actions">
        <button
          type="button"
          className="resume-editor-btn resume-editor-btn--secondary"
          onClick={() => navigate(-1)}
          disabled={isSaving}
        >
          취소
        </button>
        <button
          type="submit"
          className="resume-editor-btn resume-editor-btn--primary"
          disabled={disabled}
        >
          {isSaving ? (
            <>
              <span className="spinner-small" />
              저장 중...
            </>
          ) : isEditMode ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              수정 완료
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              이력서 만들기
            </>
          )}
        </button>
      </div>

      {isCreateMode && (
        <div className="resume-editor-tip">
          <p className="resume-editor-tip__text">
            💡 <strong>팁:</strong> 경력과 프로젝트를 위에서 바로 추가할 수 있습니다.
            기술 스택도 선택하여 더 풍부한 이력서를 만들어보세요!
          </p>
        </div>
      )}
    </>
  );
};

export default ResumeEditorActions;
