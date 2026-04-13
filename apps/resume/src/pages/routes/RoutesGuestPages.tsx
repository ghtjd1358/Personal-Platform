import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '@sonhoseong/mfa-lib'
import { PREFIX } from '@/config/constants'

const ResumeBrowsePage = lazy(() => import('../resumes/ResumeBrowsePage'))
const ResumeDetailPage = lazy(() => import('../resumes/ResumeDetailPage'))
const UserResumePage = lazy(() => import('../resumes/UserResumePage'))

const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="spinner-large" />
    </div>
)

function RoutesGuestPages() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* 메인 페이지 = 공개 이력서 목록 */}
                <Route path="/" element={<ResumeBrowsePage />} />
                {PREFIX && <Route path={PREFIX} element={<ResumeBrowsePage />} />}

                {/* 이력서 둘러보기 (공개) */}
                <Route path={`${PREFIX}/resumes`} element={<ResumeBrowsePage />} />
                <Route path={`${PREFIX}/resumes/:id`} element={<ResumeDetailPage />} />

                {/* 개인 이력서 페이지 (user_id로 조회) */}
                <Route path={`${PREFIX}/user/:userId`} element={<UserResumePage />} />

                {/* 로그인 필요한 페이지는 로그인으로 리다이렉트 */}
                <Route path={`${PREFIX}/login`} element={<LoginPage appName="이력서" redirectPath="/" />} />
                <Route path={`${PREFIX}/mypage`} element={<LoginPage appName="이력서" redirectPath="/" />} />
                <Route path={`${PREFIX}/mypage/*`} element={<LoginPage appName="이력서" redirectPath="/" />} />
                <Route path={`${PREFIX}/admin/*`} element={<LoginPage appName="이력서" redirectPath="/" />} />

                <Route path="*" element={<ResumeBrowsePage />} />
            </Routes>
        </Suspense>
    )
}

export { RoutesGuestPages }
