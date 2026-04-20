import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { getCurrentUser, useToast, selectAccessToken } from '@sonhoseong/mfa-lib';
import { resumesApi, uploadProfileImage, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile, ResumeVisibility } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import { ExperienceEditor, ProjectEditor, SkillsSelector, type ExperienceFormData, type ProjectFormData } from './components';
import '@/styles/global.css';

interface FormData {
  resume_name: string;
  name: string;
  title: string;
  summary: string;
  profile_image: string;
  contact_email: string;
  github: string;
  blog: string;
  visibility: ResumeVisibility;
  experiences: ExperienceFormData[];
  projects: ProjectFormData[];
  skills: string[];
}

const initialFormData: FormData = {
  resume_name: '',
  name: '',
  title: '',
  summary: '',
  profile_image: '',
  contact_email: '',
  github: '',
  blog: '',
  visibility: 'private',
  experiences: [],
  projects: [],
  skills: [],
};

const ResumeEditorPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const accessToken = useSelector(selectAccessToken);
  const user = getCurrentUser();

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCreateMode = location.pathname.includes('/create');
  const isEditMode = !!resumeId && !isCreateMode;

  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

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

      if (!isValidUUID(user.id)) {
        console.error('Invalid user ID format. Please re-login.');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.');
        navigate(`${LINK_PREFIX}/login`);
        return;
      }

      if (isCreateMode) {
        // 사용자 정보로 기본값 설정
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          contact_email: user.email || '',
        }));
        setIsLoading(false);
        return;
      }

      if (resumeId) {
        try {
          setIsLoading(true);
          const data = await resumesApi.getById(resumeId);

          if (data.user_id !== user.id) {
            toast.error('접근 권한이 없습니다.');
            navigate(`${LINK_PREFIX}/mypage`);
            return;
          }

          // 경력 & 프로젝트 조회
          const [expResult, projResult] = await Promise.all([
            experiencesApi.getByResumeId(resumeId),
            portfoliosApi.getByResumeId(resumeId),
          ]);

          const experiences: ExperienceFormData[] = (expResult.data || []).map((exp: any) => ({
            id: exp.id,
            company: exp.company || '',
            position: exp.position || '',
            start_date: exp.start_date || '',
            end_date: exp.end_date || '',
            is_current: exp.is_current || false,
            is_dev: exp.is_dev ?? true,
            description: exp.description || '',
          }));

          const projects: ProjectFormData[] = (projResult.data || []).map((proj: any) => ({
            id: proj.id,
            title: proj.title || '',
            role: proj.role || '',
            start_date: proj.start_date || '',
            end_date: proj.end_date || '',
            is_current: proj.is_current || false,
            description: proj.description || '',
            tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : '',
          }));

          setResume(data);
          setFormData({
            resume_name: data.resume_name || '',
            name: data.name || '',
            title: data.title || '',
            summary: data.summary || '',
            profile_image: data.profile_image || '',
            contact_email: data.contact_email || '',
            github: data.github || '',
            blog: data.blog || '',
            visibility: data.visibility || 'private',
            experiences,
            projects,
            skills: [], // TODO: 이력서별 스킬 연결 테이블 구현 시 추가
          });
        } catch (err) {
          console.error('Failed to load resume:', err);
          toast.error('이력서를 불러올 수 없습니다.');
          navigate(`${LINK_PREFIX}/mypage`);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken, user?.id, navigate, resumeId, isCreateMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file, user.id);
      if (result.success && result.publicUrl) {
        setFormData((prev) => ({ ...prev, profile_image: result.publicUrl }));
        toast.success('이미지가 업로드되었습니다.');
      } else {
        toast.error(result.error || '업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resume_name.trim()) {
      toast.warning('이력서 이름을 입력해주세요.');
      return;
    }

    if (!formData.name.trim()) {
      toast.warning('이름을 입력해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      toast.warning('직함을 입력해주세요.');
      return;
    }

    if (!user?.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      setIsSaving(true);

      let targetResumeId: string;

      if (isEditMode && resume) {
        // 1. 이력서 기본 정보 업데이트
        await resumesApi.update(resume.id, {
          resume_name: formData.resume_name.trim() || undefined,
          name: formData.name.trim(),
          title: formData.title.trim(),
          summary: formData.summary.trim() || null,
          profile_image: formData.profile_image.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          github: formData.github.trim() || null,
          blog: formData.blog.trim() || null,
          visibility: formData.visibility,
        }, user.id);
        targetResumeId = resume.id;
      } else {
        // 1. 이력서 생성
        const newResume = await resumesApi.create(user.id, {
          resume_name: formData.resume_name.trim() || '기본 이력서',
          name: formData.name.trim(),
          title: formData.title.trim(),
          summary: formData.summary.trim() || undefined,
          profile_image: formData.profile_image.trim() || undefined,
          contact_email: formData.contact_email.trim() || undefined,
          github: formData.github.trim() || undefined,
          blog: formData.blog.trim() || undefined,
          visibility: formData.visibility,
        });
        targetResumeId = newResume.id;
      }

      // 2. 경력 저장 (기존 삭제 후 재생성)
      if (isEditMode && resume) {
        // 기존 경력 삭제
        const { data: existingExps } = await experiencesApi.getByResumeId(resume.id);
        for (const exp of existingExps || []) {
          await experiencesApi.delete(exp.id);
        }
      }

      // 새 경력 생성
      for (let i = 0; i < formData.experiences.length; i++) {
        const exp = formData.experiences[i];
        if (exp.company.trim() && exp.position.trim()) {
          await experiencesApi.create({
            user_id: user.id,
            resume_id: targetResumeId,
            company: exp.company.trim(),
            position: exp.position.trim(),
            start_date: exp.start_date || new Date().toISOString().slice(0, 7),
            end_date: exp.is_current ? null : (exp.end_date || null),
            is_current: exp.is_current,
            is_dev: exp.is_dev,
            description: exp.description.trim() || undefined,
            order_index: i,
          });
        }
      }

      // 3. 프로젝트 저장 (기존 삭제 후 재생성)
      if (isEditMode && resume) {
        // 기존 프로젝트 삭제
        const { data: existingProjs } = await portfoliosApi.getByResumeId(resume.id);
        for (const proj of existingProjs || []) {
          await portfoliosApi.delete(proj.id);
        }
      }

      // 새 프로젝트 생성
      for (let i = 0; i < formData.projects.length; i++) {
        const proj = formData.projects[i];
        if (proj.title.trim() && proj.role.trim()) {
          await portfoliosApi.create({
            user_id: user.id,
            resume_id: targetResumeId,
            title: proj.title.trim(),
            role: proj.role.trim(),
            start_date: proj.start_date || new Date().toISOString().slice(0, 7),
            end_date: proj.is_current ? null : (proj.end_date || null),
            is_current: proj.is_current,
            description: proj.description.trim() || undefined,
            tech_stack: proj.tech_stack
              ? proj.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
              : [],
            order_index: i,
          });
        }
      }

      toast.success(isEditMode ? '이력서가 수정되었습니다!' : '이력서가 생성되었습니다!');
      navigate(`${LINK_PREFIX}/mypage/${targetResumeId}`);
    } catch (err) {
      console.error('Failed to save resume:', err);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const setVisibility = (value: ResumeVisibility) => {
    setFormData(prev => ({ ...prev, visibility: value }));
  };

  if (!accessToken) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="browse-loading" style={{ minHeight: '100vh' }}>
        <div className="browse-loading-spinner" />
        <span className="browse-loading-text">이력서를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="resume-editor-page">
      {/* Hero Header */}
      <section className="resume-editor-hero">
        <div className="resume-editor-hero-content">
          <Link to={`${LINK_PREFIX}/mypage`} className="resume-editor-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            내 이력서 목록
          </Link>
          <h1 className="resume-editor-title">
            {isEditMode ? '이력서 수정' : '새 이력서 만들기'}
          </h1>
          <p className="resume-editor-subtitle">
            {isEditMode
              ? '이력서 정보를 수정하고 저장하세요'
              : '나만의 멋진 이력서를 만들어보세요'}
          </p>
        </div>
      </section>

      {/* Form Container */}
      <div className="resume-editor-container">
        <form onSubmit={handleSubmit}>
          {/* Section 1: 기본 정보 */}
          <div className="resume-editor-section">
            <div className="resume-editor-section-header">
              <div className="resume-editor-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <h3 className="resume-editor-section-title">이력서 정보</h3>
                <p className="resume-editor-section-desc">이력서를 구분하기 위한 기본 정보</p>
              </div>
            </div>

            <div className="resume-editor-field">
              <label className="resume-editor-label">
                이력서 이름 <span>*</span>
              </label>
              <input
                type="text"
                name="resume_name"
                className="resume-editor-input"
                value={formData.resume_name}
                onChange={handleChange}
                placeholder="예: 프론트엔드 이력서, 풀스택 개발자 이력서"
                disabled={isSaving}
              />
              <p className="resume-editor-hint">
                여러 이력서를 구분하기 위한 이름입니다. (예: "프론트엔드 이력서", "스타트업용 이력서")
              </p>
            </div>
          </div>

          {/* Section 2: 프로필 */}
          <div className="resume-editor-section">
            <div className="resume-editor-section-header">
              <div className="resume-editor-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h3 className="resume-editor-section-title">프로필 정보</h3>
                <p className="resume-editor-section-desc">이력서에 표시될 개인 정보</p>
              </div>
            </div>

            {/* 프로필 이미지 업로드 */}
            <div className="resume-editor-field">
              <label className="resume-editor-label">프로필 이미지</label>
              <div className="resume-editor-upload">
                <div className="resume-editor-upload-preview">
                  {formData.profile_image ? (
                    <img src={formData.profile_image} alt="프로필" />
                  ) : (
                    <div className="resume-editor-upload-preview-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="resume-editor-upload-controls">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={isSaving || isUploading}
                  />
                  <button
                    type="button"
                    className="resume-editor-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="spinner-small" style={{ width: 14, height: 14, borderWidth: 2 }} />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        이미지 업로드
                      </>
                    )}
                  </button>
                  <p className="resume-editor-hint" style={{ marginTop: 0 }}>
                    JPG, PNG, WebP, GIF (최대 5MB)
                  </p>
                  {formData.profile_image && (
                    <input
                      type="text"
                      name="profile_image"
                      className="resume-editor-input"
                      value={formData.profile_image}
                      onChange={handleChange}
                      placeholder="이미지 URL"
                      disabled={isSaving}
                      style={{ marginTop: '8px', fontSize: '0.8rem' }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="resume-editor-row">
              <div className="resume-editor-field">
                <label className="resume-editor-label">
                  이름 <span>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="resume-editor-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  disabled={isSaving}
                />
              </div>

              <div className="resume-editor-field">
                <label className="resume-editor-label">
                  직함 <span>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="resume-editor-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="프론트엔드 개발자"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="resume-editor-field">
              <label className="resume-editor-label">자기소개</label>
              <textarea
                name="summary"
                className="resume-editor-textarea"
                value={formData.summary}
                onChange={handleChange}
                placeholder="안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.&#10;&#10;React와 TypeScript를 주로 사용하며, 깔끔한 코드와 효율적인 설계를 지향합니다.&#10;새로운 기술을 배우고 팀과 함께 성장하는 것을 즐깁니다."
                rows={5}
                disabled={isSaving}
              />
              <p className="resume-editor-hint">
                자신을 소개하는 글을 작성해주세요. (팁: 강점, 기술 스택, 목표 등을 간단히 언급)
              </p>
            </div>
          </div>

          {/* Section 3: 연락처 & 링크 */}
          <div className="resume-editor-section">
            <div className="resume-editor-section-header">
              <div className="resume-editor-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <div>
                <h3 className="resume-editor-section-title">연락처 & 링크</h3>
                <p className="resume-editor-section-desc">연락 받을 이메일과 소셜 링크</p>
              </div>
            </div>

            <div className="resume-editor-field">
              <label className="resume-editor-label">연락처 이메일</label>
              <input
                type="email"
                name="contact_email"
                className="resume-editor-input"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="your-email@example.com"
                disabled={isSaving}
              />
              <p className="resume-editor-hint">
                채용 담당자나 협업 제안 연락을 받을 이메일
              </p>
            </div>

            <div className="resume-editor-row">
              <div className="resume-editor-field">
                <label className="resume-editor-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  className="resume-editor-input"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  disabled={isSaving}
                />
              </div>

              <div className="resume-editor-field">
                <label className="resume-editor-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  블로그 / 포트폴리오
                </label>
                <input
                  type="url"
                  name="blog"
                  className="resume-editor-input"
                  value={formData.blog}
                  onChange={handleChange}
                  placeholder="https://blog.example.com"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Section 4: 공개 설정 */}
          <div className="resume-editor-section">
            <div className="resume-editor-section-header">
              <div className="resume-editor-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div>
                <h3 className="resume-editor-section-title">공개 설정</h3>
                <p className="resume-editor-section-desc">이력서의 공개 범위를 설정하세요</p>
              </div>
            </div>

            <div className="resume-editor-visibility">
              <div
                className={`resume-editor-visibility-option ${formData.visibility === 'private' ? 'active' : ''}`}
                onClick={() => setVisibility('private')}
              >
                <div className="resume-editor-visibility-icon" style={{ background: formData.visibility === 'private' ? undefined : 'var(--color-bg)' }}>
                  🔒
                </div>
                <div className="resume-editor-visibility-text">
                  <h4>비공개</h4>
                  <p>나만 볼 수 있습니다</p>
                </div>
              </div>

              <div
                className={`resume-editor-visibility-option ${formData.visibility === 'public' ? 'active' : ''}`}
                onClick={() => setVisibility('public')}
              >
                <div className="resume-editor-visibility-icon" style={{ background: formData.visibility === 'public' ? undefined : 'var(--color-bg)' }}>
                  🌐
                </div>
                <div className="resume-editor-visibility-text">
                  <h4>공개</h4>
                  <p>"이력서 둘러보기"에 표시됩니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: 경력 */}
          <div className="resume-editor-section">
            <ExperienceEditor
              experiences={formData.experiences}
              onChange={(experiences) => setFormData((prev) => ({ ...prev, experiences }))}
              disabled={isSaving}
            />
          </div>

          {/* Section 6: 프로젝트 */}
          <div className="resume-editor-section">
            <ProjectEditor
              projects={formData.projects}
              onChange={(projects) => setFormData((prev) => ({ ...prev, projects }))}
              disabled={isSaving}
            />
          </div>

          {/* Section 7: 기술 스택 */}
          <div className="resume-editor-section">
            <SkillsSelector
              selectedSkills={formData.skills}
              onChange={(skills) => setFormData((prev) => ({ ...prev, skills }))}
              disabled={isSaving}
            />
          </div>

          {/* Actions */}
          <div className="resume-editor-actions">
            <button
              type="button"
              className="resume-editor-btn resume-editor-btn--secondary"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className="resume-editor-btn resume-editor-btn--primary"
              disabled={isSaving || !formData.resume_name.trim() || !formData.name.trim() || !formData.title.trim()}
            >
              {isSaving ? (
                <>
                  <span className="spinner-small" style={{ width: 16, height: 16 }} />
                  저장 중...
                </>
              ) : isEditMode ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  수정 완료
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  이력서 만들기
                </>
              )}
            </button>
          </div>

          {/* 안내 메시지 */}
          {isCreateMode && (
            <div style={{
              marginTop: '24px',
              padding: '16px 20px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                💡 <strong>팁:</strong> 경력과 프로젝트를 위에서 바로 추가할 수 있습니다.
                기술 스택도 선택하여 더 풍부한 이력서를 만들어보세요!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResumeEditorPage;
