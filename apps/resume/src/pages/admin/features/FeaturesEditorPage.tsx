/**
 * FeaturesEditorPage — 핵심 역량 카드 생성/수정.
 * 기존 이미지가 있으면 미리보기로 노출, 새 파일 선택 시 교체.
 * 업로드는 Supabase Storage `resume-features` 버킷 (featuresApi.uploadImage).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast, getCurrentUser } from '@sonhoseong/mfa-lib'
import { featuresApi } from '../../../network/apis/supabase'
import type { Feature, FeatureInput } from '../../../network/apis/types'
import { LINK_PREFIX } from '@/config/constants'
import '../experience/ExperienceEditor.editorial.css'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']

const FeaturesEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const toast = useToast()
    const currentUser = getCurrentUser()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEdit = Boolean(id)

    const [form, setForm] = useState<FeatureInput>({
        title: '',
        description: '',
        image_url: null,
        order_index: 0,
    })
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 업로드 전 로컬 blob
    const [existingUrl, setExistingUrl] = useState<string | null>(null) // 이전 Storage URL (교체 시 삭제 대상)

    // 기존 데이터 로드
    useEffect(() => {
        if (!isEdit || !id) return
        ;(async () => {
            const { data, error } = await featuresApi.getById(id)
            if (error) {
                toast.error('데이터를 불러오지 못했어요: ' + error.message)
                setLoading(false)
                return
            }
            const row = data as Feature
            setForm({
                title: row.title,
                description: row.description,
                image_url: row.image_url,
                order_index: row.order_index,
            })
            setExistingUrl(row.image_url ?? null)
            setLoading(false)
        })()
    }, [id, isEdit, toast])

    const setField = <K extends keyof FeatureInput>(key: K, value: FeatureInput[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    /**
     * 파일 선택 시 처리 흐름:
     *   1) 파일 검증 (타입 / 크기) — 실패 시 toast + return
     *   2) 로컬 preview URL 생성 (URL.createObjectURL) — 업로드 기다리지 않고 즉시 미리보기
     *   3) Storage 업로드 (featuresApi.uploadImage) — 성공 시 form.image_url 에 public URL 세팅
     *   4) 이전 이미지 URL 이 다른 Storage 파일이면 Storage 에서 삭제 (orphan 방지)
     *
     * 이 함수를 TODO(human) 에서 완성해주세요. 힌트:
     *   - try/finally 로 setUploading 토글
     *   - 파일 검증 상수 MAX_IMAGE_BYTES, ALLOWED_TYPES 재사용
     *   - 업로드 성공 시 previousUrl = existingUrl 을 기억해두고 deleteImageByUrl 호출
     *   - 교체가 성공하면 setExistingUrl(newUrl)
     *   - 에러는 toast.error, 성공은 toast.success
     */
    const handleImageSelect = useCallback(async (file: File) => {
        if (!currentUser?.id) {
            toast.error('로그인 후 업로드할 수 있어요.')
            return
        }
        // TODO(human): 파일 검증 + 로컬 preview + Storage 업로드 + orphan 삭제 로직 구현
    }, [currentUser?.id, toast, existingUrl])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleImageSelect(file)
        e.target.value = '' // 같은 파일 재선택 허용
    }

    const handleRemoveImage = async () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        if (form.image_url) {
            await featuresApi.deleteImageByUrl(form.image_url)
        }
        setField('image_url', null)
        setExistingUrl(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) { toast.warning('제목을 입력해주세요.'); return }
        if (!form.description.trim()) { toast.warning('설명을 입력해주세요.'); return }

        setSaving(true)
        try {
            if (isEdit && id) {
                const { error } = await featuresApi.update(id, form)
                if (error) throw error
                toast.success('저장되었어요.')
            } else {
                if (!currentUser?.id) { toast.error('로그인이 필요합니다.'); return }
                const { error } = await featuresApi.create({ ...form, user_id: currentUser.id })
                if (error) throw error
                toast.success('추가되었어요.')
            }
            navigate(`${LINK_PREFIX}/admin/features`)
        } catch (err: any) {
            toast.error('저장 실패: ' + (err?.message || '알 수 없는 오류'))
        } finally {
            setSaving(false)
        }
    }

    const currentImage = previewUrl || form.image_url || null

    if (loading) {
        return (
            <div className="admin-editor-page exp-editor">
                <div className="exp-editor-loading">불러오는 중…</div>
            </div>
        )
    }

    return (
        <div className="admin-editor-page exp-editor">
            <header className="exp-editor-header">
                <button
                    type="button"
                    className="exp-editor-back"
                    onClick={() => navigate(`${LINK_PREFIX}/admin/features`)}
                >
                    ← 목록으로
                </button>
                <h1 className="exp-editor-title">
                    {isEdit ? '핵심 역량 카드 수정' : '핵심 역량 카드 추가'}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="exp-editor-form">
                <label className="exp-field">
                    <span className="exp-field-label">이미지</span>
                    <div className="feature-image-upload">
                        {currentImage ? (
                            <div className="feature-image-preview">
                                <img src={currentImage} alt="미리보기" />
                                <div className="feature-image-actions">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading || saving}
                                        className="exp-btn exp-btn--ghost"
                                    >
                                        교체
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        disabled={uploading || saving}
                                        className="exp-btn exp-btn--ghost"
                                    >
                                        제거
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || saving}
                                className="feature-image-picker"
                            >
                                {uploading ? '업로드 중…' : '+ 이미지 선택 (PNG · JPG · WEBP, 최대 5MB)'}
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ALLOWED_TYPES.join(',')}
                            onChange={onFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </label>

                <label className="exp-field">
                    <span className="exp-field-label">제목</span>
                    <input
                        type="text"
                        className="exp-input"
                        value={form.title}
                        onChange={(e) => setField('title', e.target.value)}
                        placeholder="React 기반 개발"
                        maxLength={80}
                    />
                </label>

                <label className="exp-field">
                    <span className="exp-field-label">설명</span>
                    <textarea
                        className="exp-textarea"
                        value={form.description}
                        onChange={(e) => setField('description', e.target.value)}
                        placeholder="한 줄에서 세 줄 정도. 구체적인 경험/강점 위주로."
                        rows={4}
                        maxLength={400}
                    />
                </label>

                <label className="exp-field">
                    <span className="exp-field-label">정렬 순서</span>
                    <input
                        type="number"
                        className="exp-input"
                        value={form.order_index ?? 0}
                        onChange={(e) => setField('order_index', Number(e.target.value))}
                        min={0}
                    />
                </label>

                <footer className="exp-editor-actions">
                    <button
                        type="button"
                        className="exp-btn exp-btn--ghost"
                        onClick={() => navigate(`${LINK_PREFIX}/admin/features`)}
                        disabled={saving}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="exp-btn exp-btn--primary"
                        disabled={saving || uploading}
                    >
                        {saving ? '저장 중…' : '저장'}
                    </button>
                </footer>
            </form>
        </div>
    )
}

export default FeaturesEditorPage
