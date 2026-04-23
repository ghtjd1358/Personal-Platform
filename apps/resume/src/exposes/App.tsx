import React, { Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '@sonhoseong/mfa-lib'
import {RoutesAuthPages, RoutesGuestPages} from "@/pages/routes";
import '../styles/global.css'

function App() {
    const accessToken = useSelector(selectAccessToken)
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])

    return (
        <Suspense fallback="">
            {!isAuthenticated && <RoutesGuestPages />}
            {isAuthenticated && <RoutesAuthPages />}
        </Suspense>
    )
}

export default App
