import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, useToast } from '@sonhoseong/mfa-lib';
import { TiptapEditor, EditorHeader, TagSelector } from '@/components/editor';
import { LoadingSpinner } from '@/components/loading';
import { usePostEditorData, useCreatePost, useUpdatePost, usePostAutosave, PostFormData } from '@/hooks';
import { CreatePostRequest, UpdatePostRequest } from '@/network';
import { LINK_PREFIX } from '@/config/constants';
import './PostEditor.editorial.css';

type PostStatus = 'draft' | 'published';

const PostEditor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = getCurrentUser();
  const isEditMode = Boolean(slug);

  // 데이터 페칭 (시리즈는 더 이상 UI에 노출하지 않지만 initialFormData 호환성 유지)
  const { tags, originalPost, initialFormData, isLoading } = usePostEditorData(slug);

  // 뮤테이션
  const { createPost, isCreating } = useCreatePost({
    onSuccess: (id) => {
      clearAutosave();
      navigate(`${LINK_PREFIX}/post/${id}`);
    },
    onError: (err) => toast.error(err),
  });

  const { updatePost, isUpdating } = useUpdatePost({
    onSuccess: () => {
      clearAutosave();
      toast.success('게시글이 수정되었습니다.');
      navigate(`${LINK_PREFIX}/post/${originalPost?.slug || originalPost?.id}`);
    },
    onError: (err) => toast.error(err),
  });

  // 폼 상태
  const [formData, setFormData] = useState<PostFormData>(initialFormData);

  // initialFormData가 변경되면 formData 업데이트 (수정 모드에서 데이터 로드 후)
  React.useEffect(() => {
    if (initialFormData.title) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  // 자동 저장 훅 (생성 모드에서만 활성화)
  const { lastSavedAt, hasUnsavedChanges, markAsChanged, clearAutosave } = usePostAutosave({
    isEditMode,
    formData,
    setFormData,
  });

  const isSaving = isCreating || isUpdating;

  // 제출 핸들러
  const handleSubmit = useCallback((status: PostStatus) => {
    if (!formData.title.trim()) {
      toast.warning('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      toast.warning('내용을 입력해주세요.');
      return;
    }

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: null,
      status,
      tagIds: formData.tagIds,
      meta_title: null,
      meta_description: null,
    };

    if (isEditMode && originalPost) {
      updatePost(originalPost.id, postData as UpdatePostRequest);
    } else {
      if (!currentUser?.id) {
        toast.error('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      createPost({ ...postData, user_id: currentUser.id } as CreatePostRequest);
    }
  }, [formData, isEditMode, originalPost, currentUser, createPost, updatePost, navigate, toast]);

  // 태그 토글
  const handleTagToggle = useCallback((tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  }, []);

  // 폼 필드 업데이트
  const updateField = useCallback(<K extends keyof PostFormData>(
    field: K,
    value: PostFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    markAsChanged();
  }, [markAsChanged]);

  if (isLoading) {
    return <LoadingSpinner className="editor-loading" />;
  }

  return (
    <div className="post-editor-page">
      <EditorHeader
        isEditMode={isEditMode}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        hasUnsavedChanges={hasUnsavedChanges}
        onBack={() => navigate(-1)}
        onSaveDraft={() => handleSubmit('draft')}
        onPublish={() => handleSubmit('published')}
      />

      <div className="editor-main">
        <div className="editor-content-area">
          <input
            type="text"
            className="editor-title-input"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
          />

          <TagSelector
            tags={tags}
            selectedTagIds={formData.tagIds}
            onTagToggle={handleTagToggle}
          />

          <TiptapEditor
            key={originalPost?.id || 'new'}
            content={formData.content}
            onChange={(content) => updateField('content', content)}
            placeholder="여기에 내용을 작성하세요..."
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
