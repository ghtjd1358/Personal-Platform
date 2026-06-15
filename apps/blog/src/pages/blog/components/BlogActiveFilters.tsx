import React from 'react';
import { CategoryDetail } from '@/network';

interface BlogActiveFiltersProps {
  searchQuery: string;
  selectedCategory: string | null;
  categories: CategoryDetail[];
  resultCount: number;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onResetFilters: () => void;
}

const BlogActiveFilters: React.FC<BlogActiveFiltersProps> = ({
  searchQuery,
  selectedCategory,
  categories,
  resultCount,
  onClearSearch,
  onClearCategory,
  onResetFilters,
}) => {
  return (
    <div className="active-filters">
      <span className="filter-result-count">{resultCount}개의 결과</span>
      <div className="active-filter-tags">
        {searchQuery && (
          <span className="active-filter-tag">
            검색: {searchQuery}
            <button onClick={onClearSearch}>×</button>
          </span>
        )}
        {selectedCategory && (
          <span className="active-filter-tag">
            카테고리: {categories.find(c => c.id === selectedCategory)?.name}
            <button onClick={onClearCategory}>×</button>
          </span>
        )}
      </div>
      <button className="reset-filters-btn" onClick={onResetFilters}>
        필터 초기화
      </button>
    </div>
  );
};

export default BlogActiveFilters;
