import React, { useState } from 'react';
import { usePortfolioModal } from '../../../components/modal';
import type { PortfolioItem } from '../../../types';
import { iconMap } from '../../../constants/iconMap';
import { FaGithub, FaExternalLinkAlt, FaBlog } from 'react-icons/fa';
import { SectionEditButton } from '../../../components/common';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

interface ProjectsSectionProps {
  portfolioData: PortfolioItem[];
  /** true 이면서 portfolioData 비어있을 때 skeleton 3개 렌더. */
  isLoading?: boolean;
}

const SKELETON_COUNT = 3;

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ portfolioData, isLoading = false }) => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { openPortfolioModal } = usePortfolioModal();
  const showSkeleton = isLoading && portfolioData.length === 0;

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">프로젝트</div>
          <h2 className="section-title">주요 작업물</h2>
        </div>
        <div className="project-grid">
          {showSkeleton
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProjectCardSkeleton key={`skeleton-${i}`} />
              ))
            : (showAllProjects ? portfolioData : portfolioData.slice(0, 3)).map((portfolio, index) => (
            <div
              key={portfolio.id}
              className={`card22 ${index < 3 ? 'animate-on-scroll delay-' + (index + 1) : 'animate-visible'}`}
              onClick={() => openPortfolioModal(portfolio)}
            >
              {/* 카드 바디 - 콘텐츠 영역 */}
              <div className="card-body22">
                {/* 타이틀 */}
                <h4 className="card-title22">
                  {portfolio.title}
                </h4>

                {/* 설명 */}
                <div className="card-desc22-wrapper">
                  <p className="card-desc22">{portfolio.desc}</p>
                </div>

                {/* 기술 스택 태그 */}
                <div className="card-tags22">
                  {portfolio.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="card-tag22">
                      {iconMap[tag] && <span className="tag-icon">{iconMap[tag]}</span>}
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 링크 버튼 */}
                {portfolio.detail?.links && portfolio.detail.links.length > 0 && (
                  <div className="card-links22">
                    {portfolio.detail.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="card-link22"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.label}
                      >
                        {link.label.includes('GitHub') ? <FaGithub /> : link.label.includes('블로그') ? <FaBlog /> : <FaExternalLinkAlt />}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="project-more animate-on-scroll" style={{ display: showSkeleton ? 'none' : undefined }}>
          {portfolioData.length > 3 && (
            <button
              className={`show-more-btn ${showAllProjects ? 'collapsed' : ''}`}
              onClick={() => setShowAllProjects(!showAllProjects)}
            >
              <div className="chevron-wave">
                <span className="chevron"></span>
                <span className="chevron"></span>
              </div>
            </button>
          )}
          <SectionEditButton editPath="/admin/projects" label="프로젝트 편집" />
        </div>
      </div>
    </section>
  );
};
