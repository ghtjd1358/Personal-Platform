import React from 'react';
import { CategoryDetail } from '@/network';

interface BlogCategoryFilterProps {
  categories: CategoryDetail[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  if (categories.length === 0) return null;

  return (
    <div className="filter-group">
      <span className="filter-label">카테고리</span>
      <div className="category-filter">
        <button
          className={`category-chip ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          전체
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(selectedCategory === cat.id ? null : cat.id)}
          >
            {cat.name}
            {cat.post_count !== undefined && (
              <span className="category-count">{cat.post_count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogCategoryFilter;
