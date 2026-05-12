import React from 'react';
export interface LogoProps {
    /** 크기 프리셋 */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** 커스텀 크기 (중앙 아이콘 기준 px) */
    customSize?: number;
    /** ㅅ 색상 */
    sideColor?: string;
    /** ㅎ 색상 */
    centerColor?: string;
    /** 눈 색상 */
    eyeColor?: string;
    /** 호버 효과 활성화 */
    interactive?: boolean;
    /** 클릭 핸들러 */
    onClick?: () => void;
    /** 커스텀 클래스 */
    className?: string;
    /** 중앙 ㅎ만 표시 (사이드바 축소 모드용) */
    centerOnly?: boolean;
}
export declare const Logo: React.FC<LogoProps>;
export default Logo;
//# sourceMappingURL=Logo.d.ts.map