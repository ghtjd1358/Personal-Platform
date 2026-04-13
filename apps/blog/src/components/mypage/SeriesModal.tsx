import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentUser } from '@sonhoseong/mfa-lib';
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
  const currentUser = getCurrentUser();

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

  // 포스트가 시리즈에 포함되어 있는지 확인
  const isPostInSeries = useCallback((postId: string) => {
    return seriesPosts.some((sp) => sp.post.id === postId);
  }, [seriesPosts]);

  // 포스트 추가/제거 토글
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

  // 포스트 순서 변경
  const handleMovePost = useCallback((index: number, direction: 'up' | 'down') => {
    setSeriesPosts((prev) => {
      const newPosts = [...prev].sort((a, b) => a.order_index - b.order_index);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newPosts.length) return prev;

      [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];
      return newPosts.map((p, i) => ({ ...p, order_index: i + 1 }));
    });
  }, []);

  // 포스트 변경사항 저장
  const handleSavePosts = async () => {
    if (!series) return;

    setPostsSaving(true);
    try {
      const originalPostIds = new Set((series.posts || []).map((p) => p.post.id));
      const currentPostIds = new Set(seriesPosts.map((p) => p.post.id));

      // 제거된 포스트 처리
      for (const postId of originalPostIds) {
        if (!currentPostIds.has(postId)) {
          await removePostFromSeries(series.id, postId);
        }
      }

      // 추가된 포스트 처리
      for (const sp of seriesPosts) {
        if (!originalPostIds.has(sp.post.id)) {
          await addPostToSeries({
            series_id: series.id,
            post_id: sp.post.id,
            order_index: sp.order_index,
          });
        }
      }

      // 순서 변경 처리
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

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'series');
      if (result.success && result.data) {
        setCoverImage(result.data.url);
      } else {
        alert(result.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      alert('이미지 업로드 중 오류가 발생했습니다.');
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
          <button className="modal-close" onClick={onClose} disabled={isLoading || postsSaving}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="series-title">시리즈 제목 *</label>
              <input
                id="series-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
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
                  onChange={handleImageUpload}
                  disabled={isLoading || isUploading}
                  style={{ display: 'none' }}
                  id="series-cover-file"
                />
                <button
                  type="button"
                  className="btn-upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                >
                  {isUploading ? '업로드 중...' : '이미지 선택'}
                </button>
                <span className="upload-hint">또는 URL 직접 입력</span>
                <input
                  id="series-cover"
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
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
                  <button
                    type="button"
                    className="btn-remove-cover"
                    onClick={() => setCoverImage('')}
                    disabled={isLoading || isUploading}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                취소
              </button>
              <button type="submit" className="btn-confirm" disabled={isLoading || !title.trim()}>
                {isLoading ? (isEditing ? '수정 중...' : '생성 중...') : (isEditing ? '수정' : '생성')}
              </button>
            </div>
          </form>
        )}

        {/* 포스트 관리 탭 */}
        {activeTab === 'posts' && isEditing && (
          <div className="series-posts-manager">
            {postsLoading ? (
              <div className="posts-loading">포스트 목록 로딩 중...</div>
            ) : (
              <>
                {/* 시리즈에 포함된 포스트 */}
                <div className="posts-section">
                  <h4 className="posts-section-title">
                    시리즈에 포함된 포스트 ({sortedSeriesPosts.length})
                  </h4>
                  {sortedSeriesPosts.length === 0 ? (
                    <p className="posts-empty">아직 포스트가 없습니다. 아래에서 추가하세요.</p>
                  ) : (
                    <ul className="posts-included-list">
                      {sortedSeriesPosts.map((sp, index) => (
                        <li key={sp.post.id} className="post-included-item">
                          <span className="post-order">{index + 1}</span>
                          <span className="post-title">{sp.post.title}</span>
                          <div className="post-actions">
                            <button
                              type="button"
                              className="btn-move"
                              onClick={() => handleMovePost(index, 'up')}
                              disabled={index === 0}
                              title="위로"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="btn-move"
                              onClick={() => handleMovePost(index, 'down')}
                              disabled={index === sortedSeriesPosts.length - 1}
                              title="아래로"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => handleTogglePost(sp.post)}
                              title="제거"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 추가 가능한 포스트 */}
                <div className="posts-section">
                  <h4 className="posts-section-title">
                    추가 가능한 포스트 ({availablePosts.length})
                  </h4>
                  {availablePosts.length === 0 ? (
                    <p className="posts-empty">추가할 수 있는 포스트가 없습니다.</p>
                  ) : (
                    <ul className="posts-available-list">
                      {availablePosts.map((post) => (
                        <li key={post.id} className="post-available-item">
                          <span className="post-title">{post.title}</span>
                          <button
                            type="button"
                            className="btn-add"
                            onClick={() => handleTogglePost(post)}
                            title="추가"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={onClose} disabled={postsSaving}>
                    취소
                  </button>
                  <button
                    type="button"
                    className="btn-confirm"
                    onClick={handleSavePosts}
                    disabled={postsSaving}
                  >
                    {postsSaving ? '저장 중...' : '포스트 저장'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { SeriesModal };
