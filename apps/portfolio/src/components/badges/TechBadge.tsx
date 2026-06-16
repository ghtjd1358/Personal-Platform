import React from 'react';
import { Badge, resolveIcon } from '@sonhoseong/mfa-lib';

/**
 * 포트폴리오 기술 스택 배지.
 *
 * skills 테이블 row 의 icon(=key) / icon_color 매핑은 resolveIcon 으로 해결.
 * icon 키가 없으면 텍스트만 fallback.
 *
 * - PortfolioCard 의 .insta-grid-tech-chip 자리에 그대로 사용 가능.
 * - ProjectDetail / PortfolioEditorPage 에서도 재사용.
 */
interface TechBadgeProps {
  name: string;
  icon?: string | null;
  color?: string | null;
  className?: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ name, icon, color, className = '' }) => {
  const resolved = icon ? resolveIcon(icon, color || undefined) : null;
  return (
    <Badge variant="default" className={`tech-badge ${className}`.trim()}>
      {resolved && <span className="tech-badge__icon">{resolved}</span>}
      {name}
    </Badge>
  );
};

export { TechBadge };
export type { TechBadgeProps };
