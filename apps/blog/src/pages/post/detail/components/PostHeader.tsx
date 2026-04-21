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
          {/* 작성자 + 날짜 (제목 위) */}
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

          {/* 제목 */}
          <h1 className="post-title">{post.title}</h1>

          {/* excerpt */}
          {post.excerpt && (
            <p className="post-excerpt">{post.excerpt}</p>
          )}

          {/* 통계 — brutalist key=value */}
          <div className="post-stats">
            <span className="stat-item">views=[{post.view_count.toLocaleString()}]</span>
            <LikeButton postId={post.id} initialLikeCount={post.like_count} />
            <span className="stat-item">comments=[{post.comment_count}]</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export { PostHeader };
