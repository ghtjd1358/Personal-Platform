import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, useToast } from '@sonhoseong/mfa-lib';
import { resumesApi } from '@/network';
import type { ResumeProfile, ResumeVisibility } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import '@/styles/admin.css';

interface FormData {
  name: string;
  title: string;
  summary: string;
  profile_image: string;
  contact_email: string;
  github: string;
  blog: string;
  visibility: ResumeVisibility;
}

const initialFormData: FormData = {
  name: '',
  title: '',
  summary: '',
  profile_image: '',
  contact_email: '',
  github: '',
  blog: '',
  visibility: 'private',
};

const ResumeEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const accessToken = useSelector((state: any) => state.app?.accessToken);
  const user = getCurrentUser();

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // URL로 모드 결정: /write = 작성, /edit = 수정
  const isWriteUrl = location.pathname.includes('/write');
  const isEditMode = !!resume;

  // UUID 형식 검증 함수
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // 데이터 로드
  useEffect(() => {
    if (!accessToken) {
      navigate(`${LINK_PREFIX}/login`);
      return;
    }

    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      // UUID 형식 검증 - 잘못된 ID면 재로그인 유도
      if (!isValidUUID(user.id)) {
        console.error('Invalid user ID format. Please re-login.');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.');
        navigate(`${LINK_PREFIX}/login`);
        return;
      }

      try {
        setIsLoading(true);
        const data = await resumesApi.getMyResume(user.id);

        if (data) {
          // 이력서가 있는데 /write URL이면 → /edit으로 리다이렉트
          if (isWriteUrl) {
            navigate(`${LINK_PREFIX}/mypage/edit`, { replace: true });
            return;
          }
          setResume(data);
          setFormData({
            name: (data as any).name || '',
            title: data.title || '',
            summary: data.summary || '',
            profile_image: data.profile_image || '',
            contact_email: data.contact_email || '',
            github: data.github || '',
            blog: data.blog || '',
            visibility: data.visibility || 'private',
          });
        } else {
          // 이력서가 없는데 /edit URL이면 → /write로 리다이렉트
          if (!isWriteUrl) {
            navigate(`${LINK_PREFIX}/mypage/write`, { replace: true });
            return;
          }
        }
      } catch (err: any) {
        console.error('Failed to load resume:', err?.message || err?.code || err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken, user?.id, navigate, isWriteUrl]);

  // 폼 필드 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 저장
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning('��름을 입력해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      toast.warning('직��을 입력해���세요.');
      return;
    }

    if (!user?.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      setIsSaving(true);

      if (isEditMode && resume) {
        await resumesApi.update(resume.id, {
          name: formData.name.trim(),
          title: formData.title.trim(),
          summary: formData.summary.trim() || null,
          profile_image: formData.profile_image.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          github: formData.github.trim() || null,
          blog: formData.blog.trim() || null,
          visibility: formData.visibility,
        });
        toast.success('이력서가 수정되었습니다.');
      } else {
        await resumesApi.create(user.id, {
          name: formData.name.trim(),
          title: formData.title.trim(),
          summary: formData.summary.trim() || undefined,
          profile_image: formData.profile_image.trim() || undefined,
          contact_email: formData.contact_email.trim() || undefined,
          github: formData.github.trim() || undefined,
          blog: formData.blog.trim() || undefined,
          visibility: formData.visibility,
        });
        toast.success('이력서가 생성되었습니다.');
      }

      navigate(`${LINK_PREFIX}/mypage`);
    } catch (err) {
      console.error('Failed to save resume:', err);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!accessToken) {
    return null;
  }

  if (isLoading) {
    return <div className="admin-loading"><p>로딩 중...</p></div>;
  }

  return (
    <div className="admin-list-page">
      <button className="admin-btn-back" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        뒤로
      </button>

      <header className="admin-page-header">
        <div className="admin-page-header-left">
          <h1>{isEditMode ? '이력서 수정' : '이력서 만들기'}</h1>
          <p>이력서 기본 정보를 입력하세요</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* 프로필 이미지 미리보기 */}
        {formData.profile_image && (
          <div className="admin-image-preview" style={{ marginBottom: '24px' }}>
            <img
              src={formData.profile_image}
              alt="프로필 미리보기"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="admin-form-group">
          <label htmlFor="name">이름 *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="admin-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: 홍길동"
            disabled={isSaving}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="title">직함 *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="admin-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="예: 프론트엔드 개발자"
            disabled={isSaving}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="summary">자기소개</label>
          <textarea
            id="summary"
            name="summary"
            className="admin-input"
            value={formData.summary}
            onChange={handleChange}
            placeholder="자신을 소개하는 간단한 글을 작성해주세요."
            rows={4}
            disabled={isSaving}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="profile_image">프로필 이미지 URL</label>
          <input
            id="profile_image"
            name="profile_image"
            type="url"
            className="admin-input"
            value={formData.profile_image}
            onChange={handleChange}
            placeholder="https://example.com/profile.jpg"
            disabled={isSaving}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

        <div className="admin-form-group">
          <label htmlFor="contact_email">연락처 이메일</label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            className="admin-input"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="your-email@example.com"
            disabled={isSaving}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="github">GitHub URL</label>
            <input
              id="github"
              name="github"
              type="url"
              className="admin-input"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              disabled={isSaving}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="blog">블로그 URL</label>
            <input
              id="blog"
              name="blog"
              type="url"
              className="admin-input"
              value={formData.blog}
              onChange={handleChange}
              placeholder="https://blog.example.com"
              disabled={isSaving}
            />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

        <div className="admin-form-group">
          <label htmlFor="visibility">공개 설정</label>
          <select
            id="visibility"
            name="visibility"
            className="admin-input"
            value={formData.visibility}
            onChange={handleChange}
            disabled={isSaving}
          >
            <option value="private">비공개 - 나만 볼 수 있음</option>
            <option value="public">공개 - 모든 사람이 볼 수 있음</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            {formData.visibility === 'public'
              ? '이력서가 "이력서 둘러보기" 페이지에 표시됩니다.'
              : '이력서가 나에게만 표시되며 다른 사람은 볼 수 없습니다.'}
          </p>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => navigate(-1)}
            disabled={isSaving}
          >
            취소
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isSaving || !formData.name.trim() || !formData.title.trim()}
          >
            {isSaving ? '저장 중...' : (isEditMode ? '수정 완료' : '이력서 만들기')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeEditorPage;
