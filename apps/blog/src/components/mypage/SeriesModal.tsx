import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCurrentUser, useToast, Button } from '@sonhoseong/mfa-lib';
import {
  SeriesDetail,
  CreateSeriesRequest,
  UpdateSeriesRequest,
  getPosts,
  addPostToSeries,
  removePostFromSeries,
  reorderSeriesPosts,
  uploadImage,
} from '@/network';
import { useSeriesMutation } from '@/hooks';
import { SeriesInfoForm, SeriesPostsManager } from './components';

interface PostItem {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface SeriesPostItem {
  order_index: number;
  post: PostItem;
}

interface SeriesModalProps {
  isOpen: boolean;
  series: SeriesDetail | null;
  onClose: () => void;
  onSave: () => void;
}

type TabType = 'info' | 'posts';

const SeriesModal: React.FC<SeriesModalProps> = ({
  isOpen,
  series,
  onClose,
  onSave,
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 포스트 관리 상태
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [seriesPosts, setSeriesPosts] = useState<SeriesPostItem[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsSaving, setPostsSaving] = useState(false);

  const { create, isCreating, update, isUpdating, error, resetError } = useSeriesMutation({
    onSuccess: onSave,
  });

  const isEditing = !!series;
  const isLoading = isCreating || isUpdating;
  const currentUser = useCurrentUser();

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab('info');
      if (series) {
        setTitle(series.title);
        setDescription(series.description || '');
        setCoverImage(series.cover_image || '');
        setSeriesPosts(series.posts || []);
      } else {
        setTitle('');
        setDescription('');
        setCoverImage('');
        setSeriesPosts([]);
      }
      resetError();
    }
  }, [isOpen, series, resetError]);

  // 수정 모드에서 포스트 탭 선택 시 사용자 포스트 로드
  useEffect(() => {
    if (isOpen && isEditing && activeTab === 'posts' && currentUser?.id) {
      setPostsLoading(true);
      getPosts({ userId: currentUser.id, limit: 100 })
        .then((res) => {
          if (res.success && res.data) {
            setUserPosts(res.data.data.map((p) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              status: p.status,
            })));
          }
        })
        .finally(() => setPostsLoading(false));
    }
  }, [isOpen, isEditing, activeTab, currentUser?.id]);

  const isPostInSeries = useCallback((postId: string) => {
    return seriesPosts.some((sp) => sp.post.id === postId);
  }, [seriesPosts]);

  const handleTogglePost = useCallback((post: PostItem) => {
    if (isPostInSeries(post.id)) {
      setSeriesPosts((prev) => prev.filter((sp) => sp.post.id !== post.id));
    } else {
      const maxOrder = seriesPosts.length > 0
        ? Math.max(...seriesPosts.map((sp) => sp.order_index))
        : 0;
      setSeriesPosts((prev) => [
        ...prev,
        { order_index: maxOrder + 1, post },
      ]);
    }
  }, [seriesPosts, isPostInSeries]);

  const handleMovePost = useCallback((index: number, direction: 'up' | 'down') => {
    setSeriesPosts((prev) => {
      const newPosts = [...prev].sort((a, b) => a.order_index - b.order_index);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newPosts.length) return prev;

      [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];
      return newPosts.map((p, i) => ({ ...p, order_index: i + 1 }));
    });
  }, []);

  const handleSavePosts = async () => {
    if (!series) return;

    setPostsSaving(true);
    try {
      const originalPostIds = new Set((series.posts || []).map((p) => p.post.id));
      const currentPostIds = new Set(seriesPosts.map((p) => p.post.id));

      for (const postId of originalPostIds) {
        if (!currentPostIds.has(postId)) {
          await removePostFromSeries(series.id, postId);
        }
      }

      for (const sp of seriesPosts) {
        if (!originalPostIds.has(sp.post.id)) {
          await addPostToSeries({
            series_id: series.id,
            post_id: sp.post.id,
            order_index: sp.order_index,
          });
        }
      }

      if (seriesPosts.length > 0) {
        await reorderSeriesPosts({
          series_id: series.id,
          post_orders: seriesPosts.map((sp) => ({
            post_id: sp.post.id,
            order_index: sp.order_index,
          })),
        });
      }

      onSave();
    } catch (err) {
      console.error('포스트 저장 실패:', err);
    } finally {
      setPostsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'series');
      if (result.success && result.data) {
        setCoverImage(result.data.url);
      } else {
        toast.error(result.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
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

    if (!title.trim()) return;

    if (isEditing && series) {
      const updateData: UpdateSeriesRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        cover_image: coverImage.trim() || undefined,
      };
      await update(series.id, updateData);
    } else {
      const createData: CreateSeriesRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        cover_image: coverImage.trim() || undefined,
      };
      await create(createData);
    }
  };

  if (!isOpen) return null;

  const sortedSeriesPosts = [...seriesPosts].sort((a, b) => a.order_index - b.order_index);
  const availablePosts = userPosts.filter((p) => !isPostInSeries(p.id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-series modal-series-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '시리즈 수정' : '새 시리즈'}</h2>
          <Button.Icon
            aria-label="닫기"
            className="modal-close"
            onClick={onClose}
            disabled={isLoading || postsSaving}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </Button.Icon>
        </div>

        {/* 탭 네비게이션 (수정 모드에서만) */}
        {isEditing && (
          <div className="modal-tabs">
            <button
              type="button"
              className={`modal-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              기본 정보
            </button>
            <button
              type="button"
              className={`modal-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              포스트 관리 ({seriesPosts.length})
            </button>
          </div>
        )}

        {/* 기본 정보 탭 */}
        {activeTab === 'info' && (
          <SeriesInfoForm
            title={title}
            description={description}
            coverImage={coverImage}
            isUploading={isUploading}
            isLoading={isLoading}
            isEditing={isEditing}
            error={error}
            fileInputRef={fileInputRef}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onCoverImageChange={setCoverImage}
            onImageUpload={handleImageUpload}
            onSubmit={handleSubmit}
            onClose={onClose}
          />
        )}

        {/* 포스트 관리 탭 */}
        {activeTab === 'posts' && isEditing && (
          <SeriesPostsManager
            postsLoading={postsLoading}
            postsSaving={postsSaving}
            sortedSeriesPosts={sortedSeriesPosts}
            availablePosts={availablePosts}
            onMovePost={handleMovePost}
            onTogglePost={handleTogglePost}
            onSavePosts={handleSavePosts}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export { SeriesModal };
