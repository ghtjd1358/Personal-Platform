import React, { useEffect, useCallback } from 'react';
import { Button, useAsyncState, useFormFromData } from '@sonhoseong/mfa-lib';
import { ProfileDetail, updateProfile, UpdateProfileRequest } from '@/network';

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: ProfileDetail | null;
  onClose: () => void;
  onSave: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave
}) => {
  // profile 이 비동기 로드 → null 가능. mount 시점엔 빈 객체로 초기화 후 useEffect 로 동기화.
  const { formData, setFormData, handleChange } = useFormFromData<UpdateProfileRequest>({
    name: '',
    short_bio: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        short_bio: profile.short_bio || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, setFormData]);

  // useAsyncState 의 error 는 Error 객체 — response.success=false 의 비즈니스 에러도 throw 로 통일해 single channel.
  const submit = useCallback(async () => {
    if (!profile) throw new Error('프로필 정보가 없습니다.');
    const response = await updateProfile(profile.id, formData);
    if (!response.success) throw new Error(response.error || '저장 중 오류가 발생했습니다.');
    return response;
  }, [profile, formData]);

  const { isLoading: saving, error, execute } = useAsyncState(submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute();
    if (result) {
      onSave();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-edit-modal" onClick={e => e.stopPropagation()}>
        <h3>프로필 수정</h3>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="short_bio">한 줄 소개</label>
            <input
              type="text"
              id="short_bio"
              name="short_bio"
              value={formData.short_bio}
              onChange={handleChange}
              placeholder="짧은 소개를 입력하세요"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">소개</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="자세한 소개를 입력하세요"
              rows={6}
            />
          </div>

          {error && <div className="form-error">{error.message}</div>}

          <Button.Group gap="sm" align="end" className="modal-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={saving}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              loading={saving}
            >
              저장
            </Button>
          </Button.Group>
        </form>
      </div>
    </div>
  );
};

export { ProfileEditModal };