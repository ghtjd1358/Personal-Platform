import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePermission, useCurrentUser, useDebounce } from '@sonhoseong/mfa-lib';
import {useBlogData, useScrollAnimation} from "@/hooks";
import {useFetchSeries} from "@/network/hooks";
import {HeroSection, PostsSection, SeriesGrid, SEOHead, SearchBar} from "@/components";
import { getCategories, CategoryDetail } from "@/network";
import {
  BlogToolbar,
  BlogSortControls,
  BlogCategoryFilter,
  BlogActiveFilters,
  type SortField,
  type SortDir,
  type ColsOpt,
} from './components';

type ListTab = 'posts' | 'series';

const BlogList: React.FC = () => {
  const { isAdmin } = usePermission();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<ListTab>('posts');
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [cols, setCols] = useState<ColsOpt>(4);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 매 입력마다 useBlogData 가 새 fetch 트리거 → 카드 깜빡임. 300ms debounce 로 입력 끝 후만 fetch.
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
    search: debouncedSearchQuery,
  });

  // 시리즈 데이터를 부모에서 호이스트 — 탭 전환 시 unmount/remount 로 빈 화면 깜빡이던 버그 해결.
  // BlogList 첫 마운트에 한 번만 fetch, 탭 토글은 단순 표시 분기.
  const { series } = useFetchSeries();

  // deps 에 activeTab 추가 — 시리즈 ↔ 전체 글 탭 전환 시 PostsSection 재마운트되며
  // 새 .animate-on-scroll 카드가 생기는데 posts.length 만 보면 effect 재실행 안 돼 영원히 opacity:0.
  useScrollAnimation([posts.length, activeTab]);

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
      <HeroSection
        userName={currentUser?.name}
        totalViews={totalViews}
        totalPosts={totalPosts}
        totalLikes={totalLikes}
        daysRunning={daysRunning}
        isLoading={isLoading}
      />

      {/* 통합 toolbar — 탭(좌) + admin ✎ (우, isAdmin 만). admin-bar 분리 폐기. */}
      <BlogToolbar
        activeTab={activeTab}
        isAdmin={isAdmin}
        onTabChange={setActiveTab}
      />

      {activeTab === 'series' ? (
        <SeriesGrid series={series} />
      ) : (
      <>
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
          <BlogSortControls
            sortField={sortField}
            sortDir={sortDir}
            cols={cols}
            onSortFieldChange={setSortField}
            onSortDirChange={setSortDir}
            onColsChange={setCols}
          />

          {/* 카테고리 필터 */}
          <BlogCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* 활성 필터 표시 */}
          {hasActiveFilters && (
            <BlogActiveFilters
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              categories={categories}
              resultCount={posts.length}
              onClearSearch={() => setSearchQuery('')}
              onClearCategory={() => setSelectedCategory(null)}
              onResetFilters={handleResetFilters}
            />
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
          sortField={sortField}
          sortDir={sortDir}
        />
      </div>
      </>
      )}
    </>
  );
};

export default BlogList;
