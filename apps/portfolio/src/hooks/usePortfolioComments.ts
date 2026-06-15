import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser } from '@sonhoseong/mfa-lib';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  Comment,
} from '@/network/apis/comments';

interface UsePortfolioCommentsReturn {
  /** 댓글 트리 (replies 포함) */
  comments: Comment[];
  /** 초기 fetch loading */
  loading: boolean;
  /** 로그인 여부 — 댓글 작성 폼 노출 분기 */
  isAuthenticated: boolean;
  /** 현재 로그인 유저 — 작성자 본인 여부 비교용 */
  currentUser: ReturnType<typeof getCurrentUser>;
  /** 강제 refetch — create/update/delete 성공 시 호출 */
  refetch: () => void;
  /** 댓글 생성 (root 또는 reply). parent_id 가 있으면 답글. */
  create: (params: { content: string; parentId?: string }) => Promise<boolean>;
  /** 댓글 수정 */
  update: (commentId: string, content: string) => Promise<boolean>;
  /** 댓글 삭제 */
  remove: (commentId: string) => Promise<boolean>;
}

/**
 * 포트폴리오 상세 댓글 CRUD hook.
 *
 * - portfolioId 기반 댓글 fetch + mutation API wrap.
 * - 로그인 상태/현재 유저는 Redux selector + helper 통해 한 곳에서 제공.
 * - UI(Comments) 는 props 받아 렌더링만, 모든 API 호출은 hook 메서드를 통해 진행.
 */
export function usePortfolioComments(portfolioId: string): UsePortfolioCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();

  const refetch = useCallback(async () => {
    const res = await getComments(portfolioId);
    if (res.success) {
      setComments(res.data || []);
    }
    setLoading(false);
  }, [portfolioId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!currentUser?.id) return false; // RLS 가 거부하는 케이스 사전 차단
      const res = await createComment({
        portfolio_id: portfolioId,
        user_id: currentUser.id,
        content,
        parent_id: parentId,
      });

      if (res.success) {
        await refetch();
        return true;
      }
      return false;
    },
    [portfolioId, currentUser?.id, refetch]
  );

  const update = useCallback(
    async (commentId: string, content: string) => {
      const res = await updateComment({ id: commentId, content });
      if (res.success) {
        await refetch();
        return true;
      }
      return false;
    },
    [refetch]
  );

  const remove = useCallback(
    async (commentId: string) => {
      const res = await deleteComment(commentId);
      if (res.success) {
        await refetch();
        return true;
      }
      return false;
    },
    [refetch]
  );

  return {
    comments,
    loading,
    isAuthenticated,
    currentUser,
    refetch,
    create,
    update,
    remove,
  };
}
