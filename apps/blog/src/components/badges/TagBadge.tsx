import React from 'react';
import { Badge } from '@sonhoseong/mfa-lib';

/**
 * 블로그 태그 배지.
 *
 * - color 가 있으면 inline style override (DB 동적 색상) — 불가피한 케이스로 인라인 허용.
 * - active 토글 시 lib `Badge` variant 를 primary 로 스왑.
 * - onClick 이 있으면 클릭 가능한 chip 으로 동작.
 */
interface TagBadgeProps {
  name: string;
  color?: string | null;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  name,
  color,
  onClick,
  active = false,
  className = '',
}) => {
  const variant = active ? 'primary' : 'default';
  const dynamicStyle: React.CSSProperties | undefined = color && !active
    ? { background: color, color: '#fff', borderColor: color }
    : undefined;

  const badge = (
    <Badge
      variant={variant}
      className={`blog-tag-badge ${active ? 'blog-tag-badge--active' : ''} ${className}`.trim()}
      style={dynamicStyle}
    >
      {name}
    </Badge>
  );

  if (!onClick) return badge;

  return (
    <button
      type="button"
      className="blog-tag-badge-button"
      onClick={onClick}
      aria-pressed={active}
    >
      {badge}
    </button>
  );
};

export { TagBadge };
export type { TagBadgeProps };
