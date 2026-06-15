import React from 'react';

interface ResumeBasicSectionProps {
  resumeName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
}

const ResumeBasicSection: React.FC<ResumeBasicSectionProps> = ({ resumeName, onChange, disabled }) => {
  return (
    <div className="resume-editor-section">
      <div className="resume-editor-section-header">
        <div className="resume-editor-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div>
          <h3 className="resume-editor-section-title">이력서 정보</h3>
          <p className="resume-editor-section-desc">이력서를 구분하기 위한 기본 정보</p>
        </div>
      </div>

      <div className="resume-editor-field">
        <label className="resume-editor-label">
          이력서 이름 <span>*</span>
        </label>
        <input
          type="text"
          name="resume_name"
          className="resume-editor-input"
          value={resumeName}
          onChange={onChange}
          placeholder="예: 프론트엔드 이력서, 풀스택 개발자 이력서"
          disabled={disabled}
        />
        <p className="resume-editor-hint">
          여러 이력서를 구분하기 위한 이름입니다. (예: "프론트엔드 이력서", "스타트업용 이력서")
        </p>
      </div>
    </div>
  );
};

export default ResumeBasicSection;
