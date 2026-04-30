import React from 'react';
import { Link } from 'react-router-dom';
import { usePermission } from '@sonhoseong/mfa-lib';
import { PostSummary } from '@/network';
import { LINK_PREFIX } from '@/config/constants';
import { formatDateShort } from '@/utils';
import './PostCard.editorial.css';

interface PostCardProps {
  post: PostSummary;
  animationDelay?: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, animationDelay = 1 }) => {
  const delay = Math.min(animationDelay, 5);
  const imageLoading = animationDelay <= 8 ? 'eager' : 'lazy';
  const { isAdmin } = usePermission();

  return (
    <article className={`post-card animate-on-scroll delay-${delay}`}>
      {isAdmin && (
        <Link
          to={`${LINK_PREFIX}/edit/${post.slug || post.id}`}
          className="post-card-edit-btn"
          aria-label="이 글 수정"
          title="이 글 수정"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </Link>
      )}
      <Link
        to={`${LINK_PREFIX}/post/${post.slug || post.id}`}
        className="post-card-link"
      >
        <div className="post-card-thumbnail">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              loading={imageLoading}
              decoding="async"
              fetchPriority={animationDelay <= 4 ? 'high' : 'auto'}
            />
          ) : (
            <div className="post-card-thumbnail-placeholder">
              <span>{post.title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="post-card-body">
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-excerpt">
            {post.excerpt || '내용 미리보기가 없습니다.'}
          </p>
        </div>
      </Link>

      <div className="post-card-footer">
        <span className="post-card-date">{formatDateShort(post.published_at)}</span>
        <div className="post-card-stats">
          <span className="post-card-stat">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 6h-2V3a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3H3a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a1 1 0 0 0-1-1zM7 4h10v5H7V4zm13 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8h1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8h1v10z" />
            </svg>
            {post.comment_count || 0}
          </span>
          <span className="post-card-stat">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="m18 1-6 4-6-4-6 5v7l12 10 12-10V6z" />
            </svg>
            {post.like_count || 0}
          </span>
        </div>
      </div>
    </article>
  );
};

export { PostCard };
