import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, useToast, useAsyncConfirm, selectAccessToken, Logo } from '@sonhoseong/mfa-lib';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile, ExperienceItem, ProjectItem } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import { iconMap } from '@/constants/iconMap';

// 타입 정의 (HomePage 컴포넌트와 호환)
interface ExperienceDetail {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  tasks: { id: string; task: string }[];
  tags: string[];
}

interface ProjectDetail {
  id: string;
  title: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  tasks: { id: string; task: string }[];
  tags: string[];
  image?: string;
}

const formatDate = (dateStr: string | null, isEnd = false, isCurrent = false) => {
  if (isCurrent && isEnd) return '현재';
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const MyResumeDetailPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const confirmDialog = useAsyncConfirm();
  const accessToken = useSelector(selectAccessToken);
  const user = getCurrentUser();

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [experiences, setExperiences] = useState<ExperienceDetail[]>([]);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (!accessToken) {
      navigate(`${LINK_PREFIX}/login`);
      return;
    }

    if (!resumeId) {
      navigate(`${LINK_PREFIX}/mypage`);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);

        const resumeData = await resumesApi.getById(resumeId);

        if (resumeData.user_id !== user?.id) {
          toast.error('접근 권한이 없습니다.');
          navigate(`${LINK_PREFIX}/mypage`);
          return;
        }

        setResume(resumeData);

        // 경력/프로젝트 조회
        const { data: expData } = await experiencesApi.getByResumeId(resumeId);
        setExperiences((expData || []) as ExperienceDetail[]);

        const { data: projData } = await portfoliosApi.getByResumeId(resumeId);
        setProjects(
          (projData || []).map((p: ProjectItem) => ({
            ...p,
            image: p.image_url || undefined,
          })) as ProjectDetail[]
        );
      } catch (err) {
        console.error('Failed to load resume detail:', err);
        toast.error('이력서를 불러오는 중 오류가 발생했습니다.');
        navigate(`${LINK_PREFIX}/mypage`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken, resumeId, user?.id, navigate, toast]);

  // 공개/비공개 토글
  const handleToggleVisibility = useCallback(async () => {
    if (!resume || !user?.id) return;

    try {
      setIsSaving(true);
      const newVisibility = resume.visibility === 'public' ? 'private' : 'public';
      await resumesApi.update(resume.id, { visibility: newVisibility }, user.id);
      setResume({ ...resume, visibility: newVisibility });
      toast.success(newVisibility === 'public' ? '이력서가 공개되었습니다.' : '이력서가 비공개로 설정되었습니다.');
    } catch (err) {
      toast.error('설정 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [resume, user?.id, toast]);

  // 대표 이력서 설정
  const handleSetPrimary = useCallback(async () => {
    if (!resume || !user?.id || resume.is_primary) return;

    try {
      setIsSaving(true);
      await resumesApi.setPrimaryResume(user.id, resume.id);
      setResume({ ...resume, is_primary: true });
      toast.success('대표 이력서로 설정되었습니다.');
    } catch (err) {
      toast.error('대표 이력서 설정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [resume, user?.id, toast]);

  // 링크 복사
  const handleCopyLink = useCallback(() => {
    if (!resumeId) return;
    const url = `${window.location.origin}${LINK_PREFIX}/resumes/${resumeId}`;
    navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다!');
  }, [resumeId, toast]);

  // 이력서 삭제
  const handleDelete = useCallback(async () => {
    if (!resume) return;

    const ok = await confirmDialog({
      title: '이력서 삭제',
      message: `"${resume.resume_name || '이력서'}"를 삭제하시겠습니까?\n\n연결된 경력과 프로젝트도 함께 삭제됩니다.`,
      confirmText: '삭제',
      cancelText: '취소',
    });
    if (!ok) return;

    try {
      setIsSaving(true);
      await resumesApi.delete(resume.id);
      toast.success('이력서가 삭제되었습니다.');
      navigate(`${LINK_PREFIX}/mypage`);
    } catch (err) {
      toast.error('이력서 삭제에 실패했습니다.');
      setIsSaving(false);
    }
  }, [resume, navigate, toast]);

  if (!accessToken) return null;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner-large" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p>이력서를 찾을 수 없습니다.</p>
        <Link to={`${LINK_PREFIX}/mypage`} className="btn btn-primary" style={{ marginTop: '16px' }}>
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="my-resume-detail-page">
      {/* 관리 헤더 */}
      <div className="management-header">
        <div className="management-header-inner">
          <Link to={`${LINK_PREFIX}/mypage`} className="back-link">
            ← 내 이력서 목록
          </Link>
          <div className="management-title">
            <h2>{resume.resume_name || '이력서'}</h2>
            {resume.is_primary && <span className="badge badge-primary">대표</span>}
            <span className={`badge ${resume.visibility === 'public' ? 'badge-success' : 'badge-secondary'}`}>
              {resume.visibility === 'public' ? '공개' : '비공개'}
            </span>
          </div>
          <div className="management-actions">
            <button
              onClick={handleToggleVisibility}
              disabled={isSaving}
              className={`btn ${resume.visibility === 'public' ? 'btn-outline' : 'btn-primary'}`}
            >
              {resume.visibility === 'public' ? '🔒 비공개로 전환' : '🌐 공개하기'}
            </button>
            {resume.visibility === 'public' && (
              <button onClick={handleCopyLink} className="btn btn-outline">
                📋 링크 복사
              </button>
            )}
            {!resume.is_primary && (
              <button onClick={handleSetPrimary} disabled={isSaving} className="btn btn-outline">
                ⭐ 대표로 설정
              </button>
            )}
            <Link to={`${LINK_PREFIX}/mypage/${resumeId}/edit`} className="btn btn-primary">
              ✏️ 수정
            </Link>
            <button onClick={handleDelete} disabled={isSaving} className="btn btn-danger">
              🗑️ 삭제
            </button>
          </div>
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
              <span className="highlight">{resume.name}</span>입니다.
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
          <div className="section-header animate-visible">
            <div className="section-label">경력</div>
            <h2 className="section-title">경력 & 프로젝트</h2>
            <Link
              to={`${LINK_PREFIX}/admin/experience?resumeId=${resumeId}`}
              className="section-edit-link"
            >
              경력 관리 →
            </Link>
          </div>

          {/* 경력 Timeline */}
          {experiences.length > 0 && (
            <>
              <div className="timeline-category animate-visible">
                <div className="timeline-category-line left"></div>
                <span className="timeline-category-text">경력</span>
                <div className="timeline-category-line right"></div>
              </div>
              <div className="timeline">
                {experiences.map((exp) => (
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
          {projects.length > 0 && (
            <>
              <div className="timeline-category animate-visible" style={{ marginTop: '48px' }}>
                <div className="timeline-category-line left"></div>
                <span className="timeline-category-text">프로젝트</span>
                <div className="timeline-category-line right"></div>
                <Link
                  to={`${LINK_PREFIX}/admin/projects?resumeId=${resumeId}`}
                  className="section-edit-link"
                  style={{ marginLeft: '16px' }}
                >
                  관리 →
                </Link>
              </div>
              <div className="timeline">
                {projects.map((proj) => (
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
          {experiences.length === 0 && projects.length === 0 && (
            <div className="empty-state">
              <p>등록된 경력/프로젝트가 없습니다.</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Link to={`${LINK_PREFIX}/admin/experience/new?resumeId=${resumeId}`} className="btn btn-primary">
                  경력 추가
                </Link>
                <Link to={`${LINK_PREFIX}/admin/projects/new?resumeId=${resumeId}`} className="btn btn-outline">
                  프로젝트 추가
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyResumeDetailPage;
