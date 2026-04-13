/**
 * 댓글 타입 정의
 */

export interface Comment {
  id: string;
  portfolio_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

export interface CreateCommentRequest {
  portfolio_id: string;
  content: string;
  parent_id?: string;
}

export interface UpdateCommentRequest {
  id: string;
  content: string;
}
