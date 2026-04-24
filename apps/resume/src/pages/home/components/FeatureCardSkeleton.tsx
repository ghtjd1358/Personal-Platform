/**
 * FeatureCardSkeleton — HomePage `핵심 역량` 카드 그리드용 쉐입 placeholder.
 *
 * 실제 `.feature-card` 와 동일 구조 (image + title + desc) 를 유지해 그리드 레이아웃
 * 칸 보존. `.animate-on-scroll delay-*` 클래스는 skeleton 에서 제거 — shimmer 만 돌게.
 */
import React from 'react';
import { Skeleton } from '@sonhoseong/mfa-lib';

const FeatureCardSkeleton: React.FC = () => {
    return (
        <div className="feature-card feature-card--skeleton" aria-hidden>
            <div className="feature-image">
                <Skeleton width="100%" height="100%" style={{ display: 'block' }} />
            </div>
            <Skeleton variant="text" width="70%" height={20} style={{ display: 'block', marginTop: 16, marginBottom: 10 }} />
            <Skeleton variant="text" width="100%" height={13} style={{ display: 'block', marginBottom: 6 }} />
            <Skeleton variant="text" width="85%" height={13} style={{ display: 'block' }} />
        </div>
    );
};

export { FeatureCardSkeleton };
