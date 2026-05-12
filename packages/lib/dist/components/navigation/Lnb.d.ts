/**
 * Lnb (Left Navigation Bar) Component - KOMCA 패턴
 *
 * lnbItems만 받고 내부에서 navigate 처리
 */
import React from 'react';
import { LnbMenuItem } from '../../types';
export type { LnbMenuItem } from '../../types';
export interface LnbProps {
    lnbItems: LnbMenuItem[];
    title?: string;
    appName?: string;
    logo?: React.ReactNode;
}
export declare const Lnb: React.FC<LnbProps>;
export default Lnb;
//# sourceMappingURL=Lnb.d.ts.map