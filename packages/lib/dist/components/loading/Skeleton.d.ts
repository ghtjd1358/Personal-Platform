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
export declare const Skeleton: React.FC<SkeletonProps>;
export default Skeleton;
//# sourceMappingURL=Skeleton.d.ts.map