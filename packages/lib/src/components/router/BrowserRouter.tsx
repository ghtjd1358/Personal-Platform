/**
 * Custom BrowserRouter - KOMCA 패턴
 * history 객체를 받아서 사용
 */
import React, { useLayoutEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import type { BrowserHistory } from 'history'

interface BrowserRouterProps {
    history: BrowserHistory
    children: React.ReactNode
}

export const BrowserRouter: React.FC<BrowserRouterProps> = ({ history, children }) => {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    })

    useLayoutEffect(() => {
        return history.listen(setState)
    }, [history])

    return (
        <Router
            location={state.location}
            navigationType={state.action}
            navigator={history}
        >
            {children}
        </Router>
    )
}

export default BrowserRouter
