import React from 'react';
import { Card } from '@sonhoseong/mfa-lib';

/**
 * 핵심 역량 카드 — FeaturesSection 에서 사용.
 *
 * lib `Card` 베이스. 이미지는 페이지에서 미리 resolveFeatureImage 로 풀어 src 로 전달.
 * (assets 매핑은 도메인 로직 — 컴포넌트는 src 받기만 함)
 *
 * delay-N 애니메이션은 index 로 결정 — fetch 교체 시 React 가 동일 컴포넌트로 보고
 * re-mount 하지 않게 useFeatureSection / FeatureSection 의 key 는 index 유지.
 */
interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc?: string | null;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc, index }) => {
  return (
    <Card className={`feature-card animate-on-scroll delay-${index + 1}`}>
      {imageSrc && (
        <Card.Image src={imageSrc} alt={title} className="feature-image" />
      )}
      <Card.Body>
        <Card.Title className="feature-title">{title}</Card.Title>
        <Card.Description className="feature-desc">{description}</Card.Description>
      </Card.Body>
    </Card>
  );
};

export { FeatureCard };
export type { FeatureCardProps };
