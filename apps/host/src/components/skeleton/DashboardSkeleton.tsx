/**
 * DashboardSkeleton — Dashboard chunk lazy load 중 띄우는 placeholder.
 *
 * Dashboard 의 hero / stats / channels 영역을 빈 박스로 흉내내서
 * layout shift(CLS) 를 최소화한다.
 */
import React from 'react';
import './skeleton.css';

const DashboardSkeleton: React.FC = () => {
    return (
        <div
            className="dashboard-skeleton"
            role="status"
            aria-live="polite"
            aria-label="대시보드를 불러오는 중입니다"
        >
            <section className="dashboard-skeleton-hero">
                <div className="page-skeleton-eyebrow page-skeleton-pulse" />
                <div
                    className="page-skeleton-title page-skeleton-pulse"
                    style={{ height: 36 }}
                />
                <div
                    className="page-skeleton-title page-skeleton-pulse"
                    style={{ width: '70%', height: 36 }}
                />
                <div className="page-skeleton-sub page-skeleton-pulse" />
            </section>

            <section className="dashboard-skeleton-stats">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="dashboard-skeleton-stat page-skeleton-pulse" />
                ))}
            </section>

            <section className="dashboard-skeleton-channels">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="dashboard-skeleton-channel page-skeleton-pulse" />
                ))}
            </section>

            <span className="page-skeleton-sr-only">대시보드를 불러오는 중입니다</span>
        </div>
    );
};

export default DashboardSkeleton;
