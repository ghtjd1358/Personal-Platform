import React, { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { PREFIX } from '@/config/constants'
import { RoutePath } from './paths'

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
const ExperienceListPage = lazy(() => import('../admin/experience/ExperienceListPage'))
const ExperienceEditorPage = lazy(() => import('../admin/experience/ExperienceEditorPage'))
const ProjectsListPage = lazy(() => import('../admin/projects/ProjectsListPage'))
const ProjectsEditorPage = lazy(() => import('../admin/projects/ProjectsEditorPage'))

const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="spinner-large" />
    </div>
)

function RoutesAuthPages() {
    return (
        <Suspense fallback={<LoadingFallback />}>
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
                <Route path={`${PREFIX}${RoutePath.AdminSkillsNew}`} element={<SkillsListPage />} />
                <Route path={`${PREFIX}${RoutePath.AdminSkillsEdit}`} element={<SkillsListPage />} />

                {/* Experience */}
                <Route path={`${PREFIX}${RoutePath.AdminExperience}`} element={<ExperienceListPage />} />
                <Route path={`${PREFIX}${RoutePath.AdminExperienceNew}`} element={<ExperienceEditorPage />} />
                <Route path={`${PREFIX}${RoutePath.AdminExperienceEdit}`} element={<ExperienceEditorPage />} />

                {/* Projects */}
                <Route path={`${PREFIX}${RoutePath.AdminProjects}`} element={<ProjectsListPage />} />
                <Route path={`${PREFIX}${RoutePath.AdminProjectsNew}`} element={<ProjectsEditorPage />} />
                <Route path={`${PREFIX}${RoutePath.AdminProjectsEdit}`} element={<ProjectsEditorPage />} />

                <Route path="*" element={<Navigate to={PREFIX || '/'} replace />} />
            </Routes>
        </Suspense>
    )
}

export { RoutesAuthPages }
