/**
 * PageSkeleton — Remote app lazy import 동안 띄우는 풀-페이지 placeholder.
 *
 * editorial 톤(한지/먹)에 맞춘 pulse 애니메이션.
 * Suspense fallback 으로 사용 — 빈 fallback("")이 만들던 깜빡임 / CLS 를 줄인다.
 */
import React from 'react';
import './skeleton.css';

interface PageSkeletonProps {
    /** 헤더 라인 수 (기본 1) */
    headerLines?: number;
    /** 본문 카드 수 (기본 3) */
    bodyCards?: number;
    /** ARIA label — 스크린리더 안내 */
    label?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
    headerLines = 1,
    bodyCards = 3,
    label = '콘텐츠를 불러오는 중입니다',
}) => {
    return (
        <div className="page-skeleton" role="status" aria-live="polite" aria-label={label}>
            <div className="page-skeleton-hero">
                <div className="page-skeleton-eyebrow page-skeleton-pulse" />
                {Array.from({ length: headerLines }).map((_, i) => (
                    <div
                        key={i}
                        className="page-skeleton-title page-skeleton-pulse"
                        style={{ width: i === headerLines - 1 ? '60%' : '85%' }}
                    />
                ))}
                <div className="page-skeleton-sub page-skeleton-pulse" />
            </div>

            <div className="page-skeleton-grid">
                {Array.from({ length: bodyCards }).map((_, i) => (
                    <div key={i} className="page-skeleton-card">
                        <div className="page-skeleton-card-thumb page-skeleton-pulse" />
                        <div className="page-skeleton-card-line page-skeleton-pulse" />
                        <div
                            className="page-skeleton-card-line page-skeleton-pulse"
                            style={{ width: '70%' }}
                        />
                    </div>
                ))}
            </div>

            <span className="page-skeleton-sr-only">{label}</span>
        </div>
    );
};

export default PageSkeleton;
