import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@sonhoseong/mfa-lib';
import type { ResumeWithUser } from '@/network/apis/resume/types/resume';
import { useResumeCard } from '@/hooks/useResumeCard';

interface ResumeCardProps {
  resume: ResumeWithUser;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const { avatarUrl, userName, profileImage, summary, userLink, hasEmail, hasGithub, hasBlog } = useResumeCard(resume);

  return (
    <Link to={userLink} className="resume-card">
      <Card.Image
        className="resume-card__image"
        src={profileImage}
        alt={`${userName}의 프로필`}
        loading="lazy"
        renderPlaceholder={() => (
          <div className="resume-card__image-placeholder">
            <img src={avatarUrl} alt={userName} className="resume-card__avatar" />
          </div>
        )}
      />
      <Card.Body className="resume-card__content">
        <Card.Meta className="resume-card__header">
          <img src={avatarUrl} alt={userName} className="resume-card__user-avatar" />
          <span className="resume-card__user-name">{userName}</span>
        </Card.Meta>
        <Card.Title className="resume-card__title">{resume.title}</Card.Title>
        {summary && <Card.Description className="resume-card__summary">{summary}</Card.Description>}
        <Card.Tags className="resume-card__tags">
          {hasEmail && (
            <span className="resume-card__tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </span>
          )}
          {hasGithub && (
            <span className="resume-card__tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </span>
          )}
          {hasBlog && (
            <span className="resume-card__tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </span>
          )}
        </Card.Tags>
      </Card.Body>
    </Link>
  );
};

export { ResumeCard };
