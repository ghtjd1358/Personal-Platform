/**
 * Comments - 포트폴리��� 댓글 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser, useAsyncConfirm } from '@sonhoseong/mfa-lib';
import { Link } from 'react-router-dom';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  Comment,
} from '@/network/apis/comments';
import { LINK_PREFIX } from '@/config/constants';

interface CommentsProps {
  portfolioId: string;
}

const Comments: React.FC<CommentsProps> = ({ portfolioId }) => {
  const confirmDialog = useAsyncConfirm();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchComments();
  }, [portfolioId]);

  const fetchComments = async () => {
    const res = await getComments(portfolioId);
    if (res.success) {
      setComments(res.data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    const res = await createComment({
      portfolio_id: portfolioId,
      content: newComment.trim(),
    });

    if (res.success) {
      setNewComment('');
      fetchComments();
    }
    setSubmitting(false);
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || submitting) return;

    setSubmitting(true);
    const res = await createComment({
      portfolio_id: portfolioId,
      content: replyContent.trim(),
      parent_id: parentId,
    });

    if (res.success) {
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
    }
    setSubmitting(false);
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim() || submitting) return;

    setSubmitting(true);
    const res = await updateComment({
      id: commentId,
      content: editContent.trim(),
    });

    if (res.success) {
      setEditingId(null);
      setEditContent('');
      fetchComments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    const ok = await confirmDialog({
      title: '댓글 삭제',
      message: '댓글을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });
    if (!ok) return;

    const res = await deleteComment(commentId);
    if (res.success) {
      fetchComments();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = currentUser?.id === comment.user_id;
    const isEditing = editingId === comment.id;

    return (
      <div key={comment.id} className={`comment-item ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            {comment.author?.avatar_url ? (
              <img
                src={comment.author.avatar_url}
                alt={comment.author.name}
                className="comment-avatar"
              />
            ) : (
              <div className="comment-avatar-placeholder">
                {comment.author?.name?.charAt(0) || '?'}
              </div>
            )}
            <span className="comment-author-name">{comment.author?.name || '익명'}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
          {isOwner && !isEditing && (
            <div className="comment-actions">
              <button
                className="comment-action-btn"
                onClick={() => {
                  setEditingId(comment.id);
                  setEditContent(comment.content);
                }}
              >
                수정
              </button>
              <button
                className="comment-action-btn delete"
                onClick={() => handleDelete(comment.id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment-textarea"
              rows={3}
            />
            <div className="comment-edit-actions">
              <button
                className="comment-btn secondary"
                onClick={() => {
                  setEditingId(null);
                  setEditContent('');
                }}
              >
                취소
              </button>
              <button
                className="comment-btn primary"
                onClick={() => handleEdit(comment.id)}
                disabled={submitting}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-content">{comment.content}</p>
            {!isReply && isAuthenticated && (
              <button
                className="comment-reply-btn"
                onClick={() => {
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                  setReplyContent('');
                }}
              >
                {replyingTo === comment.id ? '취소' : '답글'}
              </button>
            )}
          </>
        )}

        {/* 답글 입력 폼 */}
        {replyingTo === comment.id && (
          <div className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요..."
              className="comment-textarea"
              rows={2}
            />
            <button
              className="comment-btn primary"
              onClick={() => handleReply(comment.id)}
              disabled={submitting || !replyContent.trim()}
            >
              답글 달기
            </button>
          </div>
        )}

        {/* 답글 목록 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-list">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="comments-section" data-aos="fade-up">
      <div className="container">
        <h2 className="section-title">
          댓글 <span className="comment-count">({comments.length})</span>
        </h2>

        {/* 댓글 입력 폼 */}
        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <div className="comment-input-wrapper">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="comment-textarea"
                rows={3}
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={submitting || !newComment.trim()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </form>
        ) : (
          <div className="login-prompt">
            <p>댓글을 작성하려면 로그인이 필요합니다.</p>
            <Link to={`${LINK_PREFIX}/login`} className="login-btn">
              로그인
            </Link>
          </div>
        )}

        {/* 댓글 목록 */}
        {loading ? (
          <div className="comments-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => renderComment(comment))}
          </div>
        ) : (
          <div className="no-comments">
            <p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export { Comments };
