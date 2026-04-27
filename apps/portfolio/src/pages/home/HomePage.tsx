/**
 * HomePage - Portfolio 메인 페이지
 * 인스타그램 스타일 레이아웃 + AOS 스크롤 애니메이션
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScrollTopButton, getCurrentUser, storage, usePermission } from '@sonhoseong/mfa-lib';
import { usePortfolios } from './hooks';
import { LINK_PREFIX } from '@/config/constants';
import PortfolioModal from '@/components/PortfolioModal';
import PortfolioCardSkeleton from '@/components/PortfolioCardSkeleton';
import { HeroSection } from '@/components';
import AOS from 'aos';
import './HomePage.editorial.css';

type SortOption = 'latest' | 'popular' | 'alphabetical';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const { portfolios, featuredProjects, otherProjects, loading } = usePortfolios();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { isAdmin } = usePermission();

  // 기술 스택 목록 추출
  const allTechStacks = useMemo(() => {
    const techSet = new Set<string>();
    portfolios.forEach(p => {
      p.techStack?.forEach(t => techSet.add(t.name));
    });
    return Array.from(techSet).sort();
  }, [portfolios]);

  // 필터링 및 정렬된 프로젝트
  const filteredProjects = useMemo(() => {
    let projects = [...portfolios];

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.short_description?.toLowerCase().includes(query) ||
        p.techStack?.some(t => t.name.toLowerCase().includes(query)) ||
        p.tags?.some(t => (t.tag || t).toLowerCase().includes(query))
      );
    }

    // 기술 스택 필터
    if (selectedTech) {
      projects = projects.filter(p =>
        p.techStack?.some(t => t.name === selectedTech)
      );
    }

    // 정렬
    switch (sortBy) {
      case 'popular':
        projects.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'alphabetical':
        projects.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        break;
      case 'latest':
      default:
        projects.sort((a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
    }

    return projects;
  }, [portfolios, searchQuery, selectedTech, sortBy]);

  // 필터된 프로젝트 분류
  const filteredFeatured = useMemo(() =>
    filteredProjects.filter(p => p.is_featured),
    [filteredProjects]
  );

  const filteredOther = useMemo(() =>
    filteredProjects.filter(p => !p.is_featured),
    [filteredProjects]
  );

  const isFiltering = searchQuery.trim() || selectedTech;

  // 데이터 로드 후 AOS refresh
  useEffect(() => {
    if (!loading && portfolios.length > 0) {
      AOS.refresh();
    }
  }, [loading, portfolios]);

  const handleProjectClick = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
  };

  const handleCloseModal = () => {
    setSelectedPortfolioId(null);
  };

  // 로딩 상태 UI 제거 — host GlobalLoading(전역 오버레이)에 맡기고,
  // 데이터 fetch 중엔 빈 구조만 렌더 → 데이터 준비되면 자연 교체.

  // 필터링 여부에 따라 다른 데이터 사용
  const heroProjects = isFiltering ? [] : featuredProjects.slice(0, 2);
  const gridProjects = isFiltering
    ? filteredProjects
    : [...featuredProjects.slice(2), ...otherProjects];

  return (
    <div className="portfolio-module">
      {/* 히어로 섹션 - 비디오 배경 */}
      <HeroSection />

      {/* 관리자 전용 inline action bar — admin (role=admin 또는 owner) 에게만 */}
      {isAdmin && (
        <div className="portfolio-admin-bar">
          <div className="container">
            <div className="portfolio-admin-bar-inner">
              <div className="portfolio-admin-bar-meta">
                <span className="portfolio-admin-bar-eyebrow">ADMIN · CURATOR</span>
                <span className="portfolio-admin-bar-hint">작품을 추가하거나 기존 작품을 관리합니다</span>
              </div>
              <div className="portfolio-admin-bar-actions">
                <Link to="/container/resume/admin/portfolio/new" className="portfolio-admin-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  + 포트폴리오 추가
                </Link>
                <Link to="/container/resume/admin/portfolio" className="portfolio-admin-btn portfolio-admin-btn--ghost">
                  전체 관리 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 전체 프로젝트 그리드 */}
      <section id="portfolio" className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <div className="section-label">All Projects</div>
            <h2 className="section-title">전체 프로젝트</h2>
          </div>

          {/* 검색 및 필터 */}
          <div className="filter-bar" data-aos="fade-up">
            <div className="filter-bar-row">
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="프로젝트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => setSearchQuery('')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="sort-dropdown">
                <select
                  className="editorial-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="정렬 기준"
                >
                  <option value="latest">최신순</option>
                  <option value="popular">인기순</option>
                  <option value="alphabetical">이름순</option>
                </select>
              </div>
            </div>
            {allTechStacks.length > 0 && (
              <div className="tech-filter">
                <button
                  className={`filter-chip ${!selectedTech ? 'active' : ''}`}
                  onClick={() => setSelectedTech(null)}
                >
                  전체
                </button>
                {allTechStacks.slice(0, 8).map(tech => (
                  <button
                    key={tech}
                    className={`filter-chip ${selectedTech === tech ? 'active' : ''}`}
                    onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}
            {isFiltering && (
              <div className="filter-result">
                <span>{filteredProjects.length}개의 프로젝트</span>
                <button className="clear-filter" onClick={() => { setSearchQuery(''); setSelectedTech(null); }}>
                  필터 초기화
                </button>
              </div>
            )}
          </div>

          {loading && gridProjects.length === 0 && heroProjects.length === 0 ? (
            <div className="insta-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <PortfolioCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          ) : !loading && gridProjects.length === 0 && heroProjects.length === 0 ? (
            <div className="empty-state" data-aos="fade-up">
              <div className="empty-state-icon">📁</div>
              <p className="empty-state-text">아직 등록된 포트폴리오가 없습니다.</p>
            </div>
          ) : (
            <div className="insta-grid">
              {gridProjects.map((project, index) => (
                <article
                  key={project.id}
                  className="insta-grid-card"
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 100, 400)}
                  onClick={() => handleProjectClick(project.id)}
                >
                  {/* Admin 전용 수정 버튼 — 카드 모서리 ✎ (클릭 시 편집 페이지로,
                     카드 자체 클릭(모달 열기)은 stopPropagation 으로 차단) */}
                  {isAdmin && (
                    <Link
                      to={`/container/resume/admin/portfolio/edit/${project.id}`}
                      className="insta-grid-edit-btn"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="이 프로젝트 수정"
                      title="이 프로젝트 수정"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                  )}

                  <div className="insta-grid-image">
                    {project.cover_image ? (
                      <img src={project.cover_image} alt={project.title} />
                    ) : (
                      <div className="insta-grid-placeholder">
                        <span>{project.badge || '✶'}</span>
                      </div>
                    )}
                  </div>
                  <div className="insta-grid-info">
                    <span className="insta-grid-eyebrow">
                      {project.badge || `CASE · 0${(index % 9) + 1}`}
                    </span>
                    <h3 className="insta-grid-title">{project.title}</h3>
                    {project.short_description && (
                      <p className="insta-grid-sub">{project.short_description}</p>
                    )}
                    <div className="insta-grid-meta">
                      <span className="insta-grid-meta-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        {project.view_count || 0}
                      </span>
                      {(project as any).is_current && (
                        <span className="insta-grid-meta-item insta-grid-live">● LIVE</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 플로팅 버튼 영역 - host 모드에선 host가 제공하는 영역과 겹치지 않도록 숨김 */}
      {!storage.isHostApp() && (
        <div className="floating-buttons">
          <ScrollTopButton />
          {currentUser && (
            <button
              className="floating-user-btn"
              onClick={() => navigate(`${LINK_PREFIX}/mypage`)}
              title="내 포트폴리오"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* 포트폴리오 상세 모달 */}
      {selectedPortfolioId && (
        <PortfolioModal
          portfolioId={selectedPortfolioId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HomePage;
