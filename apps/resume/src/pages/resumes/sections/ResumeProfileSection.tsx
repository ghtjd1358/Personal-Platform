import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileLinks {
  contact_email?: string | null;
  github?: string | null;
  blog?: string | null;
}

interface ResumeUser {
  name?: string | null;
  avatar_url?: string | null;
}

interface Props {
  profileImage?: string | null;
  user?: ResumeUser | null;
  title?: string | null;
  links: ProfileLinks;
  defaultAvatar: string;
  backPath: string;
  isOwner: boolean;
  editPath: string;
}

const ResumeProfileSection: React.FC<Props> = ({
  profileImage, user, title, links, defaultAvatar, backPath, isOwner, editPath,
}) => (
  <>
    <div className="resume-detail-nav">
      <Link to={backPath} className="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        목록으로
      </Link>
      {isOwner && <Link to={editPath} className="btn-edit">수정하기</Link>}
    </div>

    <section className="resume-detail-profile">
      <div className="profile-image-wrapper">
        <img
          src={profileImage || user?.avatar_url || defaultAvatar}
          alt={user?.name || '프로필'}
          className={profileImage ? 'profile-image' : 'profile-avatar'}
        />
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{user?.name || '익명'}</h1>
        <p className="profile-title">{title}</p>
        <div className="profile-links">
          {links.contact_email && (
            <a href={`mailto:${links.contact_email}`} className="profile-link" title="이메일">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          )}
          {links.github && (
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="profile-link" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {links.blog && (
            <a href={links.blog} target="_blank" rel="noopener noreferrer" className="profile-link" title="블로그">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  </>
);

export default ResumeProfileSection;
