import React, { lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { PREFIX } from '@/config/constants'
import { RoutePath } from './paths'
// admin 전용 CSS — 이 파일은 로그인 사용자 라우트 전체를 담당하므로 로그인 후에만 로드.
// 완전 lazy 하게 하려면 각 admin page 파일에 분산해야 하지만 8 파일 중복 회피로 여기 묶음.
import '@/styles/admin.css'

// 홈 페이지 (포트폴리오 소개)
const HomePage = lazy(() => import('../home/HomePage'))

// 이력서 둘러보기 (공개)
const ResumeBrowsePage = lazy(() => import('../resumes/ResumeBrowsePage'))
const ResumeDetailPage = lazy(() => import('../resumes/ResumeDetailPage'))
const UserResumePage = lazy(() => import('../resumes/UserResumePage'))

// 마이페이지 (다중 이력서 관리)
const MyResumesPage = lazy(() => import('../mypage/MyResumesPage'))
const MyResumeDetailPage = lazy(() => import('../mypage/MyResumeDetailPage'))
const ResumeEditorPage = lazy(() => import('../mypage/ResumeEditorPage'))

// 관리자 페이지
const SkillsListPage = lazy(() => import('../admin/skills/SkillsListPage'))
const SkillsEditorPage = lazy(() => import('../admin/skills/SkillsEditorPage'))
const ExperienceListPage = lazy(() => import('../admin/experience/ExperienceListPage'))
const ExperienceEditorPage = lazy(() => import('../admin/experience/ExperienceEditorPage'))
const PortfolioListPage = lazy(() => import('../admin/projects/PortfolioListPage'))
const ProjectsEditorPage = lazy(() => import('../admin/projects/ProjectsEditorPage'))
const FeaturesListPage = lazy(() => import('../admin/features/FeaturesListPage'))
const FeaturesEditorPage = lazy(() => import('../admin/features/FeaturesEditorPage'))

function RoutesAuthPages() {
    return (
        <Routes>
            {/* 메인 페이지 = 포트폴리오 홈 (이력서는 /resumes, 본인 이력서는 /mypage) */}
            <Route path="/" element={<HomePage />} />
            {PREFIX && <Route path={PREFIX} element={<HomePage />} />}

            {/* 이력서 둘러보기 (공개) */}
            <Route path={`${PREFIX}${RoutePath.Resumes}`} element={<ResumeBrowsePage />} />
            <Route path={`${PREFIX}${RoutePath.ResumeDetail}`} element={<ResumeDetailPage />} />

            {/* 개인 이력서 페이지 (user_id로 조회 - 대표 이력서) */}
            <Route path={`${PREFIX}${RoutePath.UserResume}`} element={<UserResumePage />} />

            {/* 마이페이지 - 다중 이력서 관리 (로그인 필요) */}
            <Route path={`${PREFIX}${RoutePath.MyResumes}`} element={<MyResumesPage />} />
            <Route path={`${PREFIX}${RoutePath.MyResumeCreate}`} element={<ResumeEditorPage />} />
            <Route path={`${PREFIX}${RoutePath.MyResumeDetail}`} element={<MyResumeDetailPage />} />
            <Route path={`${PREFIX}${RoutePath.MyResumeEdit}`} element={<ResumeEditorPage />} />

            {/* Skills */}
            <Route path={`${PREFIX}${RoutePath.AdminSkills}`} element={<SkillsListPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminSkillsNew}`} element={<SkillsEditorPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminSkillsEdit}`} element={<SkillsEditorPage />} />

            {/* Experience */}
            <Route path={`${PREFIX}${RoutePath.AdminExperience}`} element={<ExperienceListPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminExperienceNew}`} element={<ExperienceEditorPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminExperienceEdit}`} element={<ExperienceEditorPage />} />

            {/* Portfolio — 전체 포폴(이력서 연결 + 전용) 통합 admin */}
            <Route path={`${PREFIX}${RoutePath.AdminPortfolio}`} element={<PortfolioListPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminPortfolioNew}`} element={<ProjectsEditorPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminPortfolioEdit}`} element={<ProjectsEditorPage />} />

            {/* Projects — legacy alias, 새 URL 로 redirect */}
            <Route path={`${PREFIX}${RoutePath.AdminProjects}`} element={<PortfolioListPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminProjectsNew}`} element={<ProjectsEditorPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminProjectsEdit}`} element={<ProjectsEditorPage />} />

            {/* Features — "이런 개발자입니다" 카드 CRUD */}
            <Route path={`${PREFIX}${RoutePath.AdminFeatures}`} element={<FeaturesListPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminFeaturesNew}`} element={<FeaturesEditorPage />} />
            <Route path={`${PREFIX}${RoutePath.AdminFeaturesEdit}`} element={<FeaturesEditorPage />} />

            <Route path="*" element={<Navigate to={PREFIX || '/'} replace />} />
        </Routes>
    );
}

export { RoutesAuthPages }
