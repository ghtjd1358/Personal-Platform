/**
 * ProjectsEditorPage — portfolios 단일 엔티티 추가/수정 (= /admin/portfolio/edit/:id, /admin/portfolio/new)
 *
 * 핵심 컨셉
 * - 필수 (PortfolioCore): 이력서 + 포폴 양쪽에 노출되는 축 — title / role / start_date / is_current
 * - 선택 (portfolio-only): 포폴 섹션 상세 카드에서만 노출 — short_description / URL 들 / 이미지
 * - "이 이력서에 노출" 토글 = resume_id on/off
 *
 * Back nav: `?fromResume=1` 또는 resumeId 쿼리 있으면 `/admin/experience` 로 복귀,
 *          없으면 `/admin/portfolio` 리스트로.
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast, getCurrentUser, getSupabase } from '@sonhoseong/mfa-lib'
import { portfoliosApi } from '../../../network'
import { LINK_PREFIX } from '@/config/constants'
import '../experience/ExperienceEditor.editorial.css'

const ProjectsEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const fromResume = searchParams.get('fromResume')
    const navigate = useNavigate()
    const toast = useToast()
    const user = getCurrentUser()
    const isEdit = !!id

    // 필수 + 선택 필드 통합 form
    const [form, setForm] = useState({
        // Core (필수)
        title: '',
        role: '',
        start_date: '',
        end_date: '',
        is_current: false,
        // Resume link
        link_to_resume: fromResume === '1', // 신규 생성 시 기본값
        // Portfolio-only (선택)
        short_description: '',
        description: '',
        demo_url: '',
        github_url: '',
        figma_url: '',
        cover_image: '',
    })
    const [tasksText, setTasksText] = useState('')
    const [tagsText, setTagsText] = useState('')

    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)

    // 저장/취소 후 복귀: fromResume 쿼리 있거나 이미 이력서 연결된 row 면 경력&프로젝트 로, 아니면 포폴 리스트로
    const listUrl = form.link_to_resume || fromResume
        ? `${LINK_PREFIX}/admin/experience`
        : `${LINK_PREFIX}/admin/portfolio`

    useEffect(() => {
        if (!isEdit || !id) return
        let cancelled = false
        ;(async () => {
            try {
                const data = await portfoliosApi.getByIdWithDetails(id)
                if (cancelled || !data) return
                setForm({
                    title: data.title || '',
                    role: data.role || '',
                    start_date: data.start_date || '',
                    end_date: data.end_date || '',
                    is_current: data.is_current || false,
                    link_to_resume: !!data.resume_id,
                    short_description: (data as any).short_description || '',
                    description: (data as any).description || '',
                    demo_url: (data as any).demo_url || '',
                    github_url: (data as any).github_url || '',
                    figma_url: (data as any).figma_url || '',
                    cover_image: (data as any).cover_image || '',
                })
                setTasksText(data.tasks.map((t) => t.task).join('\n'))
                setTagsText(data.tags.join(', '))
            } catch (err) {
                toast.error('포트폴리오 로드 실패: ' + (err as Error).message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [id, isEdit])

    const parsedTags = useMemo(
        () => tagsText.split(',').map((s) => s.trim()).filter(Boolean),
        [tagsText],
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim() || !form.role.trim()) {
            toast.error('제목과 역할은 필수예요.')
            return
        }

        const parsedTasks = tasksText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)

        setSaving(true)
        try {
            // resume_id 결정: 토글 on 이면 현재 유저의 대표 이력서 id 찾아서 붙이기, off 면 null
            let resumeIdToSet: string | null = null
            if (form.link_to_resume && user?.id) {
                const { data: primary } = await getSupabase()
                    .from('resume_profile')
                    .select('id')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle()
                resumeIdToSet = primary?.id ?? null
            }

            const payload = {
                title: form.title.trim(),
                role: form.role.trim(),
                start_date: form.start_date,
                end_date: form.end_date || null,
                is_current: form.is_current,
                resume_id: resumeIdToSet,
                short_description: form.short_description || undefined,
                description: form.description || undefined,
                demo_url: form.demo_url || undefined,
                github_url: form.github_url || undefined,
                figma_url: form.figma_url || undefined,
                cover_image: form.cover_image || undefined,
            }

            let projId = id
            if (isEdit && id) {
                const { error } = await portfoliosApi.update(id, payload)
                if (error) throw error
            } else {
                const { data, error } = await portfoliosApi.create({
                    ...payload,
                    user_id: user?.id,
                })
                if (error) throw error
                projId = data?.id
            }

            if (projId) {
                await portfoliosApi.replaceChildren(projId, parsedTasks, parsedTags)
            }

            toast.success(isEdit ? '포트폴리오를 수정했어요.' : '포트폴리오를 추가했어요.')
            navigate(listUrl)
        } catch (err) {
            toast.error('저장 실패: ' + (err as Error).message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="exp-editor">
                <div className="exp-editor-loading">불러오는 중…</div>
            </div>
        )
    }

    return (
        <div className="exp-editor">
            <header className="exp-editor-header">
                <button
                    type="button"
                    className="exp-editor-back"
                    onClick={() => navigate(listUrl)}
                    aria-label="목록으로"
                    title="목록으로"
                >
                    ←
                </button>
                <div className="exp-editor-titles">
                    <span className="exp-editor-eyebrow">SECTION · PORTFOLIO</span>
                    <h1 className="exp-editor-title">{isEdit ? '포트폴리오 수정' : '새 포트폴리오'}</h1>
                    <p className="exp-editor-sub">
                        {form.link_to_resume
                            ? '이력서 timeline 과 포트폴리오 섹션에 함께 노출됩니다.'
                            : '포트폴리오 섹션에서만 노출됩니다. 이력서에도 쓰려면 아래 "이력서에 노출" 체크.'}
                    </p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="exp-editor-form">
                {/* ===== Left: Core (필수) ===== */}
                <div className="exp-editor-card">
                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">제목</span>
                            <span className="exp-field-hint">REQUIRED</span>
                        </div>
                        <input
                            className="exp-input"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="예: 개인 플랫폼"
                            required
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">역할</span>
                            <span className="exp-field-hint">REQUIRED</span>
                        </div>
                        <input
                            className="exp-input"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            placeholder="예: 개인 프로젝트 · 설계/개발"
                            required
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">기간</span>
                            <span className="exp-field-hint">START · END</span>
                        </div>
                        <div className="exp-date-row">
                            <input
                                type="date"
                                className="exp-input"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="exp-input"
                                value={form.end_date || ''}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                disabled={form.is_current}
                            />
                        </div>
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">플래그</span>
                            <span className="exp-field-hint">FLAGS</span>
                        </div>
                        <div className="exp-checks">
                            <label className="exp-check">
                                <input
                                    type="checkbox"
                                    checked={form.is_current}
                                    onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
                                />
                                <span className="exp-check-box" aria-hidden="true"></span>
                                <span className="exp-check-label">진행중</span>
                            </label>
                            <label className="exp-check">
                                <input
                                    type="checkbox"
                                    checked={form.link_to_resume}
                                    onChange={(e) => setForm({ ...form, link_to_resume: e.target.checked })}
                                />
                                <span className="exp-check-box" aria-hidden="true"></span>
                                <span className="exp-check-label">이력서에 노출</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ===== Right: Tasks + Tags (공용) ===== */}
                <div className="exp-editor-card">
                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">주요 작업</span>
                            <span className="exp-field-hint">ONE TASK PER LINE · **BOLD** OK</span>
                        </div>
                        <textarea
                            className="exp-textarea"
                            value={tasksText}
                            onChange={(e) => setTasksText(e.target.value)}
                            rows={6}
                            placeholder={'예)\n**번들 최적화** - 8.09MB → 397KB (80% 감소)\n**Lighthouse 개선** - 73 → 89점'}
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">기술 태그</span>
                            <span className="exp-field-hint">COMMA SEPARATED</span>
                        </div>
                        <input
                            className="exp-input"
                            value={tagsText}
                            onChange={(e) => setTagsText(e.target.value)}
                            placeholder="React, TypeScript, Vite, Tailwind CSS"
                        />
                        <div className="exp-chips">
                            {parsedTags.length > 0 ? (
                                parsedTags.map((t) => (
                                    <span key={t} className="exp-chip">{t}</span>
                                ))
                            ) : (
                                <span className="exp-chips-empty">쉼표로 구분하면 여기에 칩으로 나타나요.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== Full-width: Portfolio-only (선택) ===== */}
                <details className="exp-editor-card" style={{ gridColumn: '1 / -1' }}>
                    <summary style={{
                        cursor: 'pointer',
                        fontFamily: "'Fraunces', serif",
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        outline: 'none',
                    }}>
                        <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '10px',
                            letterSpacing: '0.15em',
                            color: '#8C1E1A',
                            textTransform: 'uppercase',
                            marginRight: '10px',
                        }}>
                            OPTIONAL
                        </span>
                        포트폴리오 섹션 전용 필드 (이력서엔 표시 안 됨)
                    </summary>

                    <div className="exp-field" style={{ marginTop: '20px' }}>
                        <div className="exp-field-label">
                            <span className="exp-field-name">짧은 소개</span>
                            <span className="exp-field-hint">SHORT DESCRIPTION · 1~2 FIG</span>
                        </div>
                        <input
                            className="exp-input"
                            value={form.short_description}
                            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                            placeholder="카드 hover 시 보이는 한 줄 설명"
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">상세 설명</span>
                            <span className="exp-field-hint">LONG FORM · MARKDOWN OK</span>
                        </div>
                        <textarea
                            className="exp-textarea"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            placeholder="포트폴리오 상세 페이지의 본문"
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">커버 이미지 URL</span>
                            <span className="exp-field-hint">COVER IMAGE</span>
                        </div>
                        <input
                            className="exp-input"
                            value={form.cover_image}
                            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">링크</span>
                            <span className="exp-field-hint">DEMO · GITHUB · FIGMA</span>
                        </div>
                        <input
                            className="exp-input"
                            style={{ marginBottom: '8px' }}
                            value={form.demo_url}
                            onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                            placeholder="Demo URL — https://..."
                        />
                        <input
                            className="exp-input"
                            style={{ marginBottom: '8px' }}
                            value={form.github_url}
                            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                            placeholder="GitHub URL — https://github.com/..."
                        />
                        <input
                            className="exp-input"
                            value={form.figma_url}
                            onChange={(e) => setForm({ ...form, figma_url: e.target.value })}
                            placeholder="Figma URL — https://figma.com/..."
                        />
                    </div>
                </details>

                {/* ===== Actions ===== */}
                <div className="exp-editor-actions">
                    <button
                        type="button"
                        className="exp-editor-btn exp-editor-btn--ghost"
                        onClick={() => navigate(listUrl)}
                        disabled={saving}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="exp-editor-btn exp-editor-btn--primary"
                        disabled={saving}
                    >
                        {saving ? '저장 중…' : isEdit ? '수정 저장' : '포트폴리오 추가'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProjectsEditorPage
