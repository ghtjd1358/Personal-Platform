/**
 * ProjectCardSkeleton — HomePage `주요 작업물` 카드 그리드용 쉐입 placeholder.
 * 실제 `.card22` 와 동일 outer 를 유지해서 데이터 도착 시 카드가 제자리에 swap-in.
 */
import React from 'react';
import { Skeleton } from '@sonhoseong/mfa-lib';

const ProjectCardSkeleton: React.FC = () => {
    return (
        <div className="card22 card22--skeleton" aria-hidden>
            <div className="card-body22">
                <Skeleton variant="text" width="65%" height={22} className="skeleton-block--mb-14" />
                <div className="card-desc22-wrapper">
                    <Skeleton variant="text" width="100%" height={13} className="skeleton-block--mb-6" />
                    <Skeleton variant="text" width="100%" height={13} className="skeleton-block--mb-6" />
                    <Skeleton variant="text" width="80%" height={13} className="skeleton-block" />
                </div>
                <div className="card-tags22 card-tags22--skeleton">
                    <Skeleton variant="text" width={58} height={20} />
                    <Skeleton variant="text" width={72} height={20} />
                    <Skeleton variant="text" width={50} height={20} />
                </div>
            </div>
        </div>
    );
};

export { ProjectCardSkeleton };
