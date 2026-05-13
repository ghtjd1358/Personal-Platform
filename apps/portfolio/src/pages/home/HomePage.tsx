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

type SortField = 'date' | 'views' | 'title';
type SortDir = 'desc' | 'asc';
type ColsOpt = 1 | 2 | 3;

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [cols, setCols] = useState<ColsOpt>(1);
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

    // 정렬 — base comparator 의 자연 방향에 따라 부호 명시 반전
    switch (sortField) {
      case 'views':
        projects.sort((a, b) => {
          const diff = (b.view_count || 0) - (a.view_count || 0); // base: desc
          return sortDir === 'desc' ? diff : -diff;
        });
        break;
      case 'title':
        projects.sort((a, b) => {
          const diff = a.title.localeCompare(b.title, 'ko'); // base: asc(가나다)
          return sortDir === 'asc' ? diff : -diff;
        });
        break;
      case 'date':
      default:
        projects.sort((a, b) => {
          const diff = new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(); // base: desc(최신)
          return sortDir === 'desc' ? diff : -diff;
        });
        break;
    }

    return projects;
  }, [portfolios, searchQuery, selectedTech, sortField, sortDir]);

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

  // AOS refresh — 데이터 로드 + cols/필터/정렬 변경 시 매번. cols 1↔2/3 토글 시 viewport 밖 카드가 opacity:0 인 채 남아 안 보이던 버그 해결
  useEffect(() => {
    if (!loading && portfolios.length > 0) {
      AOS.refreshHard();
    }
  }, [loading, portfolios, cols, searchQuery, selectedTech, sortField, sortDir]);

  const handleProjectClick = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
  };

  const handleCloseModal = () => {
    setSelectedPortfolioId(null);
  };

  // 로딩 상태 UI 제거 — host GlobalLoading(전역 오버레이)에 맡기고,
  // 데이터 fetch 중엔 빈 구조만 렌더 → 데이터 준비되면 자연 교체.

  // 필터링 여부 무관 — sort 가 항상 반영되도록 filteredProjects 기반으로 derived.
  // 이전: featuredProjects/otherProjects (원본 fetch 순서) 사용 → 정렬 silent fail.
  const featuredFromFiltered = useMemo(
    () => filteredProjects.filter(p => p.is_featured),
    [filteredProjects]
  );
  const otherFromFiltered = useMemo(
    () => filteredProjects.filter(p => !p.is_featured),
    [filteredProjects]
  );

  const heroProjects = isFiltering ? [] : featuredFromFiltered.slice(0, 2);
  const gridProjects = isFiltering
    ? filteredProjects
    : [...featuredFromFiltered.slice(2), ...otherFromFiltered];

  return (
    <div className="portfolio-module">
      {/* 히어로 섹션 — stats 4 metric 을 hero 안 editorial-extras 슬롯에 통합 (blog 와 동일) */}
      <HeroSection
        userName={currentUser?.name}
        totalViews={portfolios.reduce((s, p) => s + (p.view_count || 0), 0)}
        totalProjects={portfolios.length}
        totalLikes={portfolios.reduce((s, p) => s + (p.like_count || 0), 0)}
        daysRunning={(() => {
          if (portfolios.length === 0) return 0;
          const earliest = portfolios.reduce<number>((min, p) => {
            const t = p.created_at ? new Date(p.created_at).getTime() : Number.POSITIVE_INFINITY;
            return Math.min(min, t);
          }, Number.POSITIVE_INFINITY);
          return Number.isFinite(earliest)
            ? Math.max(1, Math.floor((Date.now() - earliest) / (1000 * 60 * 60 * 24)))
            : 0;
        })()}
        isLoading={loading}
      />

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

      {/* 필터 섹션 — blog 와 동일한 wrap (section.filter-section + container + filter-group 묶음). section-header/label 폐기 */}
      <section id="portfolio" className="filter-section">
        <div className="container">
          {/* 검색 및 필터 — blog SearchBar 와 동일 마크업 (form 대신 div, submit 버튼 없음 — live search) */}
          <div className="filter-bar" data-aos="fade-up">
            <div className="search-bar">
              <div className="search-input-wrapper">
                <svg
                  className="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="20"
                  height="20"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="프로젝트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="검색어 지우기"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 정렬 segmented — field 3 + direction 2 */}
            <div className="filter-group blog-sort-row portfolio-sort-row">
              <div className="blog-sort-field">
                <span className="filter-label">정렬</span>
                <div className="segmented-control" role="radiogroup" aria-label="정렬 기준">
                  <button
                    type="button"
                    className={`segmented-btn ${sortField === 'date' ? 'active' : ''}`}
                    onClick={() => setSortField('date')}
                    title="작성일 기준"
                    aria-pressed={sortField === 'date'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>작성일</span>
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${sortField === 'views' ? 'active' : ''}`}
                    onClick={() => setSortField('views')}
                    title="조회수 기준"
                    aria-pressed={sortField === 'views'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>조회수</span>
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${sortField === 'title' ? 'active' : ''}`}
                    onClick={() => setSortField('title')}
                    title="이름 기준"
                    aria-pressed={sortField === 'title'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 7 4 4 20 4 20 7" />
                      <line x1="9" y1="20" x2="15" y2="20" />
                      <line x1="12" y1="4" x2="12" y2="20" />
                    </svg>
                    <span>이름</span>
                  </button>
                </div>
              </div>
              <div className="blog-sort-field">
                <span className="filter-label">방향</span>
                <div className="segmented-control" role="radiogroup" aria-label="정렬 방향">
                  <button
                    type="button"
                    className={`segmented-btn ${sortDir === 'desc' ? 'active' : ''}`}
                    onClick={() => setSortDir('desc')}
                    title="내림차순 (큰→작)"
                    aria-pressed={sortDir === 'desc'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="6" x2="13" y2="6" />
                      <line x1="3" y1="12" x2="11" y2="12" />
                      <line x1="3" y1="18" x2="9" y2="18" />
                      <polyline points="17 18 17 6 21 10" />
                    </svg>
                    <span>내림</span>
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${sortDir === 'asc' ? 'active' : ''}`}
                    onClick={() => setSortDir('asc')}
                    title="오름차순 (작→큰)"
                    aria-pressed={sortDir === 'asc'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="6" x2="9" y2="6" />
                      <line x1="3" y1="12" x2="11" y2="12" />
                      <line x1="3" y1="18" x2="13" y2="18" />
                      <polyline points="17 6 17 18 21 14" />
                    </svg>
                    <span>오름</span>
                  </button>
                </div>
              </div>
              <div className="blog-sort-field">
                <span className="filter-label">열</span>
                <div className="segmented-control segmented-control--cols" role="radiogroup" aria-label="열 개수">
                  {([1, 2, 3] as const).map((n) => {
                    // 1열 = cinematic Z-pattern (기존), 2/3열 = grid
                    const rows: number[] = [n];
                    const W = 32;
                    const H = 24;
                    const pad = 3;
                    const gap = 2.5;
                    const innerH = H - pad * 2;
                    const rowH = (innerH - gap * (rows.length - 1)) / rows.length;
                    const isActive = cols === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        className={`segmented-btn cols-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setCols(n)}
                        title={`${n}열`}
                        aria-pressed={isActive}
                      >
                        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
                          {rows.flatMap((cellsInRow, rIdx) => {
                            const innerW = W - pad * 2;
                            const cellW = (innerW - gap * (cellsInRow - 1)) / cellsInRow;
                            const y = pad + rIdx * (rowH + gap);
                            return Array.from({ length: cellsInRow }).map((_, cIdx) => {
                              const x = pad + cIdx * (cellW + gap);
                              return (
                                <rect key={`${rIdx}-${cIdx}`} x={x} y={y} width={cellW} height={rowH} rx={1} fill={isActive ? 'currentColor' : 'none'} />
                              );
                            });
                          })}
                        </svg>
                        <span className="cols-btn-num">{n}</span>
                      </button>
                    );
                  })}
                </div>
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
            <div className={`insta-grid${cols > 1 ? ` insta-grid--cols-${cols}` : ''}`}>
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
            <div className={`insta-grid${cols > 1 ? ` insta-grid--cols-${cols}` : ''}`}>
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
