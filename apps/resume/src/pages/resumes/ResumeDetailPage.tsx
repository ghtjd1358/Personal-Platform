import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, Logo } from '@sonhoseong/mfa-lib';
import { resumesApi } from '@/network';
import type { ResumeDetail } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import { iconMap } from '@/constants/iconMap';
import '@/styles/global.css';

const formatDate = (dateStr: string | null, isEnd = false, isCurrent = false) => {
  if (isCurrent && isEnd) return '현재';
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const ResumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isOwner = currentUser?.id === resume?.user_id;

  useEffect(() => {
    const loadResume = async () => {
      if (!id) {
        setError('이력서 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await resumesApi.getDetailById(id);

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
  }, [id, currentUser?.id]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '16px' }}>
        <div className="spinner-large" />
        <p style={{ color: 'var(--color-text-muted)' }}>이력서를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, marginBottom: 24, color: 'var(--color-text-muted)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 24, marginBottom: 16, color: 'var(--color-text)' }}>{error || '이력서를 찾을 수 없습니다.'}</h2>
        <Link to={`${LINK_PREFIX}/resumes`} className="btn btn-secondary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="public-resume-detail">
      {/* 간단한 네비게이션 바 */}
      <div className="public-resume-nav">
        <div className="public-resume-nav-inner">
          <Link to={`${LINK_PREFIX}/resumes`} className="back-link">
            ← 이력서 목록
          </Link>
          {isOwner && (
            <Link to={`${LINK_PREFIX}/mypage/${id}`} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
              ✏️ 내 이력서 관리
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section - 프로필 */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-mark">
              <Logo customSize={120} />
            </div>
            <h1 className="hero-title">
              안녕하세요,<br />
              {resume.title || '개발자'}<br />
              <span className="highlight">{resume.name || resume.user?.name || '익명'}</span>입니다.
            </h1>
            {resume.summary && (
              <p className="hero-desc" style={{ whiteSpace: 'pre-line' }}>
                {resume.summary}
              </p>
            )}
            <div className="contact-icons animate-visible" style={{ marginBottom: '32px' }}>
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

      {/* Experience & Projects Section */}
      <section className="section experience">
        <div className="container">
          {/* 경력 Timeline */}
          {resume.experiences && resume.experiences.length > 0 && (
            <>
              <div className="section-header animate-visible">
                <div className="section-label">경력</div>
                <h2 className="section-title">경력사항</h2>
              </div>
              <div className="timeline">
                {resume.experiences.map((exp) => (
                  <div key={exp.id} className="timeline-item animate-visible">
                    <div className={`timeline-date ${!exp.is_current ? 'past' : ''}`}>
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date, true, exp.is_current)}
                      <span className={`exp-type-badge ${exp.is_dev ? 'dev' : 'non-dev'}`}>
                        {exp.is_dev ? '개발' : '비개발'}
                      </span>
                    </div>
                    <div className="timeline-content">
                      <h3>{exp.company}</h3>
                      <p>{exp.position}</p>
                      {exp.tags && exp.tags.length > 0 && (
                        <div className="timeline-tech-icons">
                          {exp.tags.map((tag, index) => (
                            <div className="tech-icon" key={`${exp.id}-tag-${index}`} data-tooltip={tag}>
                              {iconMap[tag] || <span>💻</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {exp.tasks && exp.tasks.length > 0 && (
                        <>
                          <div
                            className={`toggle-tasks ${expandedItem === exp.id ? 'active' : ''}`}
                            onClick={() => setExpandedItem(expandedItem === exp.id ? null : exp.id)}
                          >
                            <span className="toggle-icon">›</span>
                            <span>주요 업무 내용</span>
                          </div>
                          {expandedItem === exp.id && (
                            <ul className="timeline-tasks">
                              {exp.tasks.map((task) => (
                                <li key={task.id}>{task.task}</li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 프로젝트 Timeline */}
          {resume.projects && resume.projects.length > 0 && (
            <>
              <div className="section-header animate-visible" style={{ marginTop: '64px' }}>
                <div className="section-label">프로젝트</div>
                <h2 className="section-title">프로젝트</h2>
              </div>
              <div className="timeline">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="timeline-item animate-visible">
                    <div className={`timeline-date ${!proj.is_current ? 'past' : ''}`}>
                      {formatDate(proj.start_date)} - {formatDate(proj.end_date, true, proj.is_current)}
                    </div>
                    <div className="timeline-content">
                      <h3>{proj.title}</h3>
                      <p>{proj.role}</p>
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="timeline-tech-icons">
                          {proj.tags.map((tag, index) => (
                            <div className="tech-icon" key={`${proj.id}-tag-${index}`} data-tooltip={tag}>
                              {iconMap[tag] || <span>💻</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {proj.tasks && proj.tasks.length > 0 && (
                        <>
                          <div
                            className={`toggle-tasks ${expandedItem === proj.id ? 'active' : ''}`}
                            onClick={() => setExpandedItem(expandedItem === proj.id ? null : proj.id)}
                          >
                            <span className="toggle-icon">›</span>
                            <span>주요 작업 내용</span>
                          </div>
                          {expandedItem === proj.id && (
                            <ul className="timeline-tasks">
                              {proj.tasks.map((task) => (
                                <li key={task.id}>{task.task}</li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 데이터 없음 */}
          {(!resume.experiences || resume.experiences.length === 0) && (!resume.projects || resume.projects.length === 0) && (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <p>등록된 경력/프로젝트가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResumeDetailPage;
