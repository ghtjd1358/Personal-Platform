import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePermission } from '@sonhoseong/mfa-lib';
import {useBlogData, useScrollAnimation} from "@/hooks";
import {BlogStats, HeroSection, PostsSection, SEOHead, SearchBar} from "@/components";
import { getCategories, CategoryDetail } from "@/network";
import { LINK_PREFIX } from '@/config/constants';

type SortField = 'date' | 'views' | 'likes';
type SortDir = 'desc' | 'asc';
type ColsOpt = 3 | 4 | 5;

const BlogList: React.FC = () => {
  const { isAdmin } = usePermission();
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [cols, setCols] = useState<ColsOpt>(4);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // field + direction 합성 → backend PostSortOption (`date_desc`, `views_asc` 등)
  const sortKey = `${sortField}_${sortDir}` as const;

  const {
    posts,
    stats: {totalPosts, totalViews, totalLikes, daysRunning},
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore
  } = useBlogData({
    limit: 20,
    categoryId: selectedCategory,
    sort: sortKey,
    search: searchQuery,
  });

  useScrollAnimation([posts.length]);

  // 필터 초기화
  const handleResetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
  }, []);

  // 활성 필터 여부 (메모이제이션)
  const hasActiveFilters = useMemo(
    () => !!selectedCategory || !!searchQuery,
    [selectedCategory, searchQuery]
  );

  // 카테고리 목록 로드
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    };
    loadFilters();
  }, []);

  return (
    <>
      <SEOHead
        title="블로그"
        description="개발자 손호성의 기술 블로그입니다. 웹 개발, 프론트엔드, React, TypeScript 관련 글을 작성합니다."
      />
      <HeroSection />

      <BlogStats
        totalViews={totalViews}
        totalPosts={totalPosts}
        totalLikes={totalLikes}
        daysRunning={daysRunning}
        isLoading={isLoading}
      />

      {/* 관리자 전용 inline action bar — stats 아래, 글 목록 바로 위에 배치
         (글쓰기 진입을 카드 목록과 가까이 두어 "지금 바로 쓰기" 맥락 강화) */}
      {isAdmin && (
        <div className="blog-admin-bar">
          <div className="container">
            <div className="blog-admin-bar-inner">
              <div className="blog-admin-bar-meta">
                <span className="blog-admin-bar-eyebrow">ADMIN · AUTHOR</span>
                <span className="blog-admin-bar-hint">새 글을 작성하거나 기존 글을 관리합니다</span>
              </div>
              <div className="blog-admin-bar-actions">
                <Link to={`${LINK_PREFIX}/write`} className="blog-admin-btn blog-admin-btn--primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  + 글쓰기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 필터 섹션 */}
      <section className="filter-section">
        <div className="container">
          {/* 검색바 */}
          <div className="filter-group">
            <SearchBar
              placeholder="제목, 본문 내 검색..."
              initialValue={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>

          {/* 정렬 + 열 개수 — segmented control. field 3 + direction 2 = 6 조합 */}
          <div className="filter-group blog-sort-row">
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
                  className={`segmented-btn ${sortField === 'likes' ? 'active' : ''}`}
                  onClick={() => setSortField('likes')}
                  title="좋아요 기준"
                  aria-pressed={sortField === 'likes'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={sortField === 'likes' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>좋아요</span>
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
                {([3, 4, 5] as const).map((n) => {
                  // 3 → 1행 3열, 4 → 2행 2열, 5 → 위 2 + 아래 3
                  const rows: number[] = n === 3 ? [3] : n === 4 ? [2, 2] : [2, 3];
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
                      <svg
                        width={W}
                        height={H}
                        viewBox={`0 0 ${W} ${H}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        {rows.flatMap((cellsInRow, rIdx) => {
                          const innerW = W - pad * 2;
                          const cellW = (innerW - gap * (cellsInRow - 1)) / cellsInRow;
                          const y = pad + rIdx * (rowH + gap);
                          return Array.from({ length: cellsInRow }).map((_, cIdx) => {
                            const x = pad + cIdx * (cellW + gap);
                            return (
                              <rect
                                key={`${rIdx}-${cIdx}`}
                                x={x}
                                y={y}
                                width={cellW}
                                height={rowH}
                                rx={1}
                                fill={isActive ? 'currentColor' : 'none'}
                              />
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

          {/* 카테고리 필터 */}
          {categories.length > 0 && (
            <div className="filter-group">
              <span className="filter-label">카테고리</span>
              <div className="category-filter">
                <button
                  className={`category-chip ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  전체
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  >
                    {cat.name}
                    {cat.post_count !== undefined && (
                      <span className="category-count">{cat.post_count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 활성 필터 표시 */}
          {hasActiveFilters && (
            <div className="active-filters">
              <span className="filter-result-count">{posts.length}개의 결과</span>
              <div className="active-filter-tags">
                {searchQuery && (
                  <span className="active-filter-tag">
                    검색: {searchQuery}
                    <button onClick={() => setSearchQuery('')}>×</button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="active-filter-tag">
                    카테고리: {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory(null)}>×</button>
                  </span>
                )}
              </div>
              <button className="reset-filters-btn" onClick={handleResetFilters}>
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* cols 선택값을 CSS var 로 .blog-grid 에 전달 (grid-template-columns 동적) */}
      <div style={{ ['--blog-cols' as any]: cols }}>
        <PostsSection
          posts={posts}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </>
  );
};

export default BlogList;
