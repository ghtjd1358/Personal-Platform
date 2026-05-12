import React from 'react';
export interface NavSection {
    id: string;
    label: string;
    icon?: React.ReactNode;
}
export interface StickyNavProps {
    sections: NavSection[];
    /** 스크롤 트리거 위치 (0-1, 기본 0.2) */
    triggerPoint?: number;
    /** 스크롤 오프셋 (기본 80) */
    scrollOffset?: number;
    /** 상단 고정 위치 (기본 20) */
    topPosition?: number;
    /** 로고 클릭 시 콜백 */
    onLogoClick?: () => void;
    /** 로고 표시 여부 */
    showLogo?: boolean;
    /** 커스텀 클래스 */
    className?: string;
    /** URL hash 업데이트 여부 (기본 false) */
    updateHash?: boolean;
}
export declare const StickyNav: React.FC<StickyNavProps>;
export default StickyNav;
//# sourceMappingURL=StickyNav.d.ts.map