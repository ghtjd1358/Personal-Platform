import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScrollTopButton, getCurrentUser, storage, usePermission, EmptyState, Button } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import { PortfolioCard, PortfolioModal, PortfolioCardSkeleton } from '@/components/project';
import NotionEmbedModal from '@/components/notion/NotionEmbedModal';
import { HeroSection } from '@/components';
import { usePortfolioHome, ColsOpt } from '@/hooks/usePortfolioHome';
import './HomePage.editorial.css';

const ColsIcon: React.FC<{ n: ColsOpt; active: boolean }> = ({ n, active }) => {
  const W = 32, H = 24, pad = 3, gap = 2.5;
  const innerH = H - pad * 2;
  const rowH = innerH;
  const innerW = W - pad * 2;
  const cellW = (innerW - gap * (n - 1)) / n;
  const y = pad;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={pad + i * (cellW + gap)} y={y} width={cellW} height={rowH} rx={1} fill={active ? 'currentColor' : 'none'} />
      ))}
    </svg>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { isAdmin } = usePermission();
  const {
    searchQuery, setSearchQuery,
    selectedTech, setSelectedTech,
    selectedNotion, setSelectedNotion,
    selectedPortfolioId, setSelectedPortfolioId,
    sortField, setSortField,
    sortDir, setSortDir,
    cols, setCols,
    portfolios, loading,
    allTechStacks,
    gridProjects,
    isFiltering,
    totalViews, totalLikes, daysRunning,
  } = usePortfolioHome();

  const isEmpty = !loading && gridProjects.length === 0;
  const isSkeletonPhase = loading && gridProjects.length === 0;

  return (
    <div className="portfolio-module">
      <HeroSection
        userName={currentUser?.name}
        totalViews={totalViews}
        totalProjects={portfolios.length}
        totalLikes={totalLikes}
        daysRunning={daysRunning}
        isLoading={loading}
      />

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
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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

      <section id="portfolio" className="filter-section">
        <div className="container">
          <div className="filter-bar" data-aos="fade-up">
            <div className="search-bar">
              <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="프로젝트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="search-clear-btn" onClick={() => setSearchQuery('')} aria-label="검색어 지우기">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="filter-group blog-sort-row portfolio-sort-row">
              <div className="blog-sort-field">
                <span className="filter-label">정렬</span>
                <div className="segmented-control" role="radiogroup" aria-label="정렬 기준">
                  {([
                    { field: 'date', label: '작성일', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
                    { field: 'views', label: '조회수', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
                    { field: 'title', label: '이름', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg> },
                  ] as const).map(({ field, label, icon }) => (
                    <button key={field} type="button" className={`segmented-btn ${sortField === field ? 'active' : ''}`} onClick={() => setSortField(field)} aria-pressed={sortField === field}>
                      {icon}<span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="blog-sort-field">
                <span className="filter-label">방향</span>
                <div className="segmented-control" role="radiogroup" aria-label="정렬 방향">
                  {([
                    { dir: 'desc', label: '내림', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="13" y2="6" /><line x1="3" y1="12" x2="11" y2="12" /><line x1="3" y1="18" x2="9" y2="18" /><polyline points="17 18 17 6 21 10" /></svg> },
                    { dir: 'asc', label: '오름', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="9" y2="6" /><line x1="3" y1="12" x2="11" y2="12" /><line x1="3" y1="18" x2="13" y2="18" /><polyline points="17 6 17 18 21 14" /></svg> },
                  ] as const).map(({ dir, label, icon }) => (
                    <button key={dir} type="button" className={`segmented-btn ${sortDir === dir ? 'active' : ''}`} onClick={() => setSortDir(dir)} aria-pressed={sortDir === dir}>
                      {icon}<span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="blog-sort-field">
                <span className="filter-label">열</span>
                <div className="segmented-control segmented-control--cols" role="radiogroup" aria-label="열 개수">
                  {([1, 2, 3] as ColsOpt[]).map((n) => (
                    <button key={n} type="button" className={`segmented-btn cols-btn ${cols === n ? 'active' : ''}`} onClick={() => setCols(n)} title={`${n}열`} aria-pressed={cols === n}>
                      <ColsIcon n={n} active={cols === n} />
                      <span className="cols-btn-num">{n}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {allTechStacks.length > 0 && (
              <div className="tech-filter">
                <button className={`filter-chip ${!selectedTech ? 'active' : ''}`} onClick={() => setSelectedTech(null)}>전체</button>
                {allTechStacks.slice(0, 8).map(tech => (
                  <button key={tech} className={`filter-chip ${selectedTech === tech ? 'active' : ''}`} onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}>
                    {tech}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isSkeletonPhase ? (
            <div className={`insta-grid${cols > 1 ? ` insta-grid--cols-${cols}` : ''}`}>
              {Array.from({ length: 8 }).map((_, i) => <PortfolioCardSkeleton key={i} />)}
            </div>
          ) : isEmpty ? (
            <EmptyState
              description={isFiltering ? '검색 조건에 맞는 프로젝트가 없습니다.' : '아직 등록된 포트폴리오가 없습니다.'}
              data-aos="fade-up"
            />
          ) : (
            <div className={`insta-grid${cols > 1 ? ` insta-grid--cols-${cols}` : ''}`}>
              {gridProjects.map((project, index) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  index={index}
                  isAdmin={isAdmin}
                  onNotionClick={(url, title) => setSelectedNotion({ url, title })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {!storage.isHostApp() && (
        <div className="floating-buttons">
          <ScrollTopButton />
          {currentUser && (
            <Button.Icon className="floating-user-btn" aria-label="메뉴" onClick={() => navigate(`${LINK_PREFIX}/mypage`)} title="내 포트폴리오">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Button.Icon>
          )}
        </div>
      )}

      {selectedPortfolioId && <PortfolioModal portfolioId={selectedPortfolioId} onClose={() => setSelectedPortfolioId(null)} />}
      <NotionEmbedModal notionUrl={selectedNotion?.url ?? null} title={selectedNotion?.title} onClose={() => setSelectedNotion(null)} />
    </div>
  );
};

export default HomePage;
