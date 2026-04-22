import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePermission } from '@sonhoseong/mfa-lib';
import {useBlogData, useScrollAnimation} from "@/hooks";
import {BlogStats, HeroSection, PostsSection, SEOHead} from "@/components";
import { getCategories, CategoryDetail } from "@/network";
import { LINK_PREFIX } from '@/config/constants';

type SortOpt = 'latest' | 'oldest' | 'popular' | 'liked';
type ColsOpt = 3 | 4 | 5;

const BlogList: React.FC = () => {
  const { isAdmin } = usePermission();
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOpt>('latest');
  const [cols, setCols] = useState<ColsOpt>(4);

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
    sort,
  });

  useScrollAnimation([posts.length]);

  // 필터 초기화
  const handleResetFilters = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  // 활성 필터 여부 (메모이제이션)
  const hasActiveFilters = useMemo(
    () => !!selectedCategory,
    [selectedCategory]
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
          {/* 정렬 + 페이지당 개수 */}
          <div className="filter-group blog-sort-row">
            <div className="blog-sort-field">
              <span className="filter-label">정렬</span>
              <select
                className="editorial-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOpt)}
                aria-label="정렬 기준"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="popular">조회수 많은순</option>
                <option value="liked">좋아요 많은순</option>
              </select>
            </div>
            <div className="blog-sort-field">
              <span className="filter-label">열 개수</span>
              <select
                className="editorial-select"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value) as ColsOpt)}
                aria-label="열 개수"
              >
                <option value={3}>3열</option>
                <option value={4}>4열</option>
                <option value={5}>5열</option>
              </select>
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
