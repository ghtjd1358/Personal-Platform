import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { experiencesApi } from '../../../network'
import { LINK_PREFIX } from '@/config/constants'
import { getCurrentUser } from '@sonhoseong/mfa-lib'

const ExperienceEditorPage: React.FC = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('resumeId')
    const navigate = useNavigate()
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
    const [loading, setLoading] = useState(false)

    // 쿼리 파라미터 유지
    const listUrl = resumeId
        ? `${LINK_PREFIX}/admin/experience?resumeId=${resumeId}`
        : `${LINK_PREFIX}/admin/experience`

    useEffect(() => {
        if (isEdit && id) {
            experiencesApi.getById(id).then(({ data }) => {
                if (data) setForm({
                    company: data.company || '',
                    position: data.position || '',
                    start_date: data.start_date || '',
                    end_date: data.end_date || '',
                    is_current: data.is_current || false,
                    is_dev: data.is_dev ?? true,
                })
            })
        }
    }, [id, isEdit])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.company || !form.position) {
            alert('회사명과 직책을 입력해주세요.')
            return
        }

        setLoading(true)
        const { error } = isEdit
            ? await experiencesApi.update(id!, form)
            : await experiencesApi.create({
                ...form,
                user_id: user?.id,
                resume_id: resumeId || undefined, // 새 경력 생성시 resume_id 포함
            })

        setLoading(false)
        if (error) alert('저장 실패: ' + error.message)
        else navigate(listUrl)
    }

    return (
        <div className="admin-editor-page">
            <header className="admin-page-header">
                <button type="button" onClick={() => navigate(listUrl)}>← 목록으로</button>
                <h1>{isEdit ? '경력 수정' : '새 경력 추가'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                    <label>회사명 *</label>
                    <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                    <label>직책 *</label>
                    <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} required />
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
                    <label><input type="checkbox" checked={form.is_current} onChange={e => setForm({...form, is_current: e.target.checked})} /> 재직중</label>
                </div>
                <div className="admin-form-group">
                    <label><input type="checkbox" checked={form.is_dev} onChange={e => setForm({...form, is_dev: e.target.checked})} /> 개발직</label>
                </div>
                <div className="admin-form-actions">
                    <button type="button" onClick={() => navigate(listUrl)}>취소</button>
                    <button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</button>
                </div>
            </form>
        </div>
    )
}

export default ExperienceEditorPage
