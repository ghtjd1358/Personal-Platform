/**
 * PortfolioCardSkeleton — Portfolio HomePage insta-grid 카드 쉐입 placeholder.
 *
 * `.insta-grid-card > .insta-grid-image + .insta-grid-info` 구조를 그대로 맞춰
 * shimmer 상태에서도 그리드 비율(AOS fade-up 전제) 이 틀어지지 않음.
 */
import React from 'react';
import { Skeleton } from '@sonhoseong/mfa-lib';

const PortfolioCardSkeleton: React.FC = () => {
    return (
        <article className="insta-grid-card insta-grid-card--skeleton" aria-hidden>
            <div className="insta-grid-image">
                <Skeleton width="100%" height="100%" style={{ display: 'block' }} />
            </div>
            <div className="insta-grid-info">
                <Skeleton variant="text" width={70} height={11} style={{ display: 'block', marginBottom: 8 }} />
                <Skeleton variant="text" width="75%" height={18} style={{ display: 'block', marginBottom: 8 }} />
                <Skeleton variant="text" width="100%" height={12} style={{ display: 'block', marginBottom: 10 }} />
                <div className="insta-grid-meta" style={{ display: 'flex', gap: 12 }}>
                    <Skeleton variant="text" width={36} height={12} />
                    <Skeleton variant="text" width={36} height={12} />
                </div>
            </div>
        </article>
    );
};

export default PortfolioCardSkeleton;
