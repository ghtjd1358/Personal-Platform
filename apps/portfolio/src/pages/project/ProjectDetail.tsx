/**
 * ProjectDetail - 포트폴리오 상세 페이지
 *
 * 2-col spread:
 *  - 좌: 제목 / 소개 / 개요 / 도전 / 해결 / 결과 / 태그 / 댓글 (콘텐츠 흐름)
 *  - 우 (sticky): cover thumbnail / 기간·역할·팀·클라이언트 / 기술 스택 / Live Demo·GitHub·Edit·Like·Share
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser, ScrollTopButton, storage } from '@sonhoseong/mfa-lib';
import { getPortfolioDetail, incrementViewCount } from '@/network/apis/portfolio';
import { PortfolioSummary } from '@/network/apis/portfolio/types';
import { Comments, ShareButton, LikeButton } from '@/components';
import { LINK_PREFIX } from '@/config/constants';
import AOS from 'aos';
import './ProjectDetail.editorial.css';

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
    <div className="pd-page">
      <div className="container pd-back-row">
        <button className="pd-back-btn" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          목록으로
        </button>
      </div>

      <div className="container pd-spread">
        {/* ===== LEFT: 본문 ===== */}
        <article className="pd-content">
          <header className="pd-title-block">
            <div className="pd-eyebrow">
              {project.category && (
                <span className="pd-eyebrow-cat">{project.category.name}</span>
              )}
              {project.is_featured && (
                <span className="pd-eyebrow-featured">★ FEATURED</span>
              )}
            </div>
            <h1 className="pd-title">{project.title}</h1>
            {project.short_description && (
              <p className="pd-lede">{project.short_description}</p>
            )}
          </header>

          {project.detail?.overview && (
            <section className="pd-section">
              <h2 className="pd-h2">개요</h2>
              <p className="pd-paragraph">{project.detail.overview}</p>
            </section>
          )}

          {project.detail?.challenge && (
            <section className="pd-section">
              <h2 className="pd-h2">도전 과제</h2>
              <p className="pd-paragraph">{project.detail.challenge}</p>
            </section>
          )}

          {project.detail?.solution && (
            <section className="pd-section">
              <h2 className="pd-h2">주요 업무 · 해결 방법</h2>
              <p className="pd-paragraph">{project.detail.solution}</p>
            </section>
          )}

          {project.detail?.outcome && (
            <section className="pd-section">
              <h2 className="pd-h2">성과</h2>
              <p className="pd-paragraph">{project.detail.outcome}</p>
            </section>
          )}

          {project.description && project.description !== project.short_description && (
            <section className="pd-section pd-rich">
              <h2 className="pd-h2">상세</h2>
              <div
                className="pd-rich-content"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </section>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="pd-tags">
              {project.tags.map((t) => (
                <span key={t.id} className="pd-tag">#{t.tag}</span>
              ))}
            </div>
          )}

          {/* 댓글 — 본문 컬럼 최하단 */}
          <Comments portfolioId={project.id} />
        </article>

        {/* ===== RIGHT: 메타 sticky sidebar ===== */}
        <aside className="pd-meta">
          {/* COVER thumbnail */}
          {project.cover_image ? (
            <div className="pd-cover">
              <img src={project.cover_image} alt={project.title} />
            </div>
          ) : (
            <div className="pd-cover pd-cover--empty">
              <span>{project.badge || '✶'}</span>
            </div>
          )}

          {/* PROPERTIES — 기간/역할/팀/클라이언트 */}
          {(project.detail?.period || project.detail?.role || project.detail?.team_size != null || project.detail?.client) && (
            <div className="pd-props">
              {project.detail?.period && (
                <div className="pd-prop">
                  <span className="pd-prop-key">기간</span>
                  <span className="pd-prop-val">{project.detail.period}</span>
                </div>
              )}
              {project.detail?.role && (
                <div className="pd-prop">
                  <span className="pd-prop-key">역할</span>
                  <span className="pd-prop-val">{project.detail.role}</span>
                </div>
              )}
              {project.detail?.team_size != null && (
                <div className="pd-prop">
                  <span className="pd-prop-key">팀</span>
                  <span className="pd-prop-val">{project.detail.team_size}명</span>
                </div>
              )}
              {project.detail?.client && (
                <div className="pd-prop">
                  <span className="pd-prop-key">클라이언트</span>
                  <span className="pd-prop-val">{project.detail.client}</span>
                </div>
              )}
            </div>
          )}

          {/* TECH STACK */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="pd-tech">
              <span className="pd-tech-key">기술 스택</span>
              <div className="pd-chips">
                {project.techStack.map((tech) => (
                  <span key={tech.id} className="pd-chip">{tech.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* LINKS — Live Demo / GitHub / Edit / Like / Share */}
          <div className="pd-links">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-link pd-link--primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-link pd-link--secondary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {isOwner && (
              <Link to={`${LINK_PREFIX}/mypage/edit/${project.id}`} className="pd-link pd-link--ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                수정
              </Link>
            )}
            <div className="pd-link-row">
              <LikeButton
                portfolioId={project.id}
                userId={currentUser?.id}
                initialLikeCount={project.like_count || 0}
              />
              <ShareButton
                title={project.title}
                description={project.short_description || undefined}
              />
            </div>
          </div>
        </aside>
      </div>

      {!storage.isHostApp() && <ScrollTopButton />}
    </div>
  );
};

export default ProjectDetail;
