import React from 'react';
import { reactImg, optimizationImg, teamworkImg } from '../../../assets/images';
import SectionEditButton from '../../../components/common/SectionEditButton';

// legacy mock id → asset 매핑 (DB 로 갈아타기 전 fallback 용)
const featureImages: Record<string, string> = {
  react: reactImg,
  architecture: optimizationImg,
  teamwork: teamworkImg,
};

// DB row 의 title 이 mock 시리즈와 같을 때 asset 을 자동 매칭 — seed 3건에 image_url
// 이 null 일 때도 이미지가 사라지지 않도록 하는 안전망.
const titleImages: Record<string, string> = {
  'React 기반 개발': reactImg,
  '최적화 및 아키텍처 설계': optimizationImg,
  '커뮤니케이션 및 협업': teamworkImg,
};

/**
 * Feature 카드는 DB row (image_url) 또는 mock(id → asset) 둘 다 받아야 해서
 * shape 를 느슨하게 둔다. 이미지 해석 순서:
 *   1) image_url (Supabase Storage public URL) — 실제 업로드된 이미지
 *   2) featureImages[id]   — mock seed (id: 'react' / 'architecture' / 'teamwork')
 *   3) titleImages[title]  — DB seed 3건처럼 id 는 uuid 지만 title 이 mock 시리즈
 *   4) feature.image       — mock 구 형식 호환
 *   5) 없으면 이미지 요소 자체 렌더 skip
 */
interface FeatureItemLike {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  image?: string;
}

interface FeaturesSectionProps {
  features: FeatureItemLike[];
}

const resolveImage = (feature: FeatureItemLike): string | null => {
  if (feature.image_url) return feature.image_url;
  if (featureImages[feature.id]) return featureImages[feature.id];
  if (titleImages[feature.title]) return titleImages[feature.title];
  if (feature.image) return feature.image;
  return null;
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className="section features">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">핵심 역량</div>
          <h2 className="section-title">이런 개발자입니다</h2>
          <SectionEditButton editPath="/admin/features" label="핵심 역량 편집" />
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => {
            const src = resolveImage(feature);
            return (
              <div
                /* key 를 index 로 — mock('react')→DB(uuid) fetch 교체 시 React 가
                   동일 컴포넌트로 보고 re-mount 하지 않음 → scroll animation 재트리거 방지.
                   ("이런 개발자입니다" 섹션이 스크롤 중 다시 튀어오르던 버그) */
                key={index}
                className={`feature-card animate-on-scroll delay-${index + 1}`}
              >
                {src && (
                  <div className="feature-image">
                    <img src={src} alt={feature.title} />
                  </div>
                )}
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
