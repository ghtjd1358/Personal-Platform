import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {useBlogData, useScrollAnimation} from "@/hooks";
import {BlogStats, HeroSection, PostsSection, SEOHead} from "@/components";
import { getCategories, CategoryDetail } from "@/network";

const BlogList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

      {/* 필터 섹션 */}
      <section className="filter-section">
        <div className="container">
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

      <PostsSection
        posts={posts}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </>
  );
};

export default BlogList;
