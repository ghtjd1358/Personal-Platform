import React from 'react';
import { Card, resolveIcon } from '@sonhoseong/mfa-lib';
import type { PortfolioTag } from '@/types';

/**
 * Timeline 카드 — 경력/프로젝트 timeline 항목의 우측 콘텐츠 박스 (.timeline-content).
 *
 * 외부 timeline-item 의 좌측 timeline-date(period, badge) 는 페이지에 남김 —
 * 이 컴포넌트는 우측 본문 (회사/직무, 기술 아이콘, 작업 토글) 부분만 캡슐화.
 *
 * tags 가 string[] 인 케이스 (Mypage / Public Detail — DB raw tags 컬럼) 와
 * PortfolioTag[] 인 케이스 (HomePage ExperienceSection — JOIN 결과) 둘 다 받기 위해 union.
 *  - PortfolioTag: skills 와 JOIN → iconKey/iconColor 기반 resolveIcon
 *  - string: 단순 키 → techIconMap fallback
 *
 * children 슬롯에 tasks 토글 등 페이지별 가변 영역을 끼워 넣는다.
 */
interface TimelineCardProps {
  title: string;
  subtitle: string;
  /** 헤드라인 + 컨텍스트 문단. `\n\n` 로 paragraph 구분 — 첫 문단은 강조, 나머지는 본문. */
  description?: string | null;
  tags?: PortfolioTag[] | string[];
  className?: string;
  children?: React.ReactNode;
}

const isPortfolioTag = (tag: PortfolioTag | string): tag is PortfolioTag =>
  typeof tag === 'object' && tag !== null && 'name' in tag;

const TimelineCard: React.FC<TimelineCardProps> = ({
  title,
  subtitle,
  description,
  tags,
  className = '',
  children,
}) => {
  const hasTags = Array.isArray(tags) && tags.length > 0;
  const descParagraphs = description
    ? description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <Card className={`timeline-content ${className}`.trim()}>
      <Card.Body>
        <Card.Title as="h3">{title}</Card.Title>
        {subtitle && <Card.Description>{subtitle}</Card.Description>}
        {descParagraphs.length > 0 && (
          <div className="timeline-desc">
            {descParagraphs.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? 'timeline-desc-headline' : 'timeline-desc-body'}
              >
                {para}
              </p>
            ))}
          </div>
        )}
        {hasTags && (
          <Card.Tags className="timeline-tech-icons">
            {(tags as Array<PortfolioTag | string>).map((tag, index) => {
              if (isPortfolioTag(tag)) {
                const icon = resolveIcon(tag.iconKey, tag.iconColor) ?? resolveIcon(tag.name, tag.iconColor);
                return (
                  <div
                    className="tech-icon"
                    key={`tag-${index}-${tag.name}`}
                    data-tooltip={tag.name}
                  >
                    {icon ?? <span>{tag.name}</span>}
                  </div>
                );
              }
              return (
                <div className="tech-icon" key={`tag-${index}-${tag}`} data-tooltip={tag}>
                  {resolveIcon(tag) ?? <span>{tag}</span>}
                </div>
              );
            })}
          </Card.Tags>
        )}
        {children}
      </Card.Body>
    </Card>
  );
};

export { TimelineCard };
export type { TimelineCardProps };
