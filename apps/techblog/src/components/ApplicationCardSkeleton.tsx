/**
 * ApplicationCardSkeleton — TrackerPage 칸반 컬럼 카드 쉐입 placeholder.
 *
 * `.kanban-card > .kanban-card-company + .kanban-card-position` 구조 유지.
 * 각 컬럼 heading 아래 1~2개씩 끼워 넣어 "데이터 준비 중" 시그널.
 */
import React from 'react';
import { Skeleton } from '@sonhoseong/mfa-lib';

const ApplicationCardSkeleton: React.FC = () => {
    return (
        <div className="kanban-card kanban-card--skeleton" aria-hidden>
            <Skeleton variant="text" width="75%" height={14} style={{ display: 'block', marginBottom: 6 }} />
            <Skeleton variant="text" width="90%" height={12} style={{ display: 'block', marginBottom: 10 }} />
            <Skeleton variant="text" width="60%" height={10} style={{ display: 'block' }} />
        </div>
    );
};

export default ApplicationCardSkeleton;
