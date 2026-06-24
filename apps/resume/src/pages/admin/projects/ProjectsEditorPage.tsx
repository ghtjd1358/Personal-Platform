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
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast, useCurrentUser, getSupabase } from '@sonhoseong/mfa-lib'
import {
    useFetchPortfolioByIdWithDetails,
    useCreatePortfolio,
    useUpdatePortfolio,
    useReplacePortfolioChildren,
    useDeletePortfolio,
} from '../../../network/hooks'
import { LINK_PREFIX } from '@/config/constants'
import {
    ProjectCoreFields,
    ProjectTasksTagsFields,
    ProjectOptionalFields,
    type ProjectFormState,
} from './components'
import '../experience/ExperienceEditor.editorial.css'

const ProjectsEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const fromResume = searchParams.get('fromResume')
    const navigate = useNavigate()
    const toast = useToast()
    const user = useCurrentUser()
    const isEdit = !!id

    const { portfolio: loadedPortfolio } = useFetchPortfolioByIdWithDetails(id)
    const createPortfolio = useCreatePortfolio()
    const updatePortfolio = useUpdatePortfolio()
    const replaceChildren = useReplacePortfolioChildren()
    const deletePortfolio = useDeletePortfolio()

    // 필수 + 선택 필드 통합 form
    // 신규 카드 기본값: ?fromResume=1 로 들어왔으면 회사 작업물(work) 의도 → category 도 'work' 로 추정.
    // 그렇지 않으면 개인 작업물(personal) 이 안전한 기본값 (실수로 회사 분류 되는 사고 예방).
    const [form, setForm] = useState<ProjectFormState>({
        title: '',
        role: '',
        start_date: '',
        end_date: '',
        is_current: false,
        link_to_resume: fromResume === '1',
        category: fromResume === '1' ? 'work' : 'personal',
        short_description: '',
        demo_url: '',
        github_url: '',
        figma_url: '',
        cover_image: '',
    })
    const [tasksText, setTasksText] = useState('')
    const [tagsText, setTagsText] = useState('')

    // 저장/취소 후 복귀: URL 의 ?fromResume=1 query 있을 때만 경력&프로젝트 로.
    const listUrl = fromResume === '1'
        ? `${LINK_PREFIX}/admin/experience`
        : `${LINK_PREFIX}/admin/portfolio`

    const handleDelete = async () => {
        if (!isEdit || !id) return
        if (!window.confirm(`"${form.title || '이 프로젝트'}" 를 삭제할까요? 되돌릴 수 없습니다.`)) return
        const ok = await deletePortfolio(id)
        if (ok) navigate(listUrl)
    }

    // edit 모드: 로드된 portfolio 를 form state 에 반영
    useEffect(() => {
        if (!isEdit || !loadedPortfolio) return
        const data = loadedPortfolio
        setForm({
            title: data.title || '',
            role: data.role || '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
            is_current: data.is_current || false,
            link_to_resume: !!data.resume_id,
            category: (data as any).category === 'work' ? 'work' : 'personal',
            short_description: (data as any).short_description || '',
            demo_url: (data as any).demo_url || '',
            github_url: (data as any).github_url || '',
            figma_url: (data as any).figma_url || '',
            cover_image: (data as any).cover_image || '',
        })
        setTasksText(data.tasks.map((t) => t.task).join('\n'))
        setTagsText(data.tags.join(', '))
    }, [isEdit, loadedPortfolio])

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

        const parsedTags = tagsText.split(',').map((s) => s.trim()).filter(Boolean)

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
            show_on_resume: form.link_to_resume,
            category: form.category,
            short_description: form.short_description || undefined,
            demo_url: form.demo_url || undefined,
            github_url: form.github_url || undefined,
            figma_url: form.figma_url || undefined,
            cover_image: form.cover_image || undefined,
        }

        let projId: string | undefined = id
        if (isEdit && id) {
            const res = await updatePortfolio(id, payload)
            if (!res) return
        } else {
            const res = await createPortfolio({ ...payload, user_id: user?.id })
            if (!res) return
            projId = (res as { id: string }).id
        }

        if (projId) {
            const replaced = await replaceChildren(projId, parsedTasks, parsedTags)
            if (!replaced) return
        }

        navigate(listUrl)
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
                <ProjectCoreFields form={form} onChange={setForm} />

                <ProjectTasksTagsFields
                    tasksText={tasksText}
                    tagsText={tagsText}
                    onTasksTextChange={setTasksText}
                    onTagsTextChange={setTagsText}
                />

                <ProjectOptionalFields form={form} onChange={setForm} />

                {/* ===== Actions ===== */}
                <div className="exp-editor-actions">
                    {isEdit && (
                        <button
                            type="button"
                            className="exp-editor-btn exp-editor-btn--danger"
                            onClick={handleDelete}
                        >
                            삭제
                        </button>
                    )}
                    <button
                        type="button"
                        className="exp-editor-btn exp-editor-btn--ghost"
                        onClick={() => navigate(listUrl)}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="exp-editor-btn exp-editor-btn--primary"
                    >
                        {isEdit ? '수정 저장' : '포트폴리오 추가'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProjectsEditorPage
