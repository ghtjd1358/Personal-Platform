/**
 * PortfolioModal - 포트폴리오 상세 모달 (단일 컬럼)
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
      loadData();
    }
  }, [portfolioId]);

  useEffect(() => {
    // ESC 키로 모달 닫기
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

  const loadData = async () => {
    if (!portfolioId) return;

    setIsLoading(true);
    try {
      const portfolioRes = await getPortfolioById(portfolioId);
      if (portfolioRes.success && portfolioRes.data) {
        setPortfolio(portfolioRes.data);
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!portfolioId) return null;

  return (
    <div className="portfolio-modal-backdrop" onClick={handleBackdropClick}>
      <div className="portfolio-modal">
        {/* 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isLoading ? (
          <div className="modal-loading">
            <div className="spinner-large" />
          </div>
        ) : !portfolio ? (
          <div className="modal-error">
            <p>포트폴리오를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="modal-content-wrapper">
            <div className="modal-left">
              {/* 이미지/커버 */}
              <div className="modal-cover">
                {portfolio.cover_image ? (
                  <img src={portfolio.cover_image} alt={portfolio.title} />
                ) : (
                  <div className="modal-cover-placeholder">
                    <span>{portfolio.badge || '🚀'}</span>
                  </div>
                )}
              </div>

              {/* 프로젝트 정보 */}
              <div className="modal-info">
                <div className="modal-header">
                  {portfolio.category && (
                    <span className="modal-category">{portfolio.category.name}</span>
                  )}
                  {portfolio.is_featured && (
                    <span className="modal-featured">Featured</span>
                  )}
                </div>

                <h2 className="modal-title">{portfolio.title}</h2>

                <p className="modal-desc">
                  {portfolio.short_description || portfolio.description}
                </p>

                {/* 기술 스택 */}
                {portfolio.techStack && portfolio.techStack.length > 0 && (
                  <div className="modal-tech">
                    {portfolio.techStack.map((tech) => (
                      <span key={tech.id} className="modal-tech-tag">{tech.name}</span>
                    ))}
                  </div>
                )}

                {/* 상세 내용 (HTML) */}
                {portfolio.description && (
                  <div
                    className="modal-description-content"
                    dangerouslySetInnerHTML={{ __html: portfolio.description }}
                  />
                )}

                {/* 링크들 */}
                <div className="modal-links">
                  {portfolio.demo_url && (
                    <a
                      href={portfolio.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link primary"
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
                      className="modal-link secondary"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>

                {/* 메타 정보 */}
                <div className="modal-meta">
                  {portfolio.detail?.period && (
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {portfolio.detail.period}
                    </span>
                  )}
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {portfolio.view_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioModal;
