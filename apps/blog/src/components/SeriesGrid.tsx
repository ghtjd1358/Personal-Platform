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
        <div className="section-header animate-on-scroll">
          <div className="section-label">SERIES · 묶어 읽는 글</div>
        </div>

        <div className="blog-series-grid">
          {series.length === 0 ? (
            // 시리즈 없을 때 — useFetchSeries 가 이미 GlobalLoading 트리거하므로 별도 skeleton 안 깔고 empty-state 그대로 노출
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={`series-skeleton-${i}`} className="blog-series-card blog-series-card--skeleton" />
            ))
          ) : (
            series.map((item, index) => (
              <Link
                key={item.id}
                to={`${LINK_PREFIX}/series/${item.slug}`}
                className={`blog-series-card animate-on-scroll delay-${Math.min(index + 1, 5)}`}
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
