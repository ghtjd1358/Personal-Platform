/**
 * Skeleton — 재사용 가능한 로딩 placeholder primitive.
 *
 * 카드 리스트 같이 "쉘 구조는 있는데 데이터가 아직 없는" 상황에서 각 슬롯 자리에 끼워 넣음.
 * editorial dialect 에 맞춘 한지/먹 톤 shimmer 애니메이션 (linear-gradient slide).
 *
 * ## 사용
 *   <Skeleton width="100%" height={200} />              // 카드 썸네일
 *   <Skeleton variant="text" width="60%" />             // 한 줄 텍스트
 *   <Skeleton variant="circle" width={32} height={32} /> // 아바타
 *
 * 여러 개를 조합해서 구체 카드 shape 을 그리는 방식 (예: PostCardSkeleton).
 */
import React from 'react';

type Variant = 'text' | 'rect' | 'circle';

interface SkeletonProps {
    variant?: Variant;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

let keyframesInjected = false;
const injectKeyframes = () => {
    if (typeof document === 'undefined' || keyframesInjected) return;
    keyframesInjected = true;
    const style = document.createElement('style');
    style.setAttribute('data-mfa-skeleton', '');
    style.textContent = `
@keyframes mfaSkeletonShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.mfa-skeleton {
    display: inline-block;
    background: linear-gradient(
        90deg,
        rgba(43, 30, 20, 0.05) 0%,
        rgba(43, 30, 20, 0.12) 50%,
        rgba(43, 30, 20, 0.05) 100%
    );
    background-size: 200% 100%;
    animation: mfaSkeletonShimmer 1.4s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
    .mfa-skeleton { animation: none; background: rgba(43, 30, 20, 0.08); }
}
`;
    document.head.appendChild(style);
};

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rect',
    width = '100%',
    height = 16,
    className = '',
    style,
}) => {
    injectKeyframes();

    const radius = variant === 'circle' ? '50%' : variant === 'text' ? '3px' : '4px';

    return (
        <span
            className={`mfa-skeleton ${className}`.trim()}
            aria-hidden
            style={{
                width,
                height,
                borderRadius: radius,
                ...style,
            }}
        />
    );
};

export default Skeleton;
