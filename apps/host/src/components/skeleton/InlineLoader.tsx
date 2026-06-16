/**
 * InlineLoader — 작은 인라인 로딩 indicator.
 *
 * MyPageGuard 처럼 가벼운 chunk 의 fallback 으로 쓰인다.
 * 풀-페이지 skeleton 보다 덜 부담스러운 1-line spinner.
 */
import React from 'react';
import './skeleton.css';

interface InlineLoaderProps {
    label?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({ label = '불러오는 중...' }) => {
    return (
        <div className="inline-loader" role="status" aria-live="polite">
            <span className="inline-loader-dot" />
            <span className="inline-loader-dot" />
            <span className="inline-loader-dot" />
            <span className="page-skeleton-sr-only">{label}</span>
        </div>
    );
};

export default InlineLoader;
