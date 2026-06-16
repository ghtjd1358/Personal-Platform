import React, { useState } from 'react';
import { CommentDetail, CreateCommentRequest } from '@/network';
import { useCurrentUser, useToast, useAsyncConfirm, Button } from '@sonhoseong/mfa-lib';
import { useComments } from '@/hooks';
import { formatRelativeOrDate } from '@/utils';

interface CommentSectionProps {
  postId: string;
}

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
  onWarning: (msg: string) => void;
  onError: (msg: string) => void;
  onCreate: (params: CreateCommentRequest, userId?: string) => Promise<{ success: boolean; error?: string }>;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = '댓글을 작성하세요...',
  onWarning,
  onError,
  onCreate,
}) => {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const currentUser = useCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { onWarning('댓글 내용을 입력해주세요.'); return; }
    if (!currentUser && !authorName.trim()) { onWarning('이름을 입력해주세요.'); return; }

    setSubmitting(true);

    const params: CreateCommentRequest = {
      post_id: postId,
      content: content.trim(),
      parent_id: parentId || null,
      author_name: currentUser ? null : authorName.trim(),
    };

    onCreate(params, currentUser?.id)
      .then((result) => {
        if (result.success) {
          setContent('');
          setAuthorName('');
          onSubmit();
        } else {
          onError(result.error || '댓글 작성에 실패했습니다.');
        }
      })
      .catch(() => onError('댓글 작성 중 오류가 발생했습니다.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {!currentUser && (
        <input
          type="text"
          className="comment-author-input"
          placeholder="이름"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={50}
        />
      )}
      <textarea
        className="comment-textarea"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={1000}
      />
      <div className="comment-form-actions">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            취소
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={submitting} loading={submitting}>
          댓글 등록
        </Button>
      </div>
    </form>
  );
};

interface CommentItemProps {
  comment: CommentDetail;
  postId: string;
  onRefresh: () => void;
  onWarning: (msg: string) => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
  onCreate: (params: CreateCommentRequest, userId?: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate: (commentId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  onDelete: (commentId: string) => Promise<{ success: boolean; error?: string }>;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  onRefresh,
  onWarning,
  onError,
  onSuccess,
  onCreate,
  onUpdate,
  onDelete,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const currentUser = useCurrentUser();
  const confirmDialog = useAsyncConfirm();

  const isOwner = currentUser?.id === comment.user_id;
  const canEdit = isOwner;
  const canDelete = currentUser && (isOwner || !comment.user_id);

  const handleDelete = async () => {
    const ok = await confirmDialog('댓글을 삭제하시겠습니까?', '댓글 삭제');
    if (!ok) return;
    setDeleting(true);
    onDelete(comment.id)
      .then((result) => {
        if (result.success) { onSuccess('댓글이 삭제되었습니다.'); onRefresh(); }
        else { onError(result.error || '댓글 삭제에 실패했습니다.'); }
      })
      .catch(() => onError('댓글 삭제 중 오류가 발생했습니다.'))
      .finally(() => setDeleting(false));
  };

  const handleEdit = () => {
    if (!editContent.trim()) { onWarning('댓글 내용을 입력해주세요.'); return; }
    setUpdating(true);
    onUpdate(comment.id, editContent.trim())
      .then((result) => {
        if (result.success) { onSuccess('댓글이 수정되었습니다.'); setIsEditing(false); onRefresh(); }
        else { onError(result.error || '댓글 수정에 실패했습니다.'); }
      })
      .catch(() => onError('댓글 수정 중 오류가 발생했습니다.'))
      .finally(() => setUpdating(false));
  };

  return (
    <div
      className={`comment-item comment-item--indented ${depth > 0 ? 'comment-reply' : ''}`}
      style={{ ['--comment-depth' as any]: depth }}
    >
      <div className="comment-header">
        <div className="comment-author">
          {comment.author?.avatar_url ? (
            <img src={comment.author.avatar_url} alt={comment.author.name} className="comment-avatar" />
          ) : (
            <div className="comment-avatar-placeholder">
              {(comment.author?.name || comment.author_name || '익명').charAt(0)}
            </div>
          )}
          <span className="comment-author-name">
            {comment.author?.name || comment.author_name || '익명'}
          </span>
        </div>
        <span className="comment-date">{formatRelativeOrDate(comment.created_at)}</span>
      </div>

      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            className="comment-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            maxLength={1000}
          />
          <div className="comment-form-actions">
            <Button type="button" variant="ghost" size="sm" onClick={() => { setEditContent(comment.content); setIsEditing(false); }} disabled={updating}>취소</Button>
            <Button type="button" variant="primary" size="sm" onClick={handleEdit} disabled={updating} loading={updating}>수정</Button>
          </div>
        </div>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}

      <div className="comment-actions">
        {depth === 0 && !isEditing && (
          <Button type="button" variant="text" size="sm" className="comment-action-btn" onClick={() => setShowReplyForm(!showReplyForm)}>
            {showReplyForm ? '취소' : '답글'}
          </Button>
        )}
        {canEdit && !isEditing && (
          <Button type="button" variant="text" size="sm" className="comment-action-btn" onClick={() => setIsEditing(true)}>수정</Button>
        )}
        {canDelete && !isEditing && (
          <Button type="button" variant="danger" size="sm" className="comment-action-btn comment-delete-btn" onClick={handleDelete} disabled={deleting} loading={deleting}>
            삭제
          </Button>
        )}
      </div>

      {showReplyForm && (
        <div className="comment-reply-form">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSubmit={() => { setShowReplyForm(false); onRefresh(); }}
            onCancel={() => setShowReplyForm(false)}
            placeholder="답글을 작성하세요..."
            onWarning={onWarning}
            onError={onError}
            onCreate={onCreate}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onRefresh={onRefresh}
              onWarning={onWarning}
              onError={onError}
              onSuccess={onSuccess}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { comments, loading, totalCount, refresh, create, update, remove } = useComments(postId);
  const toast = useToast();

  return (
    <section className="comment-section">
      <div className="comment-section-header">
        <h3>댓글 <span className="comment-count">{totalCount}</span></h3>
      </div>

      <CommentForm
        postId={postId}
        onSubmit={refresh}
        onWarning={toast.warning}
        onError={toast.error}
        onCreate={create}
      />

      <div className="comment-list">
        {loading ? (
          <div className="comment-loading">댓글을 불러오는 중...</div>
        ) : comments.length === 0 ? (
          <div className="comment-empty"><p>아직 댓글이 없습니다.</p></div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onRefresh={refresh}
              onWarning={toast.warning}
              onError={toast.error}
              onSuccess={toast.success}
              onCreate={create}
              onUpdate={update}
              onDelete={remove}
            />
          ))
        )}
      </div>
    </section>
  );
};

export { CommentSection };
