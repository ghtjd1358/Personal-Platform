import { useCallback, useEffect, useState } from 'react';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  CommentDetail,
  CreateCommentRequest,
} from '@/network';

interface UseCommentsReturn {
  /** 댓글 리스트 (트리 구조 — replies 포함) */
  comments: CommentDetail[];
  /** 초기 fetch loading 여부 */
  loading: boolean;
  /** 댓글 + 답글 총 개수 (CommentSection 헤더 표시용) */
  totalCount: number;
  /** 댓글 fetch — create/update/delete 후 호출 */
  refresh: () => void;
  /** 댓글 생성 — Promise<success / error> */
  create: (params: CreateCommentRequest, userId?: string) => Promise<{ success: boolean; error?: string }>;
  /** 댓글 수정 */
  update: (commentId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  /** 댓글 삭제 */
  remove: (commentId: string) => Promise<{ success: boolean; error?: string }>;
}

/**
 * 블로그 포스트 댓글 CRUD hook.
 *
 * - postId 기반 댓글 fetch + create/update/delete API wrap.
 * - UI(CommentSection / CommentItem / CommentForm) 는 props 로 받은 callback 호출만 함.
 * - toast / confirm UX 는 hook 외부에서 처리 — hook 은 순수 데이터 layer.
 */
export function useComments(postId: string): UseCommentsReturn {
  const [comments, setComments] = useState<CommentDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    getComments(postId)
      .then((result) => {
        if (result.success && result.data) {
          setComments(result.data);
        }
      })
      .catch((err) => console.error('Failed to fetch comments:', err))
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 댓글 + 모든 답글의 총합 — 헤더 카운트
  const totalCount = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);

  const create = useCallback(
    async (params: CreateCommentRequest, userId?: string) => {
      try {
        return await createComment(params, userId);
      } catch {
        return { success: false, error: '댓글 작성 중 오류가 발생했습니다.' };
      }
    },
    []
  );

  const update = useCallback(async (commentId: string, content: string) => {
    try {
      return await updateComment(commentId, content);
    } catch {
      return { success: false, error: '댓글 수정 중 오류가 발생했습니다.' };
    }
  }, []);

  const remove = useCallback(async (commentId: string) => {
    try {
      return await deleteComment(commentId);
    } catch {
      return { success: false, error: '댓글 삭제 중 오류가 발생했습니다.' };
    }
  }, []);

  return {
    comments,
    loading,
    totalCount,
    refresh,
    create,
    update,
    remove,
  };
}
