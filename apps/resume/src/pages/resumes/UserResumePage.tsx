import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, LoadingSpinner, ErrorState, Card, EmptyState, Badge } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import ResumeNavHeader from '@/components/resume/ResumeNavHeader';
import { useUserResume } from '@/hooks/useUserResume';
import { formatPeriod } from '@/utils/date';

const UserResumePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const { resume, isLoading, error, isOwner, isStandalone, defaultAvatar } = useUserResume(userId, currentUser?.id);

  if (isLoading) return <LoadingSpinner fullPage message="이력서를 불러오는 중" />;
  if (error || !resume) return (
    <ErrorState
      message={error || '이력서를 찾을 수 없습니다.'}
      onBack={() => navigate(LINK_PREFIX || '/')}
      backLabel="목록으로 돌아가기"
    />
  );

  return (
    <>
      {isStandalone && <ResumeNavHeader />}
      <div className="resume-detail-page">
        <div className="resume-detail-nav">
          <Link to={LINK_PREFIX || '/'} className="btn-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            목록으로
          </Link>
          {isOwner && (
            <Link to={`${LINK_PREFIX}/mypage`} className="btn-edit">수정하기</Link>
          )}
        </div>

        <section className="resume-detail-profile">
          <div className="profile-image-wrapper">
            <img
              src={resume.profile_image || resume.user?.avatar_url || defaultAvatar}
              alt={resume.user?.name || '프로필'}
              className={resume.profile_image ? 'profile-image' : 'profile-avatar'}
            />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{resume.user?.name || '익명'}</h1>
            <p className="profile-title">{resume.title}</p>
            {resume.summary && <p className="profile-summary">{resume.summary}</p>}
            <div className="profile-links">
              {resume.contact_email && (
                <a href={`mailto:${resume.contact_email}`} className="profile-link" title="이메일">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              )}
              {resume.github && (
                <a href={resume.github} target="_blank" rel="noopener noreferrer" className="profile-link" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {resume.blog && (
                <a href={resume.blog} target="_blank" rel="noopener noreferrer" className="profile-link" title="블로그">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </section>

        {resume.summary && (
          <section id="core-summary" className="resume-detail-section resume-section">
            <h2 className="section-title">핵심 역량</h2>
            <p className="resume-summary-text">{resume.summary}</p>
          </section>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <section id="tech-stack" className="resume-detail-section resume-section">
            <h2 className="section-title">기술 스택</h2>
            <div className="skill-list">
              {resume.skills.map((category) => (
                <div key={category.id} className="skill-category">
                  <h3 className="skill-category-name">{category.name}</h3>
                  <div className="skill-tags">
                    {category.skills.map((skill) => (
                      <Badge key={skill.id} variant="default" className="skill-tag">{skill.name}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.experiences && resume.experiences.length > 0 && (
          <section id="experience" className="resume-detail-section resume-section">
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
                      {exp.tags.map((tag, i) => <Badge key={i} variant="default" className="tag">{tag}</Badge>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <section id="projects" className="resume-detail-section resume-section">
            <h2 className="section-title">프로젝트</h2>
            <div className="project-list">
              {resume.projects.map((project) => (
                <Card key={project.id} className="project-item">
                  {project.image_url && (
                    <Card.Image className="project-image" src={project.image_url} alt={project.title} />
                  )}
                  <Card.Body className="project-content">
                    <div className="project-header">
                      <Card.Title className="project-title">{project.title}</Card.Title>
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
                      <Card.Tags className="project-tags">
                        {project.tags.map((tag, i) => <Badge key={i} variant="default" className="tag">{tag}</Badge>)}
                      </Card.Tags>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default UserResumePage;
