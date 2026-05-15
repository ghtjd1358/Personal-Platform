import React, { useEffect, useCallback } from 'react';
import { ModalCommonProps } from './types';
import { popModal } from './modal-manager';
import type { PortfolioItem } from '../../types';
import { resolveIcon } from '../../constants/iconResolver';
import { FaBlog, FaGlobe, FaGithub, FaBookOpen } from 'react-icons/fa';
import NotionContent from '../notion/NotionContent';
import './PortfolioModal.editorial.css';

interface PortfolioModalProps extends ModalCommonProps {
  portfolio: PortfolioItem;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ portfolio, onClose }) => {
  const handleClose = useCallback(() => {
    popModal();
    onClose?.();
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-container modal-container--portfolio">
        <button className="modal-close no-cover" onClick={handleClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          {/* notion_url 있을 땐 Notion 페이지 자체 title 이 본문에 들어가서 중복 → 코드 측 h1 숨김 */}
          {!portfolio.detail?.notion_url && (
            <h1 className="modal-title">{portfolio.title}</h1>
          )}
        </div>

        {/* 본문 — notion_url 있으면 react-notion-x 로 분기, 아니면 기존 sections 폴백 */}
        <div className="modal-body">
          {portfolio.detail?.notion_url ? (
            <NotionContent notionUrl={portfolio.detail.notion_url} />
          ) : (
            <>
              <div className="modal-section">
                <h4 className="modal-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  프로젝트 소개
                </h4>
                <p className="modal-desc">{portfolio.desc}</p>
              </div>

              {portfolio.detail?.tasks && portfolio.detail.tasks.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    주요 업무
                  </h4>
                  <ul className="modal-list">
                    {portfolio.detail.tasks.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}

            </>
          )}
        </div>

        {/* 메타 sidebar — modal-container 의 직접 자식 (modal-body 와 형제). 기술 스택 위 빈공간 제거 */}
        <aside className="modal-sidebar">
            {/* 기술 스택 */}
            <div className="modal-info-card">
              <h5 className="modal-info-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                기술 스택
              </h5>
              <div className="modal-tech-grid">
                {portfolio.tags.map((tag) => {
                  const icon = resolveIcon(tag.iconKey, tag.iconColor);
                  return (
                    <div className="tech-icon" key={tag.name} data-tooltip={tag.name}>
                      {icon || <span className="tech-icon-fallback">{tag.name.charAt(0)}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 기간 */}
            {portfolio.detail?.period && (
              <div className="modal-info-card">
                <h5 className="modal-info-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  기간
                </h5>
                <p className="modal-info-value">{portfolio.detail.period}</p>
              </div>
            )}

            {/* 역할 */}
            {portfolio.detail?.role && (
              <div className="modal-info-card">
                <h5 className="modal-info-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  역할
                </h5>
                <p className="modal-info-value">{portfolio.detail.role}</p>
              </div>
            )}

            {/* 관련 링크 — notion_url 또는 일반 links 중 하나라도 있으면 카드 노출 */}
            {(portfolio.detail?.notion_url || (portfolio.detail?.links && portfolio.detail.links.length > 0)) && (
              <div className="modal-info-card">
                <h5 className="modal-info-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  관련 링크
                </h5>
                <div className="modal-links">
                  {/* 노션 상세 보기 — 최상단 (primary detail view 진입점) */}
                  {portfolio.detail?.notion_url && (
                    <a
                      href={portfolio.detail.notion_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link modal-link--notion"
                    >
                      <span className="modal-link-icon"><FaBookOpen /></span>
                      노션 상세 보기
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                  {portfolio.detail?.links?.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link"
                    >
                      {link.label.includes('GitHub') && (
                        <span className="modal-link-icon"><FaGithub /></span>
                      )}
                      {link.label.includes('블로그') && (
                        <span className="modal-link-icon"><FaBlog /></span>
                      )}
                      {(link.label.includes('서비스') ||
                        link.label.includes('데모') ||
                        link.label.includes('사이트') ||
                        link.label.includes('배포') ||
                        link.label.toLowerCase().includes('demo') ||
                        link.label.toLowerCase().includes('live')) && (
                        <span className="modal-link-icon"><FaGlobe /></span>
                      )}
                      {link.label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </aside>
      </div>
    </div>
  );
};
