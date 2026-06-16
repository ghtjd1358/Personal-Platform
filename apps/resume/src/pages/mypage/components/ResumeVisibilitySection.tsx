import React from 'react';
import type { ResumeVisibility } from '@/network/apis/resume/types/resume';

interface ResumeVisibilitySectionProps {
  visibility: ResumeVisibility;
  onChange: (value: ResumeVisibility) => void;
}

const ResumeVisibilitySection: React.FC<ResumeVisibilitySectionProps> = ({ visibility, onChange }) => {
  return (
    <div className="resume-editor-section">
      <div className="resume-editor-section-header">
        <div className="resume-editor-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div>
          <h3 className="resume-editor-section-title">공개 설정</h3>
          <p className="resume-editor-section-desc">이력서의 공개 범위를 설정하세요</p>
        </div>
      </div>

      <div className="resume-editor-visibility">
        <div
          className={`resume-editor-visibility-option ${visibility === 'private' ? 'active' : ''}`}
          onClick={() => onChange('private')}
        >
          <div className="resume-editor-visibility-icon" style={{ background: visibility === 'private' ? undefined : 'var(--color-bg)' }}>
            🔒
          </div>
          <div className="resume-editor-visibility-text">
            <h4>비공개</h4>
            <p>나만 볼 수 있습니다</p>
          </div>
        </div>

        <div
          className={`resume-editor-visibility-option ${visibility === 'public' ? 'active' : ''}`}
          onClick={() => onChange('public')}
        >
          <div className="resume-editor-visibility-icon" style={{ background: visibility === 'public' ? undefined : 'var(--color-bg)' }}>
            🌐
          </div>
          <div className="resume-editor-visibility-text">
            <h4>공개</h4>
            <p>"이력서 둘러보기"에 표시됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeVisibilitySection;
