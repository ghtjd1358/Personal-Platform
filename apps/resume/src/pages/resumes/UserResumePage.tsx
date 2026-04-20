import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '@sonhoseong/mfa-lib';
import { resumesApi } from '@/network';
import type { ResumeDetail } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';

const UserResumePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUser?.id === userId;
  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${resume?.user?.name || 'U'}`;

  // UUID 형식 검증 함수
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    const loadResume = async () => {
      if (!userId) {
        setError('사용자 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      // UUID 형식 검증
      if (!isValidUUID(userId)) {
        setError('잘못된 사용자 ID 형식입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await resumesApi.getDetailByUserId(userId);

        if (!data) {
          setError('이력서를 찾을 수 없습니다.');
          return;
        }

        // 비공개 이력서는 본인만 볼 수 있음
        if (data.visibility === 'private' && data.user_id !== currentUser?.id) {
          setError('비공개 이력서입니다.');
          return;
        }

        setResume(data);
      } catch (err) {
        console.error('Failed to load resume:', err);
        setError('이력서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [userId, currentUser?.id]);

  const formatDate = (date: string | null) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${year}.${month}`;
  };

  const formatPeriod = (startDate: string | null, endDate: string | null, isCurrent: boolean) => {
    const start = formatDate(startDate);
    const end = isCurrent ? '현재' : formatDate(endDate);
    if (!start && !end) return '';
    return `${start} - ${end}`;
  };

  if (isLoading) {
    return (
      <div className="resume-detail-loading">
        <div className="spinner-large" />
        <p>이력서를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="resume-detail-error">
        <div className="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h2>{error || '이력서를 찾을 수 없습니다.'}</h2>
        <button onClick={() => navigate(LINK_PREFIX || '/')} className="btn btn-secondary">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="resume-detail-page">
      {/* Header with back button */}
      <div className="resume-detail-nav">
        <Link to={LINK_PREFIX || '/'} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          목록으로
        </Link>
        {isOwner && (
          <Link to={`${LINK_PREFIX}/mypage`} className="btn-edit">
            수정하기
          </Link>
        )}
      </div>

      {/* Profile Section */}
      <section className="resume-detail-profile">
        <div className="profile-image-wrapper">
          {resume.profile_image ? (
            <img src={resume.profile_image} alt={resume.user?.name || '프로필'} className="profile-image" />
          ) : (
            <img src={resume.user?.avatar_url || defaultAvatar} alt={resume.user?.name || '프로필'} className="profile-avatar" />
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{resume.user?.name || '익명'}</h1>
          <p className="profile-title">{resume.title}</p>
          {resume.summary && (
            <p className="profile-summary">{resume.summary}</p>
          )}
          <div className="profile-links">
            {resume.contact_email && (
              <a href={`mailto:${resume.contact_email}`} className="profile-link" title="이메일">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            )}
            {resume.github && (
              <a href={resume.github} target="_blank" rel="noopener noreferrer" className="profile-link" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {resume.blog && (
              <a href={resume.blog} target="_blank" rel="noopener noreferrer" className="profile-link" title="블로그">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      {resume.experiences && resume.experiences.length > 0 && (
        <section className="resume-detail-section">
          <h2 className="section-title">경력 & 교육</h2>
          <div className="experience-list">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className={`experience-item ${exp.is_dev ? 'dev' : 'non-dev'}`}>
                <div className="experience-header">
                  <div className="experience-info">
                    <h3 className="experience-company">{exp.company}</h3>
                    <p className="experience-position">{exp.position}</p>
                  </div>
                  <span className="experience-period">
                    {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                  </span>
                </div>
                {exp.tasks && exp.tasks.length > 0 && (
                  <ul className="experience-tasks">
                    {exp.tasks.map((task) => (
                      <li key={task.id}>{task.task.replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                    ))}
                  </ul>
                )}
                {exp.tags && exp.tags.length > 0 && (
                  <div className="experience-tags">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <section className="resume-detail-section">
          <h2 className="section-title">프로젝트</h2>
          <div className="project-list">
            {resume.projects.map((project) => (
              <div key={project.id} className="project-item">
                {project.image_url && (
                  <div className="project-image">
                    <img src={project.image_url} alt={project.title} loading="lazy" />
                  </div>
                )}
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-period">
                      {formatPeriod(project.start_date, project.end_date, project.is_current)}
                    </span>
                  </div>
                  <p className="project-role">{project.role}</p>
                  {project.tasks && project.tasks.length > 0 && (
                    <ul className="project-tasks">
                      {project.tasks.map((task) => (
                        <li key={task.id}>{task.task.replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                      ))}
                    </ul>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="project-tags">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserResumePage;
