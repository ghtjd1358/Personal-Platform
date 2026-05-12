/**
 * Header Component - KOMCA 패턴
 *
 * gnbItems만 받고 내부에서 navigate, logout 처리
 */
import React from 'react';
export interface GnbItem {
    id: string;
    title: string;
    path: string;
}
export interface HeaderProps {
    gnbItems: GnbItem[];
    appName?: string;
    logo?: React.ReactNode;
}
export declare const Header: React.FC<HeaderProps>;
export default Header;
//# sourceMappingURL=Header.d.ts.map