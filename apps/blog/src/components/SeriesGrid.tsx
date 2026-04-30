import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchSeries } from '@/network/hooks';
import { LINK_PREFIX } from '@/config/constants';
import './SeriesGrid.editorial.css';

const SKELETON_COUNT = 6;

const SeriesGrid: React.FC = () => {
  const { series } = useFetchSeries();
  const isLoading = series.length === 0; // 단순 휴리스틱: 빈 상태 = 초기 fetch 중 또는 진짜 빈 상태

  return (
    <section id="series" className="section">
      <div className="container">
        {/* animate-on-scroll 미사용 — 탭 전환으로 마운트되는 컴포넌트는
            BlogList 의 IntersectionObserver setup 시점을 놓쳐 opacity:0 으로 영영 가려짐. */}
        <div className="blog-series-grid">
          {series.length === 0 ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={`series-skeleton-${i}`} className="blog-series-card blog-series-card--skeleton" />
            ))
          ) : (
            series.map((item) => (
              <Link
                key={item.id}
                to={`${LINK_PREFIX}/series/${item.slug}`}
                className="blog-series-card"
              >
                <div className="blog-series-card-cover">
                  {item.cover_image ? (
                    <img src={item.cover_image} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="blog-series-card-cover--empty">
                      <span>{item.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="blog-series-card-body">
                  <h3 className="blog-series-card-title">{item.title}</h3>
                  {item.description && (
                    <p className="blog-series-card-desc">{item.description}</p>
                  )}
                  <span className="blog-series-card-count">
                    {item.posts?.length || 0}개의 글
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export { SeriesGrid };
