import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@sonhoseong/mfa-lib';
import { ShareButton } from '@/components';
import { LINK_PREFIX } from '@/config/constants';

interface PostFooterProps {
  postSlug: string;
  postId: string;
  postTitle: string;
  postExcerpt?: string;
  onDelete: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({ postSlug, postId, postTitle, postExcerpt, onDelete }) => {
  const navigate = useNavigate();

  return (
    <footer className="post-footer">
      <div className="container">
        <div className="post-actions">
          <Button variant="secondary" onClick={() => navigate(`${LINK_PREFIX}/`)}>
            ← 목록으로
          </Button>
          <div className="post-action-buttons">
            <ShareButton title={postTitle} description={postExcerpt} />
            <Button
              variant="secondary"
              onClick={() => navigate(`${LINK_PREFIX}/edit/${postSlug || postId}`)}
            >
              수정
            </Button>
            <Button variant="danger" onClick={onDelete}>
              삭제
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { PostFooter };
