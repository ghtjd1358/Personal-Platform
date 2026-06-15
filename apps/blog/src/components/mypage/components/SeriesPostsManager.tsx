import React from 'react';
import { Button, EmptyState, LoadingSpinner } from '@sonhoseong/mfa-lib';

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

interface SeriesPostsManagerProps {
  postsLoading: boolean;
  postsSaving: boolean;
  sortedSeriesPosts: SeriesPostItem[];
  availablePosts: PostItem[];
  onMovePost: (index: number, direction: 'up' | 'down') => void;
  onTogglePost: (post: PostItem) => void;
  onSavePosts: () => void;
  onClose: () => void;
}

const SeriesPostsManager: React.FC<SeriesPostsManagerProps> = ({
  postsLoading,
  postsSaving,
  sortedSeriesPosts,
  availablePosts,
  onMovePost,
  onTogglePost,
  onSavePosts,
  onClose,
}) => {
  if (postsLoading) {
    return (
      <div className="series-posts-manager">
        <LoadingSpinner message="포스트 목록 로딩 중..." />
      </div>
    );
  }

  return (
    <div className="series-posts-manager">
      {/* 시리즈에 포함된 포스트 */}
      <div className="posts-section">
        <h4 className="posts-section-title">
          시리즈에 포함된 포스트 ({sortedSeriesPosts.length})
        </h4>
        {sortedSeriesPosts.length === 0 ? (
          <EmptyState description="아직 포스트가 없습니다. 아래에서 추가하세요." />
        ) : (
          <ul className="posts-included-list">
            {sortedSeriesPosts.map((sp, index) => (
              <li key={sp.post.id} className="post-included-item">
                <span className="post-order">{index + 1}</span>
                <span className="post-title">{sp.post.title}</span>
                <div className="post-actions">
                  <Button.Icon
                    aria-label="위로"
                    size="sm"
                    className="btn-move"
                    onClick={() => onMovePost(index, 'up')}
                    disabled={index === 0}
                    title="위로"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                    </svg>
                  </Button.Icon>
                  <Button.Icon
                    aria-label="아래로"
                    size="sm"
                    className="btn-move"
                    onClick={() => onMovePost(index, 'down')}
                    disabled={index === sortedSeriesPosts.length - 1}
                    title="아래로"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                    </svg>
                  </Button.Icon>
                  <Button.Icon
                    aria-label="제거"
                    size="sm"
                    variant="danger"
                    className="btn-remove"
                    onClick={() => onTogglePost(sp.post)}
                    title="제거"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </Button.Icon>
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
          <EmptyState description="추가할 수 있는 포스트가 없습니다." />
        ) : (
          <ul className="posts-available-list">
            {availablePosts.map((post) => (
              <li key={post.id} className="post-available-item">
                <span className="post-title">{post.title}</span>
                <Button.Icon
                  aria-label="추가"
                  size="sm"
                  variant="primary"
                  className="btn-add"
                  onClick={() => onTogglePost(post)}
                  title="추가"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </Button.Icon>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button.Group gap="sm" align="end" className="modal-actions">
        <Button type="button" variant="ghost" onClick={onClose} disabled={postsSaving}>
          취소
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSavePosts}
          disabled={postsSaving}
          loading={postsSaving}
        >
          포스트 저장
        </Button>
      </Button.Group>
    </div>
  );
};

export default SeriesPostsManager;
