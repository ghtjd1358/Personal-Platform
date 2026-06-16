import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner, ErrorState } from '@sonhoseong/mfa-lib';
import { useSeriesDetail } from '@/hooks';
import { SeriesHeader, SeriesPostList } from './components';

const SeriesDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { series, isLoading, error } = useSeriesDetail(slug);

  if (isLoading) return <LoadingSpinner message="시리즈 로딩 중..." />;
  if (error || !series) return (
    <ErrorState
      message={error || '시리즈를 찾을 수 없습니다.'}
      backHref="/series"
      backLabel="목록으로 돌아가기"
    />
  );

  const publishedCount = series.posts.filter((p) => p.post.status === 'published').length;

  return (
    <div className="series-detail-page">
      <SeriesHeader series={series} postCount={publishedCount} />
      <SeriesPostList posts={series.posts} />
    </div>
  );
};

export default SeriesDetail;
