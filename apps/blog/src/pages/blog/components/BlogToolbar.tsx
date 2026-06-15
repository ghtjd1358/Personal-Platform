import React from 'react';
import { Link } from 'react-router-dom';
import { LINK_PREFIX } from '@/config/constants';

type ListTab = 'posts' | 'series';

interface BlogToolbarProps {
  activeTab: ListTab;
  isAdmin: boolean;
  onTabChange: (tab: ListTab) => void;
}

const BlogToolbar: React.FC<BlogToolbarProps> = ({ activeTab, isAdmin, onTabChange }) => {
  return (
    <section className="blog-tabs-section">
      <div className="container">
        <div className="blog-toolbar-row">
          <div className="blog-tabs" role="tablist" aria-label="블로그 보기 모드">
            <button
              type="button"
              role="tab"
              className={`blog-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => onTabChange('posts')}
              aria-selected={activeTab === 'posts'}
            >
              전체 글
            </button>
            <button
              type="button"
              role="tab"
              className={`blog-tab ${activeTab === 'series' ? 'active' : ''}`}
              onClick={() => onTabChange('series')}
              aria-selected={activeTab === 'series'}
            >
              시리즈
            </button>
          </div>
          {isAdmin && (
            <Link
              to={`${LINK_PREFIX}/write`}
              className="blog-toolbar-write"
              title="글쓰기"
              aria-label="글쓰기"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogToolbar;
