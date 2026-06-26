/**
 * Comments - 포트폴리오 댓글 컴포넌트
 */

import React, { useState } from 'react';
import { useAsyncConfirm, Button, LoadingSpinner, useInlineEdit } from '@sonhoseong/mfa-lib';
import { Link } from 'react-router-dom';
import { usePortfolioComments } from '@/hooks';
import { Comment } from '@/network/apis/comments';
import { LINK_PREFIX } from '@/config/constants';

interface CommentsProps {
  portfolioId: string;
}

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

const Comments: React.FC<CommentsProps> = ({ portfolioId }) => {
  const confirmDialog = useAsyncConfirm();
  const { comments, loading, isAuthenticated, currentUser, refetch, create, update, remove } =
    usePortfolioComments(portfolioId);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  // editingId/editContent 페어 → useInlineEdit
  const edit = useInlineEdit<string, string>('');
  const editContent = edit.draft;
  const setEditContent = edit.setDraft;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const ok = await create({ content: newComment.trim() });
    if (ok) setNewComment('');
    setSubmitting(false);
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    const ok = await create({ content: replyContent.trim(), parentId });
    if (ok) { setReplyContent(''); setReplyingTo(null); }
    setSubmitting(false);
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim() || submitting) return;
    setSubmitting(true);
    const ok = await update(commentId, editContent.trim());
    if (ok) edit.cancel();
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    const ok = await confirmDialog('댓글을 삭제하시겠습니까?', '댓글 삭제');
    if (!ok) return;
    await remove(commentId);
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = currentUser?.id === comment.user_id;
    const isEditing = edit.isEditing(comment.id);

    return (
      <div key={comment.id} className={`comment-item ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            {comment.author?.avatar_url ? (
              <img src={comment.author.avatar_url} alt={comment.author.name} className="comment-avatar" />
            ) : (
              <div className="comment-avatar-placeholder">{comment.author?.name?.charAt(0) || '?'}</div>
            )}
            <span className="comment-author-name">{comment.author?.name || '익명'}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
          {isOwner && !isEditing && (
            <div className="comment-actions">
              <Button variant="text" size="sm" className="comment-action-btn" onClick={() => edit.start(comment.id, comment.content)}>수정</Button>
              <Button variant="danger" size="sm" className="comment-action-btn delete" onClick={() => handleDelete(comment.id)}>삭제</Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="comment-edit-form">
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="comment-textarea" rows={3} />
            <div className="comment-edit-actions">
              <Button variant="ghost" size="sm" className="comment-btn secondary" onClick={() => edit.cancel()}>취소</Button>
              <Button variant="primary" size="sm" className="comment-btn primary" onClick={() => handleEdit(comment.id)} disabled={submitting} loading={submitting}>저장</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-content">{comment.content}</p>
            {!isReply && isAuthenticated && (
              <Button variant="text" size="sm" className="comment-reply-btn" onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyContent(''); }}>
                {replyingTo === comment.id ? '취소' : '답글'}
              </Button>
            )}
          </>
        )}

        {replyingTo === comment.id && (
          <div className="reply-form">
            <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="답글을 입력하세요..." className="comment-textarea" rows={2} />
            <Button variant="primary" size="sm" className="comment-btn primary" onClick={() => handleReply(comment.id)} disabled={submitting || !replyContent.trim()} loading={submitting}>답글 달기</Button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-list">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="comments-section">
      <div className="comments-inner">
        <h3 className="comments-title">
          댓글 <span className="comment-count">({comments.length})</span>
        </h3>

        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <div className="comment-input-wrapper">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." className="comment-textarea" rows={3} />
              <Button.Icon
                type="submit"
                aria-label="댓글 등록"
                variant="primary"
                className="comment-submit-btn"
                disabled={submitting || !newComment.trim()}
                loading={submitting}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </Button.Icon>
            </div>
          </form>
        ) : (
          <div className="login-prompt">
            <p>댓글을 작성하려면 로그인이 필요합니다.</p>
            <Link to={`${LINK_PREFIX}/login`} className="login-btn">로그인</Link>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="댓글을 불러오는 중..." className="comments-loading" />
        ) : comments.length > 0 ? (
          <div className="comments-list">{comments.map((comment) => renderComment(comment))}</div>
        ) : (
          <div className="no-comments"><p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p></div>
        )}
      </div>
    </section>
  );
};

export { Comments };
