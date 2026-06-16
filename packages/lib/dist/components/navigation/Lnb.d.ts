import React from 'react';
import { LnbMenuItem } from '../../types';
export type { LnbMenuItem } from '../../types';
export interface LnbProps {
    lnbItems: LnbMenuItem[];
    title?: string;
    appName?: string;
    logo?: React.ReactNode;
    onLogout?: () => void;
}
export declare const Lnb: React.FC<LnbProps>;
export default Lnb;
//# sourceMappingURL=Lnb.d.ts.map