import React, { lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { LoginPage } from '@sonhoseong/mfa-lib'
import { PREFIX } from '@/config/constants'

const HomePage = lazy(() => import('../home/HomePage'))
const ResumeBrowsePage = lazy(() => import('../resumes/ResumeBrowsePage'))
const ResumeDetailPage = lazy(() => import('../resumes/ResumeDetailPage'))
const UserResumePage = lazy(() => import('../resumes/UserResumePage'))

function RoutesGuestPages() {
    return (
        <Routes>
            {/* 메인 페이지 = 포트폴리오 홈 */}
            <Route path="/" element={<HomePage />} />
            {PREFIX && <Route path={PREFIX} element={<HomePage />} />}

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

            <Route path="*" element={<Navigate to={PREFIX || '/'} replace />} />
        </Routes>
    )
}

export { RoutesGuestPages }
