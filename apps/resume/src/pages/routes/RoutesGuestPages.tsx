import React, { lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { PREFIX } from '@/config/constants'

const HomePage = lazy(() => import('../home/HomePage'))

/**
 * Standalone(remote1 단독 실행) 라우트 — 로그인 개념 없음.
 * 한 사람의 공개 포트폴리오/이력서만 노출. 편집/관리 기능은 host 모드 전용.
 * 모든 unknown URL 은 홈으로 fallback → 사용자는 단 하나의 뷰만 봄.
 */
function RoutesGuestPages() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            {PREFIX && <Route path={PREFIX} element={<HomePage />} />}
            <Route path="*" element={<Navigate to={PREFIX || '/'} replace />} />
        </Routes>
    )
}

export { RoutesGuestPages }
