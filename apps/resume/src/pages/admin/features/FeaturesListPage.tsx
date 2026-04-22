/**
 * FeaturesListPage — "이런 개발자입니다" 섹션 카드 CRUD 목록.
 * - 내 features 만 표시 (권한: owner 본인 전체 CRUD, 다른 사람은 열람만)
 * - 썸네일 + 제목 + 설명 요약 + ✎ / × 인라인 액션
 */
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast, useAsyncConfirm, usePermission, getCurrentUser } from '@sonhoseong/mfa-lib'
import { featuresApi } from '../../../network/apis/supabase'
import type { Feature } from '../../../network/apis/types'
import { LINK_PREFIX } from '@/config/constants'
import '../experience/ExperienceList.editorial.css'

const FeaturesListPage: React.FC = () => {
    const toast = useToast()
    const confirmDialog = useAsyncConfirm()
    const { canEditResource } = usePermission()
    const currentUser = getCurrentUser()
    const [items, setItems] = useState<Feature[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        // 로그인 유저 것만 (필요 시 getAll 로 전체)
        const { data, error } = currentUser?.id
            ? await featuresApi.getByUserId(currentUser.id)
            : await featuresApi.getAll()
        if (data) setItems(data as Feature[])
        if (error) console.error('[FeaturesList] fetch', error)
        setLoading(false)
    }, [currentUser?.id])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    const handleDelete = async (item: Feature) => {
        const ok = await confirmDialog(`"${item.title}" 카드를 삭제할까요?`, '카드 삭제')
        if (!ok) return
        // Storage 이미지도 같이 정리 (orphan 방지)
        if (item.image_url) {
            await featuresApi.deleteImageByUrl(item.image_url)
        }
        const { error } = await featuresApi.delete(item.id)
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
                    <Link to={`${LINK_PREFIX}/`} className="exp-admin-back">
                        ← 이력서 홈으로
                    </Link>
                    <h1 className="exp-admin-title">핵심 역량 관리</h1>
                    <p className="exp-admin-sub">
                        홈의 "이런 개발자입니다" 섹션에 노출되는 카드(이미지 + 제목 + 설명)를 여기서 편집합니다.
                    </p>
                </div>
            </header>

            <section className="exp-section">
                <header className="exp-section-header">
                    <div className="exp-section-title-wrap">
                        <span className="exp-section-eyebrow">SECTION · FEATURES</span>
                        <h2 className="exp-section-title">핵심 역량 카드</h2>
                    </div>
                    <Link
                        to={`${LINK_PREFIX}/admin/features/new`}
                        className="exp-btn exp-btn--primary"
                    >
                        + 카드 추가
                    </Link>
                </header>

                {items.length === 0 ? (
                    <div className="exp-empty">
                        <p className="exp-empty-title">등록된 카드가 없습니다.</p>
                        <Link
                            to={`${LINK_PREFIX}/admin/features/new`}
                            className="exp-btn exp-btn--ghost"
                        >
                            첫 카드 추가하기
                        </Link>
                    </div>
                ) : (
                    <ul className="exp-list">
                        {items.map((f) => (
                            <li key={f.id} className="exp-row">
                                {f.image_url && (
                                    <img
                                        src={f.image_url}
                                        alt={f.title}
                                        className="exp-row-thumb"
                                    />
                                )}
                                <div className="exp-row-main">
                                    <div className="exp-row-title">{f.title}</div>
                                    <div className="exp-row-sub">{f.description}</div>
                                    <div className="exp-row-meta">ORDER · {f.order_index}</div>
                                </div>
                                <div className="exp-row-actions">
                                    {canEditResource(f.user_id) ? (
                                        <>
                                            <Link
                                                to={`${LINK_PREFIX}/admin/features/edit/${f.id}`}
                                                className="exp-icon-btn"
                                                title="수정"
                                                aria-label="수정"
                                            >
                                                ✎
                                            </Link>
                                            <button
                                                type="button"
                                                className="exp-icon-btn exp-icon-btn--danger"
                                                onClick={() => handleDelete(f)}
                                                title="삭제"
                                                aria-label="삭제"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to={`${LINK_PREFIX}/admin/features/edit/${f.id}`}
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

export default FeaturesListPage
