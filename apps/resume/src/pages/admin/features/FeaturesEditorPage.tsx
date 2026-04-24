/**
 * FeaturesEditorPage — 핵심 역량 카드 생성/수정.
 * 기존 이미지가 있으면 미리보기로 노출, 새 파일 선택 시 교체.
 * 업로드는 Supabase Storage `resume-features` 버킷 (useUploadFeatureImage).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast, getCurrentUser } from '@sonhoseong/mfa-lib'
import type { FeatureInput } from '../../../network/apis/types'
import {
    useFetchFeatureById,
    useCreateFeature,
    useUpdateFeature,
    useUploadFeatureImage,
    useDeleteFeatureImage,
} from '../../../network/hooks'
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

    const { feature: loadedFeature } = useFetchFeatureById(id)
    const createFeature = useCreateFeature()
    const updateFeature = useUpdateFeature()
    const uploadImage = useUploadFeatureImage()
    const deleteImage = useDeleteFeatureImage()

    const [form, setForm] = useState<FeatureInput>({
        title: '',
        description: '',
        image_url: null,
        order_index: 0,
    })
    const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 업로드 전 로컬 blob
    const [existingUrl, setExistingUrl] = useState<string | null>(null) // 이전 Storage URL (교체 시 삭제 대상)

    // 기존 데이터 로드
    useEffect(() => {
        if (!isEdit || !loadedFeature) return
        setForm({
            title: loadedFeature.title,
            description: loadedFeature.description,
            image_url: loadedFeature.image_url,
            order_index: loadedFeature.order_index,
        })
        setExistingUrl(loadedFeature.image_url ?? null)
    }, [isEdit, loadedFeature])

    const setField = <K extends keyof FeatureInput>(key: K, value: FeatureInput[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    /**
     * 파일 선택 시 처리 흐름:
     *   1) 파일 검증 (타입 / 크기) — 실패 시 toast + return
     *   2) 로컬 preview URL 생성 (URL.createObjectURL) — 업로드 기다리지 않고 즉시 미리보기
     *   3) Storage 업로드 (useUploadFeatureImage) — 성공 시 form.image_url 에 public URL 세팅
     *   4) 이전 이미지 URL 이 다른 Storage 파일이면 Storage 에서 삭제 (orphan 방지)
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
        if (form.image_url) await deleteImage(form.image_url)
        setField('image_url', null)
        setExistingUrl(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) { toast.warning('제목을 입력해주세요.'); return }
        if (!form.description.trim()) { toast.warning('설명을 입력해주세요.'); return }

        if (isEdit && id) {
            const res = await updateFeature(id, form)
            if (!res) return
        } else {
            if (!currentUser?.id) { toast.error('로그인이 필요합니다.'); return }
            const res = await createFeature({ ...form, user_id: currentUser.id })
            if (!res) return
        }
        navigate(`${LINK_PREFIX}/admin/features`)
    }

    const currentImage = previewUrl || form.image_url || null

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
                                        className="exp-btn exp-btn--ghost"
                                    >
                                        교체
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
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
                                className="feature-image-picker"
                            >
                                + 이미지 선택 (PNG · JPG · WEBP, 최대 5MB)
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
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="exp-btn exp-btn--primary"
                    >
                        저장
                    </button>
                </footer>
            </form>
        </div>
    )
}

export default FeaturesEditorPage
