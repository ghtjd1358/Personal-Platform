import React from 'react';
import SectionEditButton from '../../../components/common/SectionEditButton';
import { FeatureCardSkeleton } from './FeatureCardSkeleton';
import reactImg from '@/assets/images/hero/react.webp';
import optimizationImg from '@/assets/images/hero/optimization.webp';
import teamworkImg from '@/assets/images/hero/teamwork.webp';

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

const FEATURE_IMAGE_BY_ORDER: Record<number, string> = {
  1: reactImg,
  2: optimizationImg,
  3: teamworkImg,
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, isLoading = false }) => {
  const showSkeleton = isLoading && features.length === 0;

  return (
    <section className="section features">
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
                const mappedImage = feature.order_index
                  ? FEATURE_IMAGE_BY_ORDER[feature.order_index]
                  : undefined;
                const imageSrc = mappedImage ?? feature.image_url;
                return (
                  <div
                    /* key 를 index 로 — mock('react')→DB(uuid) fetch 교체 시 React 가
                       동일 컴포넌트로 보고 re-mount 하지 않음 → scroll animation 재트리거 방지. */
                    key={index}
                    className={`feature-card animate-on-scroll delay-${index + 1}`}
                  >
                    {imageSrc && (
                      <div className="feature-image">
                        <img src={imageSrc} alt={feature.title} />
                      </div>
                    )}
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.description}</p>
                  </div>
                );
              })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <SectionEditButton editPath="/admin/features" label="핵심 역량 편집" />
        </div>
      </div>
    </section>
  );
};
