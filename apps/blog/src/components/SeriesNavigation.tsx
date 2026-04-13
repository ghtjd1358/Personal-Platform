import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSeriesByPostId, getSeriesDetail } from '@/network';
import { LINK_PREFIX } from '@/config/constants';

interface SeriesPost {
  id: string;
  title: string;
  slug: string;
}

interface SeriesInfo {
  seriesId: string;
  seriesTitle: string;
  seriesSlug: string;
  posts: SeriesPost[];
  currentIndex: number;
}

interface SeriesNavigationProps {
  postId: string;
}

const SeriesNavigation: React.FC<SeriesNavigationProps> = ({ postId }) => {
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchSeriesInfo = async () => {
      try {
        // 1. 포스트가 속한 시리즈 조회
        const seriesRes = await getSeriesByPostId(postId);
        if (!seriesRes.success || !seriesRes.data || seriesRes.data.length === 0) {
          setLoading(false);
          return;
        }

        // 첫 번째 시리즈 사용 (하나의 포스트가 여러 시리즈에 속할 수 있음)
        const firstSeries = seriesRes.data[0];

        // 2. 시리즈 상세 정보 조회 (전체 포스트 목록 포함)
        const detailRes = await getSeriesDetail(firstSeries.slug);

        if (!detailRes.success || !detailRes.data) {
          setLoading(false);
          return;
        }

        const series = detailRes.data;
        const posts = (series.posts || [])
          .filter((p: any) => p.post && p.post.status === 'published')
          .map((p: any) => ({
            id: p.post.id,
            title: p.post.title,
            slug: p.post.slug || p.post.id,
          }));

        const currentIndex = posts.findIndex((p: SeriesPost) => p.id === postId);

        if (currentIndex === -1) {
          setLoading(false);
          return;
        }

        setSeriesInfo({
          seriesId: series.id,
          seriesTitle: series.title,
          seriesSlug: series.slug,
          posts,
          currentIndex,
        });
      } catch (err) {
        console.error('[SeriesNavigation] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesInfo();
  }, [postId]);

  if (loading || !seriesInfo || seriesInfo.posts.length <= 1) {
    return null;
  }

  const { seriesTitle, seriesSlug, posts, currentIndex } = seriesInfo;
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="series-navigation">
      <div className="series-nav-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="series-nav-info">
          <span className="series-nav-label">시리즈</span>
          <Link
            to={`${LINK_PREFIX}/series/${seriesSlug}`}
            className="series-nav-title"
            onClick={(e) => e.stopPropagation()}
          >
            {seriesTitle}
          </Link>
          <span className="series-nav-count">
            {currentIndex + 1} / {posts.length}
          </span>
        </div>
        <button className={`series-nav-toggle ${isExpanded ? 'expanded' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="series-nav-list">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`${LINK_PREFIX}/post/${post.slug}`}
              className={`series-nav-item ${index === currentIndex ? 'current' : ''}`}
            >
              <span className="series-nav-index">{index + 1}</span>
              <span className="series-nav-post-title">{post.title}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="series-nav-buttons">
        {prevPost ? (
          <Link to={`${LINK_PREFIX}/post/${prevPost.slug}`} className="series-nav-btn prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <div className="series-nav-btn-content">
              <span className="series-nav-btn-label">이전 글</span>
              <span className="series-nav-btn-title">{prevPost.title}</span>
            </div>
          </Link>
        ) : (
          <div className="series-nav-btn disabled"></div>
        )}

        {nextPost ? (
          <Link to={`${LINK_PREFIX}/post/${nextPost.slug}`} className="series-nav-btn next">
            <div className="series-nav-btn-content">
              <span className="series-nav-btn-label">다음 글</span>
              <span className="series-nav-btn-title">{nextPost.title}</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        ) : (
          <div className="series-nav-btn disabled"></div>
        )}
      </div>
    </div>
  );
};

export { SeriesNavigation };
