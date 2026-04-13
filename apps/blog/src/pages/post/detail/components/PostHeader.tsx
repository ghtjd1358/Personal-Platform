import React from 'react';
import { Link } from 'react-router-dom';
import { LikeButton } from '@/components';
import { formatDate } from '@/utils';
import { PostDetail } from '@/network';
import { LINK_PREFIX } from '@/config/constants';

interface PostHeaderProps {
  post: PostDetail;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <header className="post-header">
      <div className="container">
        <div className="post-header-content">
          <h1 className="post-title">{post.title}</h1>

          {/* 작성자 정보 + 날짜 */}
          <div className="post-author-info">
            {post.author && (
              <Link to={`${LINK_PREFIX}/user/${post.author.id}`} className="post-author">
                {post.author.avatar_url && (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    className="post-author-avatar"
                  />
                )}
                <span className="post-author-name">{post.author.name}</span>
              </Link>
            )}
            <span className="post-meta-separator">·</span>
            <span className="post-date">{formatDate(post.published_at)}</span>
          </div>

          {/* 통계 */}
          <div className="post-stats">
            <span className="stat-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {post.view_count}
            </span>
            <LikeButton postId={post.id} initialLikeCount={post.like_count} />
            <span className="stat-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {post.comment_count}
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag.id} className="post-tag">#{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { PostHeader };
