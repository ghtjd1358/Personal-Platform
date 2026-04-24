/**
 * PostCardSkeleton — PostCard 쉐입 그대로 본뜬 loading placeholder.
 *
 * PostsSection 에서 `isLoading && posts.length === 0` 때 8개 정도 렌더링.
 * 실제 PostCard 와 동일한 `.post-card` + `.post-card-thumbnail` + `.post-card-body` 계층
 * 구조를 유지해서 CSS 그리드 레이아웃(`.blog-grid`) 슬롯이 유지되고 데이터 도착 시
 * "쉘은 그대로, 내부만 바뀜" 의 자연스러운 전환이 일어남.
 *
 * Skeleton primitive 는 lib 에서 import — 색/애니는 editorial 한지 톤으로 통일.
 */
import React from 'react';
import { Skeleton } from '@sonhoseong/mfa-lib';

const PostCardSkeleton: React.FC = () => {
    return (
        <article className="post-card post-card--skeleton" aria-hidden>
            <div className="post-card-link">
                <div className="post-card-thumbnail">
                    <Skeleton width="100%" height="100%" style={{ display: 'block' }} />
                </div>
                <div className="post-card-body">
                    <Skeleton variant="text" width="85%" height={22} style={{ marginBottom: 10, display: 'block' }} />
                    <Skeleton variant="text" width="100%" height={14} style={{ marginBottom: 6, display: 'block' }} />
                    <Skeleton variant="text" width="70%" height={14} style={{ marginBottom: 14, display: 'block' }} />
                    <Skeleton variant="text" width="40%" height={12} style={{ display: 'block' }} />
                </div>
            </div>
            <div className="post-card-footer">
                <div className="post-card-stats">
                    <Skeleton variant="text" width={36} height={12} />
                    <Skeleton variant="text" width={36} height={12} />
                </div>
            </div>
        </article>
    );
};

export { PostCardSkeleton };
