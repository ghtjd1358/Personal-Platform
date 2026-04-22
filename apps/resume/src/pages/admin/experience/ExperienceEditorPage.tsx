/**
 * ExperienceEditorPage — 경력 추가/수정.
 * Editorial 편지지 디자인: 왼쪽 메타(회사/직책/기간/플래그) + 오른쪽 본문(업무/태그).
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast, getCurrentUser } from '@sonhoseong/mfa-lib'
import { experiencesApi } from '../../../network'
import { LINK_PREFIX } from '@/config/constants'
import './ExperienceEditor.editorial.css'

const ExperienceEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('resumeId')
    const navigate = useNavigate()
    const toast = useToast()
    const user = getCurrentUser()
    const isEdit = !!id

    const [form, setForm] = useState({
        company: '',
        position: '',
        start_date: '',
        end_date: '',
        is_current: false,
        is_dev: true,
    })
    const [tasksText, setTasksText] = useState('')
    const [tagsText, setTagsText] = useState('')

    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)

    const listUrl = resumeId
        ? `${LINK_PREFIX}/admin/experience?resumeId=${resumeId}`
        : `${LINK_PREFIX}/admin/experience`

    useEffect(() => {
        if (!isEdit || !id) return
        let cancelled = false
        ;(async () => {
            try {
                const data = await experiencesApi.getByIdWithDetails(id)
                if (cancelled || !data) return
                setForm({
                    company: data.company || '',
                    position: data.position || '',
                    start_date: data.start_date || '',
                    end_date: data.end_date || '',
                    is_current: data.is_current || false,
                    is_dev: data.is_dev ?? true,
                })
                setTasksText(data.tasks.map((t) => t.task).join('\n'))
                setTagsText(data.tags.join(', '))
            } catch (err) {
                toast.error('경력 로드 실패: ' + (err as Error).message)
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
        if (!form.company.trim() || !form.position.trim()) {
            toast.error('회사명과 직책은 필수에요.')
            return
        }

        const parsedTasks = tasksText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)

        setSaving(true)
        try {
            let expId = id
            if (isEdit && id) {
                const { error } = await experiencesApi.update(id, form)
                if (error) throw error
            } else {
                const { data, error } = await experiencesApi.create({
                    ...form,
                    user_id: user?.id,
                    resume_id: resumeId || undefined,
                })
                if (error) throw error
                expId = data?.id
            }

            if (expId) {
                await experiencesApi.replaceChildren(expId, parsedTasks, parsedTags)
            }

            toast.success(isEdit ? '경력을 수정했어요.' : '경력을 추가했어요.')
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
                    <span className="exp-editor-eyebrow">SECTION · EXPERIENCE</span>
                    <h1 className="exp-editor-title">{isEdit ? '경력 수정' : '새 경력 추가'}</h1>
                    <p className="exp-editor-sub">
                        {isEdit ? '이력서에 표시되는 내용을 다듬어요.' : '커리어의 한 장을 기록합니다.'}
                    </p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="exp-editor-form">
                {/* ===== Left: Meta ===== */}
                <div className="exp-editor-card">
                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">회사명</span>
                            <span className="exp-field-hint">REQUIRED</span>
                        </div>
                        <input
                            className="exp-input"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            placeholder="예: (주)포인정보"
                            required
                        />
                    </div>

                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">직책</span>
                            <span className="exp-field-hint">REQUIRED</span>
                        </div>
                        <input
                            className="exp-input"
                            value={form.position}
                            onChange={(e) => setForm({ ...form, position: e.target.value })}
                            placeholder="예: 프론트엔드 개발자"
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
                                <span className="exp-check-label">재직중</span>
                            </label>
                            <label className="exp-check">
                                <input
                                    type="checkbox"
                                    checked={form.is_dev}
                                    onChange={(e) => setForm({ ...form, is_dev: e.target.checked })}
                                />
                                <span className="exp-check-box" aria-hidden="true"></span>
                                <span className="exp-check-label">개발직</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ===== Right: Content ===== */}
                <div className="exp-editor-card">
                    <div className="exp-field">
                        <div className="exp-field-label">
                            <span className="exp-field-name">주요 업무</span>
                            <span className="exp-field-hint">ONE TASK PER LINE · **BOLD** OK</span>
                        </div>
                        <textarea
                            className="exp-textarea"
                            value={tasksText}
                            onChange={(e) => setTasksText(e.target.value)}
                            rows={8}
                            placeholder={'예)\n**React + TypeScript** 기반 관리자 페이지 개발\n성능 최적화로 리렌더 40% 감소'}
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
                            placeholder="React, TypeScript, Redux Toolkit"
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
                        {saving ? '저장 중…' : isEdit ? '수정 저장' : '경력 추가'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ExperienceEditorPage
