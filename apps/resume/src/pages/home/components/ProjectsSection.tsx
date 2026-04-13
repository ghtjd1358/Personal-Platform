import React, { useState } from 'react';
import { usePortfolioModal } from '../../../components/modal';
import { PortfolioItem } from '../../../data';
import { iconMap } from '../../../constants/iconMap';
import { FaGithub, FaExternalLinkAlt, FaBlog } from 'react-icons/fa';
import { SectionEditButton } from '../../../components/common';

interface ProjectsSectionProps {
  portfolioData: PortfolioItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ portfolioData }) => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { openPortfolioModal } = usePortfolioModal();

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">프로젝트</div>
          <h2 className="section-title">주요 작업물</h2>
        </div>
        <div className="project-grid">
          {(showAllProjects ? portfolioData : portfolioData.slice(0, 3)).map((portfolio, index) => (
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

        <div className="project-more animate-on-scroll">
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
