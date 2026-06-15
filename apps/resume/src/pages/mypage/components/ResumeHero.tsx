import React from 'react';
import { Logo } from '@sonhoseong/mfa-lib';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';

interface ResumeHeroProps {
  resume: ResumeProfile;
}

const ResumeHero: React.FC<ResumeHeroProps> = ({ resume }) => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-mark">
            <Logo customSize={120} />
          </div>
          <h1 className="hero-title">
            안녕하세요,<br />
            {resume.title || '개발자'}<br />
            <span className="highlight">{resume.name}</span>입니다.
          </h1>
          {resume.summary && (
            <p className="hero-desc">{resume.summary}</p>
          )}
          <div className="contact-icons animate-visible">
            {resume.contact_email && (
              <a href={`mailto:${resume.contact_email}`} className="contact-icon-link" title="이메일">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#EA4335">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </a>
            )}
            {resume.github && (
              <a href={resume.github} className="contact-icon-link" target="_blank" rel="noreferrer" title="GitHub">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#181717">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {resume.blog && (
              <a href={resume.blog} className="contact-icon-link" target="_blank" rel="noreferrer" title="블로그">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#20C997">
                  <path d="M3 0C1.338 0 0 1.338 0 3v18c0 1.662 1.338 3 3 3h18c1.662 0 3-1.338 3-3V3c0-1.662-1.338-3-3-3H3Zm6.883 6.25c.63 0 1.005.3 1.125.9l1.463 8.303c.465-.615.846-1.133 1.146-1.553.465-.66.893-1.418 1.283-2.273.405-.855.608-1.62.608-2.295 0-.405-.113-.727-.338-.967-.21-.255-.608-.577-1.193-.967.6-.765 1.35-1.148 2.25-1.148.48 0 .878.143 1.193.428.33.285.494.704.494 1.26 0 .93-.39 2.093-1.17 3.488-.765 1.38-2.241 3.457-4.431 6.232l-2.227.156-1.711-9.628h-2.25V7.24c.6-.195 1.305-.406 2.115-.63.81-.24 1.358-.36 1.643-.36Z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeHero;
