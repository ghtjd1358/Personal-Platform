import React from 'react';
import { Button } from '@sonhoseong/mfa-lib';
import TiptapEditor from '@/components/editor/TiptapEditor';

interface PortfolioBasicSectionProps {
    title: string;
    slug: string;
    badge: string;
    shortDescription: string;
    description: string;
    coverImage: string;
    isUploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onTitleChange: (value: string) => void;
    onSlugChange: (value: string) => void;
    onBadgeChange: (value: string) => void;
    onShortDescriptionChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onCoverImageChange: (value: string) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PortfolioBasicSection: React.FC<PortfolioBasicSectionProps> = ({
    title,
    slug,
    badge,
    shortDescription,
    description,
    coverImage,
    isUploading,
    fileInputRef,
    onTitleChange,
    onSlugChange,
    onBadgeChange,
    onShortDescriptionChange,
    onDescriptionChange,
    onCoverImageChange,
    onImageUpload,
}) => {
    return (
        <section className="editor-section">
            <h2>기본 정보</h2>
            <div className="form-group">
                <label htmlFor="title">제목 *</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="프로젝트 제목"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="slug">슬러그 *</label>
                    <input
                        id="slug"
                        type="text"
                        value={slug}
                        onChange={(e) => onSlugChange(e.target.value)}
                        placeholder="url-friendly-slug"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="badge">배지</label>
                    <input
                        id="badge"
                        type="text"
                        value={badge}
                        onChange={(e) => onBadgeChange(e.target.value)}
                        placeholder="예: 개인, 팀, 회사"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="shortDescription">짧은 설명</label>
                <input
                    id="shortDescription"
                    type="text"
                    value={shortDescription}
                    onChange={(e) => onShortDescriptionChange(e.target.value)}
                    placeholder="한 줄 요약"
                    maxLength={200}
                />
            </div>

            <div className="form-group">
                <label>상세 설명 (HTML 에디터)</label>
                <TiptapEditor
                    content={description}
                    onChange={onDescriptionChange}
                    placeholder="프로젝트에 대한 상세 설명을 작성하세요..."
                />
            </div>

            <div className="form-group">
                <label htmlFor="coverImage">커버 이미지</label>
                <div className="cover-upload-area">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="input-file-hidden"
                        id="coverImageFile"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="btn-upload"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        loading={isUploading}
                    >
                        {isUploading ? '업로드 중...' : '이미지 선택'}
                    </Button>
                    <span className="upload-hint">또는 URL 직접 입력</span>
                </div>
                <input
                    id="coverImage"
                    type="url"
                    value={coverImage}
                    onChange={(e) => onCoverImageChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                    <div className="cover-preview">
                        <img src={coverImage} alt="미리보기" />
                    </div>
                )}
            </div>
        </section>
    );
};

export default PortfolioBasicSection;
