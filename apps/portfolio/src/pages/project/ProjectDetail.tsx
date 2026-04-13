/**
 * ProjectDetail - 포트폴리오 상세 페이지
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser, ScrollTopButton } from '@sonhoseong/mfa-lib';
import { getPortfolioDetail, incrementViewCount } from '@/network/apis/portfolio';
import { PortfolioSummary } from '@/network/apis/portfolio/types';
import { Comments } from '@/components';
import { LINK_PREFIX } from '@/config/constants';
import AOS from 'aos';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();
  const isOwner = currentUser && project?.user_id === currentUser.id;

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) {
        setError('프로젝트를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await getPortfolioDetail(slug);
        if (res.success && res.data) {
          setProject(res.data);
          // 조회수 증가
          incrementViewCount(res.data.id);
        } else {
          setError(res.error || '프로젝트를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('프로젝트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!loading && project) {
      AOS.refresh();
    }
  }, [loading, project]);

  const handleBack = () => {
    navigate(`${LINK_PREFIX}/`);
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>프로젝트를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-error">
        <div className="error-icon">😢</div>
        <h2>프로젝트를 찾을 수 없습니다</h2>
        <p>{error}</p>
        <button className="back-btn" onClick={handleBack}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* 히어로 섹션 */}
      <section className="project-hero">
        <div className="project-hero-bg">
          {project.cover_image && (
            <img src={project.cover_image} alt="" className="project-hero-image" />
          )}
          <div className="project-hero-overlay"></div>
        </div>

        <div className="container">
          <button className="back-btn-floating" onClick={handleBack} data-aos="fade-right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            목록
          </button>

          <div className="project-hero-content" data-aos="fade-up">
            <div className="project-hero-meta">
              {project.category && (
                <span className="project-category">{project.category.name}</span>
              )}
              {project.is_featured && (
                <span className="project-featured">Featured</span>
              )}
            </div>
            <h1 className="project-title">{project.title}</h1>
            <p className="project-description">
              {project.description || project.short_description}
            </p>

            <div className="project-stats">
              <span className="stat">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                {project.view_count || 0} views
              </span>
              {project.detail?.period && (
                <span className="stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {project.detail.period}
                </span>
              )}
            </div>

            <div className="project-actions">
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {isOwner && (
                <Link to={`${LINK_PREFIX}/project/${project.slug}/edit`} className="action-btn edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  수정
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 기술 스택 */}
      {project.techStack && project.techStack.length > 0 && (
        <section className="project-section" data-aos="fade-up">
          <div className="container">
            <h2 className="section-title">기술 스택</h2>
            <div className="tech-stack-grid">
              {project.techStack.map((tech) => (
                <div key={tech.id} className="tech-item">
                  <div
                    className="tech-icon"
                    style={{ backgroundColor: tech.icon_color || 'var(--color-accent)' }}
                  >
                    {tech.icon || tech.name.charAt(0)}
                  </div>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 프로젝트 상세 */}
      {project.detail && (
        <section className="project-section project-details" data-aos="fade-up">
          <div className="container">
            <div className="details-grid">
              {project.detail.overview && (
                <div className="detail-card">
                  <h3 className="detail-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    개요
                  </h3>
                  <p className="detail-content">{project.detail.overview}</p>
                </div>
              )}

              {project.detail.challenge && (
                <div className="detail-card">
                  <h3 className="detail-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    도전 과제
                  </h3>
                  <p className="detail-content">{project.detail.challenge}</p>
                </div>
              )}

              {project.detail.solution && (
                <div className="detail-card">
                  <h3 className="detail-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    해결 방법
                  </h3>
                  <p className="detail-content">{project.detail.solution}</p>
                </div>
              )}

              {project.detail.outcome && (
                <div className="detail-card">
                  <h3 className="detail-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                      <polyline points="17 6 23 6 23 12"/>
                    </svg>
                    결과
                  </h3>
                  <p className="detail-content">{project.detail.outcome}</p>
                </div>
              )}
            </div>

            {/* 프로젝트 정보 */}
            <div className="project-info-bar" data-aos="fade-up">
              {project.detail.role && (
                <div className="info-item">
                  <span className="info-label">역할</span>
                  <span className="info-value">{project.detail.role}</span>
                </div>
              )}
              {project.detail.team_size && (
                <div className="info-item">
                  <span className="info-label">팀 규모</span>
                  <span className="info-value">{project.detail.team_size}명</span>
                </div>
              )}
              {project.detail.duration && (
                <div className="info-item">
                  <span className="info-label">기간</span>
                  <span className="info-value">{project.detail.duration}</span>
                </div>
              )}
              {project.detail.client && (
                <div className="info-item">
                  <span className="info-label">클라이언트</span>
                  <span className="info-value">{project.detail.client}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 태그 */}
      {project.tags && project.tags.length > 0 && (
        <section className="project-section" data-aos="fade-up">
          <div className="container">
            <h2 className="section-title">태그</h2>
            <div className="tags-list">
              {project.tags.map((tag) => (
                <span key={tag.id} className="tag-item">#{tag.tag}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 댓글 섹션 */}
      <Comments portfolioId={project.id} />

      {/* 스크롤 탑 버튼 */}
      <ScrollTopButton />
    </div>
  );
};

export default ProjectDetail;
