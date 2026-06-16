import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';

interface SeriesPost {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    cover_image?: string | null;
    created_at: string;
    view_count: number;
    status: string;
  };
}

interface SeriesPostListProps {
  posts: SeriesPost[];
}

const SeriesPostList: React.FC<SeriesPostListProps> = ({ posts }) => {
  const publishedPosts = posts.filter((p) => p.post.status === 'published');

  if (publishedPosts.length === 0) {
    return (
      <main className="series-content">
        <div className="container">
          <EmptyState description="이 시리즈에 포스트가 없습니다." />
        </div>
      </main>
    );
  }

  return (
    <main className="series-content">
      <div className="container">
        <ol className="series-posts-list">
          {publishedPosts.map((item, index) => (
            <li key={item.post.id} className="series-post-item">
              <Link to={`${LINK_PREFIX}/post/${item.post.slug}`} className="series-post-link">
                <span className="series-post-number">{index + 1}</span>
                <div className="series-post-content">
                  {item.post.cover_image && (
                    <div className="series-post-thumbnail">
                      <img src={item.post.cover_image} alt={item.post.title} />
                    </div>
                  )}
                  <div className="series-post-info">
                    <h3 className="series-post-title">{item.post.title}</h3>
                    {item.post.excerpt && (
                      <p className="series-post-summary">{item.post.excerpt}</p>
                    )}
                    <div className="series-post-meta">
                      <span className="series-post-date">
                        {new Date(item.post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                      <span className="series-post-views">조회 {item.post.view_count}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export { SeriesPostList };
