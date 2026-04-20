import { supabaseAxios } from '../../axios-instance';
import { isAxiosError } from '../../axios-factory';
import { ApiResponse } from '../common';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from './types';

/** Axios 에러에서 메시지 추출 */
function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

/**
 * 포트폴리오의 댓글 목록을 조회합니다.
 */
export async function getComments(
  portfolioId: string
): Promise<ApiResponse<Comment[]>> {
  try {
    const { data } = await supabaseAxios.get<Comment[]>(
      `/portfolio_comments?portfolio_id=eq.${portfolioId}&parent_id=is.null`,
      {
        params: {
          select: `*,author:profiles(id,name,avatar_url),replies:portfolio_comments(id,portfolio_id,user_id,parent_id,content,created_at,updated_at,author:profiles(id,name,avatar_url))`,
          order: 'created_at.desc',
        },
      }
    );

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error fetching comments:', err);
    return {
      success: false,
      error: getErrorMessage(err, '댓글 조회 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 댓글을 작성합니다.
 */
export async function createComment(
  request: CreateCommentRequest
): Promise<ApiResponse<Comment>> {
  try {
    const { data } = await supabaseAxios.post<Comment[]>(
      '/portfolio_comments',
      request,
      {
        headers: {
          'Prefer': 'return=representation',
        },
      }
    );

    if (!data || data.length === 0) {
      return { success: false, error: '댓글 작성에 실패했습니다.' };
    }

    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Error creating comment:', err);
    return {
      success: false,
      error: getErrorMessage(err, '댓글 작성 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 댓글을 수정합니다.
 */
export async function updateComment(
  request: UpdateCommentRequest
): Promise<ApiResponse<Comment>> {
  try {
    const { data } = await supabaseAxios.patch<Comment[]>(
      `/portfolio_comments?id=eq.${request.id}`,
      { content: request.content },
      {
        headers: {
          'Prefer': 'return=representation',
        },
      }
    );

    if (!data || data.length === 0) {
      return { success: false, error: '댓글 수정에 실패했습니다.' };
    }

    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Error updating comment:', err);
    return {
      success: false,
      error: getErrorMessage(err, '댓글 수정 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 댓글을 삭제합니다.
 */
export async function deleteComment(
  commentId: string
): Promise<ApiResponse<void>> {
  try {
    // 답글 먼저 삭제
    await supabaseAxios.delete(`/portfolio_comments?parent_id=eq.${commentId}`);
    // 댓글 삭제
    await supabaseAxios.delete(`/portfolio_comments?id=eq.${commentId}`);

    return { success: true, data: undefined };
  } catch (err) {
    console.error('Error deleting comment:', err);
    return {
      success: false,
      error: getErrorMessage(err, '댓글 삭제 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 댓글 개수를 조회합니다.
 */
export async function getCommentCount(
  portfolioId: string
): Promise<ApiResponse<number>> {
  try {
    const { headers } = await supabaseAxios.head(
      `/portfolio_comments?portfolio_id=eq.${portfolioId}`,
      {
        headers: {
          'Prefer': 'count=exact',
        },
      }
    );

    const contentRange = headers['content-range'];
    let count = 0;
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)/);
      if (match) {
        count = parseInt(match[1], 10);
      }
    }

    return { success: true, data: count };
  } catch {
    return { success: true, data: 0 };
  }
}
