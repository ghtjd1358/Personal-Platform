/**
 * ExperienceListPage — 통합 "경력 & 프로젝트" 관리.
 * - 경력 (experiences 테이블)
 * - 프로젝트 (portfolios 테이블, resume_id 필터)
 * 두 섹션을 같은 페이지에서 나란히 CRUD.
 */
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useToast, useAsyncConfirm, usePermission } from '@sonhoseong/mfa-lib'
import { experiencesApi, portfoliosApi } from '../../../network'
import type { Experience, Portfolio } from '../../../network/apis/types'
import { LINK_PREFIX } from '@/config/constants'
import './ExperienceList.editorial.css'

const formatPeriod = (start: string | null, end: string | null, isCurrent: boolean) => {
    const s = start ? start.slice(0, 7) : '?'
    if (isCurrent) return `${s} ~ 현재`
    return `${s} ~ ${end ? end.slice(0, 7) : '?'}`
}

const ExperienceListPage: React.FC = () => {
    const toast = useToast()
    const confirmDialog = useAsyncConfirm()
    const { canEditResource } = usePermission()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('resumeId')

    const [experiences, setExperiences] = useState<Experience[]>([])
    const [projects, setProjects] = useState<Portfolio[]>([])
    const [loading, setLoading] = useState(true)

    const withResumeId = useCallback(
        (path: string) => (resumeId ? `${path}?resumeId=${resumeId}` : path),
        [resumeId],
    )

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const [expResp, projResp] = await Promise.all([
            resumeId ? experiencesApi.getByResumeId(resumeId) : experiencesApi.getAll(),
            resumeId ? portfoliosApi.getByResumeId(resumeId) : portfoliosApi.getAll(),
        ])
        if (expResp.data) setExperiences(expResp.data)
        if (expResp.error) console.error('[ExperienceList] exp fetch', expResp.error)
        if (projResp.data) setProjects(projResp.data)
        if (projResp.error) console.error('[ExperienceList] proj fetch', projResp.error)
        setLoading(false)
    }, [resumeId])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    const handleDeleteExperience = async (exp: Experience) => {
        const ok = await confirmDialog(`"${exp.company}" 경력을 삭제할까요?`, '경력 삭제')
        if (!ok) return
        const { error } = await experiencesApi.delete(exp.id)
        if (error) toast.error('삭제 실패: ' + (error.message || '알 수 없는 오류'))
        else {
            toast.success('삭제되었어요.')
            fetchAll()
        }
    }

    const handleDeleteProject = async (proj: Portfolio) => {
        const ok = await confirmDialog(`"${proj.title}" 프로젝트를 삭제할까요?`, '프로젝트 삭제')
        if (!ok) return
        const { error } = await portfoliosApi.delete(proj.id)
        if (error) toast.error('삭제 실패: ' + (error.message || '알 수 없는 오류'))
        else {
            toast.success('삭제되었어요.')
            fetchAll()
        }
    }

    if (loading) {
        return (
            <div className="admin-list-page exp-admin">
                <div className="exp-admin-loading">불러오는 중…</div>
            </div>
        )
    }

    return (
        <div className="admin-list-page exp-admin">
            <header className="admin-page-header exp-admin-header">
                <div>
                    {resumeId && (
                        <Link to={`${LINK_PREFIX}/mypage/${resumeId}`} className="exp-admin-back">
                            ← 이력서로 돌아가기
                        </Link>
                    )}
                    <h1 className="exp-admin-title">경력 & 프로젝트 관리</h1>
                    <p className="exp-admin-sub">이력서 홈에 표시되는 경력과 프로젝트를 여기서 추가·수정·삭제합니다.</p>
                </div>
            </header>

            {/* ===== 경력 섹션 ===== */}
            <section className="exp-section">
                <header className="exp-section-header">
                    <div className="exp-section-title-wrap">
                        <span className="exp-section-eyebrow">SECTION · EXPERIENCE</span>
                        <h2 className="exp-section-title">경력</h2>
                    </div>
                    <Link
                        to={withResumeId(`${LINK_PREFIX}/admin/experience/new`)}
                        className="exp-btn exp-btn--primary"
                    >
                        + 경력 추가
                    </Link>
                </header>

                {experiences.length === 0 ? (
                    <div className="exp-empty">
                        <p className="exp-empty-title">등록된 경력이 없습니다.</p>
                        <Link
                            to={withResumeId(`${LINK_PREFIX}/admin/experience/new`)}
                            className="exp-btn exp-btn--ghost"
                        >
                            경력 추가하기
                        </Link>
                    </div>
                ) : (
                    <ul className="exp-list">
                        {experiences.map((exp) => (
                            <li key={exp.id} className="exp-row">
                                <div className="exp-row-main">
                                    <div className="exp-row-title">
                                        {exp.company}
                                        <span className={`exp-badge ${exp.is_dev ? '' : 'exp-badge--muted'}`}>
                                            {exp.is_dev ? '개발' : '비개발'}
                                        </span>
                                    </div>
                                    <div className="exp-row-sub">{exp.position}</div>
                                    <div className="exp-row-meta">
                                        {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                                    </div>
                                </div>
                                <div className="exp-row-actions">
                                    {canEditResource(exp.user_id) ? (
                                        <>
                                            <Link
                                                to={withResumeId(`${LINK_PREFIX}/admin/experience/edit/${exp.id}`)}
                                                className="exp-icon-btn"
                                                title="수정"
                                                aria-label="수정"
                                            >
                                                ✎
                                            </Link>
                                            <button
                                                type="button"
                                                className="exp-icon-btn exp-icon-btn--danger"
                                                onClick={() => handleDeleteExperience(exp)}
                                                title="삭제"
                                                aria-label="삭제"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to={withResumeId(`${LINK_PREFIX}/admin/experience/edit/${exp.id}`)}
                                            className="exp-icon-btn exp-icon-btn--locked"
                                            title="Owner 소유 — 열람만 가능"
                                            aria-label="열람만 가능"
                                        >
                                            🔒
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* ===== 프로젝트 섹션 — /admin/portfolio 로 delegate ===== */}
            <section className="exp-section">
                <header className="exp-section-header">
                    <div className="exp-section-title-wrap">
                        <span className="exp-section-eyebrow">SECTION · PROJECTS</span>
                        <h2 className="exp-section-title">프로젝트</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                            to={`${LINK_PREFIX}/admin/portfolio`}
                            className="exp-btn exp-btn--ghost"
                            title="전체 포트폴리오 관리 페이지로"
                        >
                            전체 포폴 관리 →
                        </Link>
                        <Link
                            to={`${LINK_PREFIX}/admin/portfolio/new?fromResume=1`}
                            className="exp-btn exp-btn--primary"
                        >
                            + 프로젝트 추가
                        </Link>
                    </div>
                </header>

                {projects.length === 0 ? (
                    <div className="exp-empty">
                        <p className="exp-empty-title">이력서에 연결된 프로젝트가 없습니다.</p>
                        <Link
                            to={`${LINK_PREFIX}/admin/portfolio/new?fromResume=1`}
                            className="exp-btn exp-btn--ghost"
                        >
                            프로젝트 추가하기
                        </Link>
                    </div>
                ) : (
                    <ul className="exp-list">
                        {projects.map((proj) => (
                            <li key={proj.id} className="exp-row">
                                <div className="exp-row-main">
                                    <div className="exp-row-title">{proj.title}</div>
                                    <div className="exp-row-sub">{proj.role}</div>
                                    <div className="exp-row-meta">
                                        {formatPeriod(proj.start_date, proj.end_date, proj.is_current)}
                                    </div>
                                </div>
                                <div className="exp-row-actions">
                                    {canEditResource(proj.user_id) ? (
                                        <>
                                            <Link
                                                to={`${LINK_PREFIX}/admin/portfolio/edit/${proj.id}`}
                                                className="exp-icon-btn"
                                                title="수정"
                                                aria-label="수정"
                                            >
                                                ✎
                                            </Link>
                                            <button
                                                type="button"
                                                className="exp-icon-btn exp-icon-btn--danger"
                                                onClick={() => handleDeleteProject(proj)}
                                                title="삭제"
                                                aria-label="삭제"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to={`${LINK_PREFIX}/admin/portfolio/edit/${proj.id}`}
                                            className="exp-icon-btn exp-icon-btn--locked"
                                            title="Owner 소유 — 열람만 가능"
                                            aria-label="열람만 가능"
                                        >
                                            🔒
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default ExperienceListPage
