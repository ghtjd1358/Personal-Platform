import React from 'react';

interface ResumeProfileSectionProps {
  profileImage: string;
  name: string;
  title: string;
  summary: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  isUploading: boolean;
}

const ResumeProfileSection: React.FC<ResumeProfileSectionProps> = ({
  profileImage,
  name,
  title,
  summary,
  fileInputRef,
  onChange,
  onImageUpload,
  isSaving,
  isUploading,
}) => {
  return (
    <div className="resume-editor-section">
      <div className="resume-editor-section-header">
        <div className="resume-editor-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <h3 className="resume-editor-section-title">프로필 정보</h3>
          <p className="resume-editor-section-desc">이력서에 표시될 개인 정보</p>
        </div>
      </div>

      {/* 프로필 이미지 업로드 */}
      <div className="resume-editor-field">
        <label className="resume-editor-label">프로필 이미지</label>
        <div className="resume-editor-upload">
          <div className="resume-editor-upload-preview">
            {profileImage ? (
              <img src={profileImage} alt="프로필" />
            ) : (
              <div className="resume-editor-upload-preview-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
          <div className="resume-editor-upload-controls">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onImageUpload}
              className="input-hidden"
              disabled={isSaving || isUploading}
            />
            <button
              type="button"
              className="resume-editor-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="spinner-small spinner-small--xs" />
                  업로드 중...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  이미지 업로드
                </>
              )}
            </button>
            <p className="resume-editor-hint resume-editor-hint--no-top">
              JPG, PNG, WebP, GIF (최대 5MB)
            </p>
            {profileImage && (
              <input
                type="text"
                name="profile_image"
                value={profileImage}
                onChange={onChange}
                placeholder="이미지 URL"
                disabled={isSaving}
                className="resume-editor-input resume-editor-input--url"
              />
            )}
          </div>
        </div>
      </div>

      <div className="resume-editor-row">
        <div className="resume-editor-field">
          <label className="resume-editor-label">
            이름 <span>*</span>
          </label>
          <input
            type="text"
            name="name"
            className="resume-editor-input"
            value={name}
            onChange={onChange}
            placeholder="홍길동"
            disabled={isSaving}
          />
        </div>

        <div className="resume-editor-field">
          <label className="resume-editor-label">
            직함 <span>*</span>
          </label>
          <input
            type="text"
            name="title"
            className="resume-editor-input"
            value={title}
            onChange={onChange}
            placeholder="프론트엔드 개발자"
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="resume-editor-field">
        <label className="resume-editor-label">자기소개</label>
        <textarea
          name="summary"
          className="resume-editor-textarea"
          value={summary}
          onChange={onChange}
          placeholder="안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.&#10;&#10;React와 TypeScript를 주로 사용하며, 깔끔한 코드와 효율적인 설계를 지향합니다.&#10;새로운 기술을 배우고 팀과 함께 성장하는 것을 즐깁니다."
          rows={5}
          disabled={isSaving}
        />
        <p className="resume-editor-hint">
          자신을 소개하는 글을 작성해주세요. (팁: 강점, 기술 스택, 목표 등을 간단히 언급)
        </p>
      </div>
    </div>
  );
};

export default ResumeProfileSection;
