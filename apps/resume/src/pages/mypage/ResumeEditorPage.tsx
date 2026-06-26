import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useCurrentUser, useToast, selectAccessToken, LoadingSpinner, useImageUpload } from '@sonhoseong/mfa-lib';
import { resumesApi, uploadProfileImage, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import { useResumeForm } from '@/hooks';
import {
  ExperienceEditor,
  ProjectEditor,
  SkillsSelector,
  ResumeBasicSection,
  ResumeProfileSection,
  ResumeContactSection,
  ResumeVisibilitySection,
  ResumeEditorActions,
  type ExperienceFormData,
  type ProjectFormData,
} from './components';

const ResumeEditorPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const accessToken = useSelector(selectAccessToken);
  const user = useCurrentUser();

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const { formData, setFormData, handleChange, setVisibility } = useResumeForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // useImageUpload — uploadProfileImage(user.id) 결과 받아 profile_image field set.
  // user?.id 가 hook 옵션 deps 에 들어가야 하므로 uploader 는 closure 로 캡처.
  const { isUploading, inputRef: fileInputRef, handleFileChange: handleImageUpload } = useImageUpload({
    uploader: async (file) => {
      if (!user?.id) throw new Error('로그인이 필요합니다.');
      return uploadProfileImage(file, user.id);
    },
    onSuccess: (result) => {
      if (result.success && result.publicUrl) {
        setFormData((prev) => ({ ...prev, profile_image: result.publicUrl ?? prev.profile_image }));
        toast.success('이미지가 업로드되었습니다.');
      } else {
        toast.error(result.error || '업로드에 실패했습니다.');
      }
    },
    onError: (msg) => toast.error(msg),
  });

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
            skills: [],
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
        await resumesApi.update(resume.id, {
          resume_name: formData.resume_name.trim() || undefined,
          name: formData.name.trim(),
          title: formData.title.trim(),
          summary: formData.summary.trim() || undefined,
          profile_image: formData.profile_image.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          github: formData.github.trim() || null,
          blog: formData.blog.trim() || null,
          visibility: formData.visibility,
        }, user.id);
        targetResumeId = resume.id;
      } else {
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

      if (isEditMode && resume) {
        const { data: existingExps } = await experiencesApi.getByResumeId(resume.id);
        for (const exp of existingExps || []) {
          await experiencesApi.delete(exp.id);
        }
      }

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

      if (isEditMode && resume) {
        const { data: existingProjs } = await portfoliosApi.getByResumeId(resume.id);
        for (const proj of existingProjs || []) {
          await portfoliosApi.delete(proj.id);
        }
      }

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

  if (!accessToken) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullPage message="이력서를 불러오는 중..." />;
  }

  const submitDisabled =
    isSaving ||
    !formData.resume_name.trim() ||
    !formData.name.trim() ||
    !formData.title.trim();

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
          <ResumeBasicSection
            resumeName={formData.resume_name}
            onChange={handleChange}
            disabled={isSaving}
          />

          <ResumeProfileSection
            profileImage={formData.profile_image}
            name={formData.name}
            title={formData.title}
            summary={formData.summary}
            fileInputRef={fileInputRef}
            onChange={handleChange}
            onImageUpload={handleImageUpload}
            isSaving={isSaving}
            isUploading={isUploading}
          />

          <ResumeContactSection
            contactEmail={formData.contact_email}
            github={formData.github}
            blog={formData.blog}
            onChange={handleChange}
            disabled={isSaving}
          />

          <ResumeVisibilitySection
            visibility={formData.visibility}
            onChange={setVisibility}
          />

          <div className="resume-editor-section">
            <ExperienceEditor
              experiences={formData.experiences}
              onChange={(experiences) => setFormData((prev) => ({ ...prev, experiences }))}
              disabled={isSaving}
            />
          </div>

          <div className="resume-editor-section">
            <ProjectEditor
              projects={formData.projects}
              onChange={(projects) => setFormData((prev) => ({ ...prev, projects }))}
              disabled={isSaving}
            />
          </div>

          <div className="resume-editor-section">
            <SkillsSelector
              selectedSkills={formData.skills}
              onChange={(skills) => setFormData((prev) => ({ ...prev, skills }))}
              disabled={isSaving}
            />
          </div>

          <ResumeEditorActions
            isSaving={isSaving}
            isEditMode={isEditMode}
            isCreateMode={isCreateMode}
            disabled={submitDisabled}
          />
        </form>
      </div>
    </div>
  );
};

export default ResumeEditorPage;
