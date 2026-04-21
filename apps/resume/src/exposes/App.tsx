import React, { Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectAccessToken, storage } from '@sonhoseong/mfa-lib'
import { RoutesGuestPages, RoutesAuthPages } from '../pages/routes'
import { UserFloatingMenu } from '../components/UserFloatingMenu'
import '../styles/global.css'
import '../styles/admin.css'

// 라우트 로딩 fallback
const RouteFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
    }}>
        <div className="spinner-large" />
    </div>
)

function App() {
    const accessToken = useSelector(selectAccessToken)
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])

    return (
        <>
            <Suspense fallback={<RouteFallback />}>
                {!isAuthenticated && <RoutesGuestPages />}
                {isAuthenticated && <RoutesAuthPages />}
            </Suspense>
            {!storage.isHostApp() && <UserFloatingMenu />}
        </>
    )
}

export default App
