/**
 * RoutesGuestPages - 비로그인 사용자용 라우트 (단순화)
 */
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';

function RoutesGuestPages() {
    return (
        <Routes>
            <Route path={RoutePath.Login} element={<LoginPage appName="Portfolio" redirectPath="/dashboard" showTestAccount={true}/>}/>
            <Route path="*" element={<Navigate to={RoutePath.Login} replace />} />
        </Routes>
    );
}

export { RoutesGuestPages };
