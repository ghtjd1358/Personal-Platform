import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PREFIX } from '@/config/constants'
import { RoutePath } from './paths'

const HomePage = lazy(() => import('../home/HomePage'))
const ResumeBrowsePage = lazy(() => import('../resumes/ResumeBrowsePage'))
const ResumeDetailPage = lazy(() => import('../resumes/ResumeDetailPage'))
const UserResumePage = lazy(() => import('../resumes/UserResumePage'))
const MyPage = lazy(() => import('../mypage/MyPage'))
const ResumeEditorPage = lazy(() => import('../mypage/ResumeEditorPage'))
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
                {/* 메인 페이지 = 이력서 랜딩 페이지 */}
                <Route path="/" element={<HomePage />} />
                {PREFIX && <Route path={PREFIX} element={<HomePage />} />}

                {/* 이력서 둘러보기 (공개) */}
                <Route path={`${PREFIX}${RoutePath.Resumes}`} element={<ResumeBrowsePage />} />
                <Route path={`${PREFIX}${RoutePath.ResumeDetail}`} element={<ResumeDetailPage />} />

                {/* 개인 이력서 페이지 (user_id로 조회) */}
                <Route path={`${PREFIX}${RoutePath.UserResume}`} element={<UserResumePage />} />

                {/* 마이페이지 (로그인 필요) */}
                <Route path={`${PREFIX}${RoutePath.MyPage}`} element={<MyPage />} />
                <Route path={`${PREFIX}${RoutePath.MyPageWrite}`} element={<ResumeEditorPage />} />
                <Route path={`${PREFIX}${RoutePath.MyPageEdit}`} element={<ResumeEditorPage />} />

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

                <Route path="*" element={<HomePage />} />
            </Routes>
        </Suspense>
    )
}

export { RoutesAuthPages }
