import React, { useState } from 'react';
import { Logo } from '@sonhoseong/mfa-lib';
import { ResumeProfileDetail } from "../../../data";
import { downloadResume } from '../../../network/apis/resume';

interface HeroSectionProps {
  userName?: string;
  resumeProfile: ResumeProfileDetail;
}

export const HeroSection: React.FC<HeroSectionProps> = ({userName, resumeProfile}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadResume({ fileName: 'resume.pdf' });
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          {userName && (
            <div style={{ background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '8px', marginBottom: '16px' }}>
              {userName}님, 환영합니다!
            </div>
          )}
          <div className="hero-mark">
            <Logo customSize={120} />
          </div>
          <h1 className="hero-title">
            안녕하세요,<br />
            프론트엔드 개발자<br />
            <span className="highlight">손호성</span>입니다.
          </h1>
          <p className="hero-desc" style={{ whiteSpace: 'pre-line' }}>
            {resumeProfile.summary}
          </p>
          <div className="contact-icons animate-on-scroll animate-visible" style={{ marginBottom: '32px' }}>
            <a href="mailto:hoseong1358@gmail.com" className="contact-icon-link" title="이메일 보내기">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" color="#EA4335" height="28" width="28" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(234, 67, 53)' }}>
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"></path>
              </svg>
            </a>
            <a href="https://github.com/ghtjd1358" className="contact-icon-link" target="_blank" rel="noreferrer" title="GitHub">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" color="#181717" height="28" width="28" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(24, 23, 23)' }}>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
            </a>
            <a href="https://velog.io/@ghtjd1358/series" className="contact-icon-link" target="_blank" rel="noreferrer" title="블로그">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" color="#20C997" height="28" width="28" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(32, 201, 151)' }}>
                <path d="M3 0C1.338 0 0 1.338 0 3v18c0 1.662 1.338 3 3 3h18c1.662 0 3-1.338 3-3V3c0-1.662-1.338-3-3-3H3Zm6.883 6.25c.63 0 1.005.3 1.125.9l1.463 8.303c.465-.615.846-1.133 1.146-1.553.465-.66.893-1.418 1.283-2.273.405-.855.608-1.62.608-2.295 0-.405-.113-.727-.338-.967-.21-.255-.608-.577-1.193-.967.6-.765 1.35-1.148 2.25-1.148.48 0 .878.143 1.193.428.33.285.494.704.494 1.26 0 .93-.39 2.093-1.17 3.488-.765 1.38-2.241 3.457-4.431 6.232l-2.227.156-1.711-9.628h-2.25V7.24c.6-.195 1.305-.406 2.115-.63.81-.24 1.358-.36 1.643-.36Z"></path>
              </svg>
            </a>
          </div>
          <div className="hero-buttons">
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              disabled={isDownloading}
            >
              {isDownloading ? '다운로드 중...' : '이력서 다운로드 ↓'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};