import React, { useState, useEffect } from 'react';
import {useBlogData, useScrollAnimation} from "@/hooks";
import {BlogStats, HeroSection, PostsSection} from "@/components";
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
  } = useBlogData({ limit: 20, categoryId: selectedCategory });

  useScrollAnimation([posts.length]);

  // 카테고리 목록 로드
  useEffect(() => {
    getCategories().then(res => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  return (
    <>
      <HeroSection />
      <BlogStats
        totalViews={totalViews}
        totalPosts={totalPosts}
        totalLikes={totalLikes}
        daysRunning={daysRunning}
      />

      {/* 카테고리 필터 */}
      {categories.length > 0 && (
        <section className="category-filter-section">
          <div className="container">
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
        </section>
      )}

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
