import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { portfoliosApi } from '../../../network'
import { LINK_PREFIX } from '@/config/constants'
import { getCurrentUser } from '@sonhoseong/mfa-lib'

const ProjectsEditorPage: React.FC = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('resumeId')
    const navigate = useNavigate()
    const user = getCurrentUser()
    const isEdit = !!id

    // 쿼리 파라미터 유지
    const listUrl = resumeId
        ? `${LINK_PREFIX}/admin/projects?resumeId=${resumeId}`
        : `${LINK_PREFIX}/admin/projects`

    const [form, setForm] = useState({
        title: '',
        role: '',
        start_date: '',
        end_date: '',
        is_current: false,
        image_url: '',
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEdit && id) {
            portfoliosApi.getById(id).then(({ data }) => {
                if (data) setForm({
                    title: data.title || '',
                    role: data.role || '',
                    start_date: data.start_date || '',
                    end_date: data.end_date || '',
                    is_current: data.is_current || false,
                    image_url: data.image_url || '',
                })
            })
        }
    }, [id, isEdit])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title) {
            alert('프로젝트명을 입력해주세요.')
            return
        }

        setLoading(true)
        const { error } = isEdit
            ? await portfoliosApi.update(id!, form)
            : await portfoliosApi.create({
                ...form,
                user_id: user?.id,
                resume_id: resumeId || undefined, // 새 프로젝트 생성시 resume_id 포함
            })

        setLoading(false)
        if (error) alert('저장 실패: ' + error.message)
        else navigate(listUrl)
    }

    return (
        <div className="admin-editor-page">
            <header className="admin-page-header">
                <button type="button" onClick={() => navigate(listUrl)}>← 목록으로</button>
                <h1>{isEdit ? '프로젝트 수정' : '새 프로젝트 추가'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                    <label>프로젝트명 *</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                    <label>역할</label>
                    <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
                </div>
                <div className="admin-form-group">
                    <label>시작일</label>
                    <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
                </div>
                <div className="admin-form-group">
                    <label>종료일</label>
                    <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} disabled={form.is_current} />
                </div>
                <div className="admin-form-group">
                    <label><input type="checkbox" checked={form.is_current} onChange={e => setForm({...form, is_current: e.target.checked})} /> 진행중</label>
                </div>
                <div className="admin-form-group">
                    <label>이미지 URL</label>
                    <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                </div>
                <div className="admin-form-actions">
                    <button type="button" onClick={() => navigate(listUrl)}>취소</button>
                    <button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</button>
                </div>
            </form>
        </div>
    )
}

export default ProjectsEditorPage
