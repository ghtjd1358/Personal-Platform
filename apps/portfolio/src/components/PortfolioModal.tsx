/**
 * PortfolioModal — Notion-page style sectioned 상세 모달.
 * 면접관에게 어필하는 핵심 소통구라 정보 위계 명확 + 섹션 분할 + 이미지 임베드 지원.
 *
 * 구조: cover → title block → properties → tech → 개요/도전/해결/성과 → 상세(HTML) → tags → links
 */
import React, { useEffect, useState } from 'react';
import { getPortfolioById, PortfolioDetail } from '@/network';
import './PortfolioModal.editorial.css';

interface PortfolioModalProps {
  portfolioId: string | null;
  onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ portfolioId, onClose }) => {
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (portfolioId) {
      const load = async () => {
        setIsLoading(true);
        try {
          const res = await getPortfolioById(portfolioId);
          if (res.success && res.data) setPortfolio(res.data);
        } catch (err) {
          console.error('Failed to load portfolio:', err);
        } finally {
          setIsLoading(false);
        }
      };
      load();
    }
  }, [portfolioId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!portfolioId) return null;

  return (
    <div className="pm-backdrop" onClick={handleBackdropClick}>
      <div className="pm-modal" role="dialog" aria-modal="true">
        <button className="pm-close" onClick={onClose} aria-label="닫기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isLoading ? (
          <div className="pm-loading">
            <div className="pm-loading-dot" />
            <div className="pm-loading-dot" />
            <div className="pm-loading-dot" />
          </div>
        ) : !portfolio ? (
          <div className="pm-error">
            <p>포트폴리오를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <article className="pm-page">
            <div className="pm-spread">
              {/* === RIGHT(visual) PAGE — 메타 패널 (cover thumbnail + properties + tech + links) === */}
              <aside className="pm-left">
                {/* COVER — 메타 패널 최상단 작은 thumbnail */}
                {portfolio.cover_image ? (
                  <div className="pm-cover">
                    <img src={portfolio.cover_image} alt={portfolio.title} />
                  </div>
                ) : (
                  <div className="pm-cover pm-cover--empty">
                    <span>{portfolio.badge || '✶'}</span>
                  </div>
                )}

                {(() => {
                  const hasProperties = !!(
                    portfolio.detail?.period ||
                    portfolio.detail?.duration ||
                    portfolio.detail?.role ||
                    portfolio.detail?.team_size != null ||
                    portfolio.detail?.client
                  );
                  const hasTech = !!(portfolio.techStack && portfolio.techStack.length > 0);
                  const hasMeta = hasProperties || hasTech;

                  if (!hasMeta) {
                    return (
                      <div className="pm-meta-empty">
                        <span className="pm-meta-empty-mark">✶</span>
                        <p>아직 상세 정보가 등록되지 않은 프로젝트입니다.</p>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* PROPERTIES — 좁은 좌측 페이지에선 단일 컬럼 stack */}
                      {hasProperties && (
                        <div className="pm-properties">
                          {portfolio.detail?.period && (
                            <div className="pm-prop">
                              <span className="pm-prop-key">기간</span>
                              <span className="pm-prop-val">{portfolio.detail.period}</span>
                            </div>
                          )}
                          {portfolio.detail?.duration && (
                            <div className="pm-prop">
                              <span className="pm-prop-key">기간(D)</span>
                              <span className="pm-prop-val">{portfolio.detail.duration}</span>
                            </div>
                          )}
                          {portfolio.detail?.role && (
                            <div className="pm-prop">
                              <span className="pm-prop-key">역할</span>
                              <span className="pm-prop-val">{portfolio.detail.role}</span>
                            </div>
                          )}
                          {portfolio.detail?.team_size != null && (
                            <div className="pm-prop">
                              <span className="pm-prop-key">팀</span>
                              <span className="pm-prop-val">{portfolio.detail.team_size}명</span>
                            </div>
                          )}
                          {portfolio.detail?.client && (
                            <div className="pm-prop">
                              <span className="pm-prop-key">클라이언트</span>
                              <span className="pm-prop-val">{portfolio.detail.client}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TECH STACK */}
                      {hasTech && (
                        <div className="pm-meta-tech">
                          <span className="pm-meta-tech-key">기술 스택</span>
                          <div className="pm-chips">
                            {portfolio.techStack!.map((tech) => (
                              <span key={tech.id} className="pm-chip">{tech.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* LINKS — 좌측 페이지 하단 CTA */}
                {(portfolio.demo_url || portfolio.github_url) && (
                  <div className="pm-links">
                    {portfolio.demo_url && (
                      <a
                        href={portfolio.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pm-link pm-link--primary"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {portfolio.github_url && (
                      <a
                        href={portfolio.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pm-link pm-link--secondary"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </aside>

              {/* === LEFT(visual) PAGE — 본문 (title/lede/sections/rich/tags) === */}
              <div className="pm-right">
                {/* TITLE BLOCK — 좌측 본문의 책 표지 격. 제목/소개는 콘텐츠 흐름과 함께 좌측 */}
                <header className="pm-title-block">
                  <div className="pm-eyebrow">
                    {portfolio.category?.name && (
                      <span className="pm-eyebrow-cat">{portfolio.category.name}</span>
                    )}
                    {portfolio.is_featured && (
                      <span className="pm-eyebrow-featured">★ FEATURED</span>
                    )}
                  </div>
                  <h1 className="pm-title">{portfolio.title}</h1>
                  {portfolio.short_description && (
                    <p className="pm-lede">{portfolio.short_description}</p>
                  )}
                </header>

                {portfolio.detail?.overview && (
                  <section className="pm-section">
                    <h2 className="pm-h2">개요</h2>
                    <p className="pm-paragraph">{portfolio.detail.overview}</p>
                  </section>
                )}

                {portfolio.detail?.challenge && (
                  <section className="pm-section">
                    <h2 className="pm-h2">도전 과제</h2>
                    <p className="pm-paragraph">{portfolio.detail.challenge}</p>
                  </section>
                )}

                {portfolio.detail?.solution && (
                  <section className="pm-section">
                    <h2 className="pm-h2">접근 방법</h2>
                    <p className="pm-paragraph">{portfolio.detail.solution}</p>
                  </section>
                )}

                {portfolio.detail?.outcome && (
                  <section className="pm-section">
                    <h2 className="pm-h2">성과</h2>
                    <p className="pm-paragraph">{portfolio.detail.outcome}</p>
                  </section>
                )}

                {portfolio.description && (
                  <section className="pm-section pm-rich">
                    <h2 className="pm-h2">상세 내용</h2>
                    <div
                      className="pm-rich-content"
                      dangerouslySetInnerHTML={{ __html: portfolio.description }}
                    />
                  </section>
                )}

                {portfolio.tags && portfolio.tags.length > 0 && (
                  <div className="pm-tags">
                    {portfolio.tags.map((t) => (
                      <span key={t.id} className="pm-tag">#{t.tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default PortfolioModal;
