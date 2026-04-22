/**
 * PortfolioListPage — 포트폴리오 전체 관리 (= `/admin/portfolio`).
 * portfolios 테이블을 single source 로 삼고, 두 카테고리로 표시:
 *   (1) 이력서 연결 (resume_id = 내 대표 이력서)
 *   (2) 포폴 전용 (resume_id null)
 * 각 행의 ✎ → /admin/portfolio/edit/:id, × → 삭제 confirm.
 */
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast, useAsyncConfirm, usePermission } from '@sonhoseong/mfa-lib'
import { portfoliosApi } from '../../../network'
import type { Portfolio } from '../../../network/apis/types'
import { LINK_PREFIX } from '@/config/constants'
import '../experience/ExperienceList.editorial.css'

const formatPeriod = (start: string | null, end: string | null, isCurrent: boolean) => {
    const s = start ? start.slice(0, 7) : '?'
    if (isCurrent) return `${s} ~ 현재`
    return `${s} ~ ${end ? end.slice(0, 7) : '?'}`
}

const PortfolioListPage: React.FC = () => {
    const toast = useToast()
    const confirmDialog = useAsyncConfirm()
    const { canEditResource } = usePermission()
    const [items, setItems] = useState<Portfolio[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const { data, error } = await portfoliosApi.getAll()
        if (data) setItems(data as Portfolio[])
        if (error) console.error('[PortfolioList] fetch', error)
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    const handleDelete = async (item: Portfolio) => {
        const ok = await confirmDialog(`"${item.title}" 을 삭제할까요?`, '삭제')
        if (!ok) return
        const { error } = await portfoliosApi.delete(item.id)
        if (error) toast.error('삭제 실패: ' + (error.message || '알 수 없는 오류'))
        else {
            toast.success('삭제되었어요.')
            fetchAll()
        }
    }

    const resumeLinked = items.filter((p) => p.resume_id)

    const renderRow = (p: Portfolio, opts?: { showResumeBadge?: boolean }) => (
        <li key={p.id} className="exp-row">
            <div className="exp-row-main">
                <div className="exp-row-title">
                    {p.title}
                    {opts?.showResumeBadge && p.resume_id && (
                        <span className="exp-row-badge" title="이력서에도 노출됨">이력서 노출</span>
                    )}
                </div>
                <div className="exp-row-sub">{p.role}</div>
                <div className="exp-row-meta">
                    {formatPeriod(p.start_date, p.end_date, p.is_current)}
                </div>
            </div>
            <div className="exp-row-actions">
                {canEditResource(p.user_id) ? (
                    <>
                        <Link
                            to={`${LINK_PREFIX}/admin/portfolio/edit/${p.id}`}
                            className="exp-icon-btn"
                            title="수정"
                            aria-label="수정"
                        >
                            ✎
                        </Link>
                        <button
                            type="button"
                            className="exp-icon-btn exp-icon-btn--danger"
                            onClick={() => handleDelete(p)}
                            title="삭제"
                            aria-label="삭제"
                        >
                            ×
                        </button>
                    </>
                ) : (
                    <Link
                        to={`${LINK_PREFIX}/admin/portfolio/edit/${p.id}`}
                        className="exp-icon-btn exp-icon-btn--locked"
                        title="Owner 소유 — 열람만 가능"
                        aria-label="열람만 가능"
                    >
                        🔒
                    </Link>
                )}
            </div>
        </li>
    )

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
                    <Link to={`${LINK_PREFIX}/admin/experience`} className="exp-admin-back">
                        ← 경력 & 프로젝트 관리로
                    </Link>
                    <h1 className="exp-admin-title">포트폴리오 관리</h1>
                    <p className="exp-admin-sub">
                        이력서에 노출되는 프로젝트와 포트폴리오 섹션의 상세 작품을 같은 테이블에서 관리합니다.
                        이력서에 연결하려면 편집 화면에서 "이 이력서에 표시" 를 체크하세요.
                    </p>
                </div>
            </header>

            {/* ===== 이력서 연결 ===== */}
            <section className="exp-section">
                <header className="exp-section-header">
                    <div className="exp-section-title-wrap">
                        <span className="exp-section-eyebrow">SECTION · RESUME-LINKED</span>
                        <h2 className="exp-section-title">이력서에 노출</h2>
                    </div>
                    <Link
                        to={`${LINK_PREFIX}/admin/portfolio/new?fromResume=1`}
                        className="exp-btn exp-btn--primary"
                    >
                        + 이력서용 추가
                    </Link>
                </header>

                {resumeLinked.length === 0 ? (
                    <div className="exp-empty">
                        <p className="exp-empty-title">이력서에 연결된 프로젝트가 없습니다.</p>
                        <Link
                            to={`${LINK_PREFIX}/admin/portfolio/new?fromResume=1`}
                            className="exp-btn exp-btn--ghost"
                        >
                            이력서용으로 추가
                        </Link>
                    </div>
                ) : (
                    <ul className="exp-list">{resumeLinked.map((p) => renderRow(p))}</ul>
                )}
            </section>

            {/* ===== 포트폴리오 (전체) ===== */}
            <section className="exp-section">
                <header className="exp-section-header">
                    <div className="exp-section-title-wrap">
                        <span className="exp-section-eyebrow">SECTION · ALL PORTFOLIO</span>
                        <h2 className="exp-section-title">포트폴리오 (전체)</h2>
                        <p className="exp-section-desc">
                            포트폴리오 페이지에 노출되는 모든 작품. 이력서에도 표시되는 항목은 뱃지가 붙습니다.
                        </p>
                    </div>
                    <Link
                        to={`${LINK_PREFIX}/admin/portfolio/new`}
                        className="exp-btn exp-btn--primary"
                    >
                        + 포트폴리오 추가
                    </Link>
                </header>

                {items.length === 0 ? (
                    <div className="exp-empty">
                        <p className="exp-empty-title">포트폴리오에 작품이 없습니다.</p>
                        <Link
                            to={`${LINK_PREFIX}/admin/portfolio/new`}
                            className="exp-btn exp-btn--ghost"
                        >
                            포트폴리오 추가
                        </Link>
                    </div>
                ) : (
                    <ul className="exp-list">
                        {items.map((p) => renderRow(p, { showResumeBadge: true }))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default PortfolioListPage
