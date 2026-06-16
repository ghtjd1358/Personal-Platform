import React from 'react';
import SectionEditButton from '../../../components/common/SectionEditButton';
import { FeatureCardSkeleton } from './FeatureCardSkeleton';
import { FeatureCard } from '../../../components/cards/FeatureCard';
import { resolveFeatureImage } from '@/assets/images/hero';

/**
 * Feature 카드는 DB row (image_url) 기반.
 * order_index 1~3 카드는 정적 자산으로 매핑(host/standalone 동일 동작 보장).
 * image_url 이 null 이고 매핑도 없으면 이미지 영역은 렌더 skip.
 */
interface FeatureItemLike {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  order_index?: number | null;
}

interface FeaturesSectionProps {
  features: FeatureItemLike[];
  /** true 이면서 features 비어있을 때 skeleton 6개 렌더. */
  isLoading?: boolean;
}

const SKELETON_COUNT = 6;

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, isLoading = false }) => {
  const showSkeleton = isLoading && features.length === 0;

  return (
    <section id="core-summary" className="section features">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">핵심 역량</div>
          <h2 className="section-title">이런 개발자입니다</h2>
        </div>
        <div className="feature-grid">
          {showSkeleton
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <FeatureCardSkeleton key={`skeleton-${i}`} />
              ))
            : features.map((feature, index) => {
                const imageSrc = resolveFeatureImage(feature.order_index, feature.image_url);
                return (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    imageSrc={imageSrc}
                    index={index}
                  />
                );
              })}
        </div>
        <div className="section-edit-row">
          <SectionEditButton editPath="/admin/features" label="핵심 역량 편집" />
        </div>
      </div>
    </section>
  );
};
