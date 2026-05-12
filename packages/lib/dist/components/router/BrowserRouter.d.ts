/**
 * Custom BrowserRouter - KOMCA 패턴
 * history 객체를 받아서 사용
 */
import React from 'react';
import type { BrowserHistory } from 'history';
interface BrowserRouterProps {
    history: BrowserHistory;
    children: React.ReactNode;
}
export declare const BrowserRouter: React.FC<BrowserRouterProps>;
export default BrowserRouter;
//# sourceMappingURL=BrowserRouter.d.ts.map