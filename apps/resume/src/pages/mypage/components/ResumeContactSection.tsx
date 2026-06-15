import React from 'react';

interface ResumeContactSectionProps {
  contactEmail: string;
  github: string;
  blog: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
}

const ResumeContactSection: React.FC<ResumeContactSectionProps> = ({
  contactEmail,
  github,
  blog,
  onChange,
  disabled,
}) => {
  return (
    <div className="resume-editor-section">
      <div className="resume-editor-section-header">
        <div className="resume-editor-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div>
          <h3 className="resume-editor-section-title">연락처 & 링크</h3>
          <p className="resume-editor-section-desc">연락 받을 이메일과 소셜 링크</p>
        </div>
      </div>

      <div className="resume-editor-field">
        <label className="resume-editor-label">연락처 이메일</label>
        <input
          type="email"
          name="contact_email"
          className="resume-editor-input"
          value={contactEmail}
          onChange={onChange}
          placeholder="your-email@example.com"
          disabled={disabled}
        />
        <p className="resume-editor-hint">
          채용 담당자나 협업 제안 연락을 받을 이메일
        </p>
      </div>

      <div className="resume-editor-row">
        <div className="resume-editor-field">
          <label className="resume-editor-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="label-icon">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </label>
          <input
            type="url"
            name="github"
            className="resume-editor-input"
            value={github}
            onChange={onChange}
            placeholder="https://github.com/username"
            disabled={disabled}
          />
        </div>

        <div className="resume-editor-field">
          <label className="resume-editor-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="label-icon">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            블로그 / 포트폴리오
          </label>
          <input
            type="url"
            name="blog"
            className="resume-editor-input"
            value={blog}
            onChange={onChange}
            placeholder="https://blog.example.com"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeContactSection;
