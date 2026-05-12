/**
 * 404 NotFound 컴포넌트
 * 존재하지 않는 페이지 접근 시 표시
 */
import React from 'react';
export interface NotFoundProps {
    /** 커스텀 타이틀 */
    title?: string;
    /** 커스텀 메시지 */
    message?: string;
    /** 홈 경로 */
    homePath?: string;
    /** 뒤로가기 버튼 표시 여부 */
    showBackButton?: boolean;
    /** 홈 버튼 표시 여부 */
    showHomeButton?: boolean;
}
export declare const NotFound: React.FC<NotFoundProps>;
export default NotFound;
//# sourceMappingURL=NotFound.d.ts.map