/**
 * FeaturesListPage — "이런 개발자입니다" 섹션 카드 목록 (수정 전용).
 * - 추가/삭제 비활성. 기존 카드 내용만 수정 가능.
 * - 썸네일 + 제목 + 설명 요약 + ✎ 인라인 액션
 */
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePermission, getCurrentUser } from '@sonhoseong/mfa-lib'
import type { Feature } from '../../../network/apis/types'
import {
    useFetchFeatures,
    useFetchFeaturesByUserId,
} from '../../../network/hooks'
import { resolveFeatureImage } from '@/assets/images/hero'
import { LINK_PREFIX } from '@/config/constants'
import '../experience/ExperienceList.editorial.css'

const FeaturesListPage: React.FC = () => {
    const { canEditResource } = usePermission()
    const currentUser = getCurrentUser()

    // 핵심 역량 카드는 추가/삭제 불가 — 수정만 가능. updater 불필요.
    const { features: myFeatures } = useFetchFeaturesByUserId(currentUser?.id, 0)
    const { features: allFeatures } = useFetchFeatures(currentUser?.id ? -1 : 0)

    const items = useMemo(
        () => (currentUser?.id ? (myFeatures as Feature[]) : (allFeatures as Feature[])),
        [currentUser?.id, myFeatures, allFeatures],
    )

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
                </header>

                {items.length === 0 ? (
                    <div className="exp-empty">
                        <p className="exp-empty-title">등록된 카드가 없습니다.</p>
                    </div>
                ) : (
                    <ul className="exp-list">
                        {items.map((f) => {
                            const thumb = resolveFeatureImage(f.order_index, f.image_url)
                            return (
                            <li key={f.id} className="exp-row">
                                {thumb && (
                                    <img
                                        src={thumb}
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
                                        <Link
                                            to={`${LINK_PREFIX}/admin/features/edit/${f.id}`}
                                            className="exp-icon-btn"
                                            title="수정"
                                            aria-label="수정"
                                        >
                                            ✎
                                        </Link>
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
                        )})}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default FeaturesListPage
