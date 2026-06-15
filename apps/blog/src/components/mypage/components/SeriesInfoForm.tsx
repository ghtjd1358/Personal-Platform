import React from 'react';
import { Button } from '@sonhoseong/mfa-lib';

interface SeriesInfoFormProps {
  title: string;
  description: string;
  coverImage: string;
  isUploading: boolean;
  isLoading: boolean;
  isEditing: boolean;
  error?: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCoverImageChange: (value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const SeriesInfoForm: React.FC<SeriesInfoFormProps> = ({
  title,
  description,
  coverImage,
  isUploading,
  isLoading,
  isEditing,
  error,
  fileInputRef,
  onTitleChange,
  onDescriptionChange,
  onCoverImageChange,
  onImageUpload,
  onSubmit,
  onClose,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="series-title">시리즈 제목 *</label>
        <input
          id="series-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="시리즈 제목을 입력하세요"
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="series-description">설명</label>
        <textarea
          id="series-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="시리즈에 대한 설명을 입력하세요"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>커버 이미지</label>
        <div className="cover-upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={isLoading || isUploading}
            className="input-file-hidden"
            id="series-cover-file"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="btn-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading}
            loading={isUploading}
          >
            이미지 선택
          </Button>
          <span className="upload-hint">또는 URL 직접 입력</span>
          <input
            id="series-cover"
            type="url"
            value={coverImage}
            onChange={(e) => onCoverImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={isLoading || isUploading}
            className="url-input"
          />
        </div>
        {coverImage && (
          <div className="cover-preview">
            <img
              src={coverImage}
              alt="커버 미리보기"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <Button.Icon
              aria-label="커버 이미지 제거"
              className="btn-remove-cover"
              onClick={() => onCoverImageChange('')}
              disabled={isLoading || isUploading}
            >
              ×
            </Button.Icon>
          </div>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      <Button.Group gap="sm" align="end" className="modal-actions">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          취소
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading || !title.trim()} loading={isLoading}>
          {isEditing ? '수정' : '생성'}
        </Button>
      </Button.Group>
    </form>
  );
};

export default SeriesInfoForm;
