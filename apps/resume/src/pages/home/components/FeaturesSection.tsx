import React from 'react';
import { reactImg, optimizationImg, teamworkImg } from '../../../assets/images';
import { FeatureItem } from '../../../data';

// 이미지 매핑 (id -> 이미지)
const featureImages: Record<string, string> = {
  react: reactImg,
  architecture: optimizationImg,
  teamwork: teamworkImg,
};

interface FeaturesSectionProps {
  features: FeatureItem[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className="section features">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">핵심 역량</div>
          <h2 className="section-title">이런 개발자입니다</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-card animate-on-scroll delay-${index + 1}`}
            >
              <div className="feature-image">
                <img
                  src={featureImages[feature.id] || feature.image}
                  alt={feature.title}
                />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
