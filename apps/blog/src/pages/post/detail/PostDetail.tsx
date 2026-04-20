import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConfirmModal, useToast } from '@sonhoseong/mfa-lib';
import { useDeletePost, usePostDetail } from '@/hooks';
import { CommentSection, LoadingSpinner, SeriesNavigation, SEOHead, ReadingProgress } from '@/components';
import { LINK_PREFIX } from '@/config/constants';
import { PostHeader, PostContent, PostFooter } from './components';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const confirmModal = useConfirmModal();
  const { post, parsedContent, isLoading, error } = usePostDetail(slug);
  const { deletePost } = useDeletePost({
    onSuccess: () => navigate(`${LINK_PREFIX}/`),
    onError: (err) => toast.error(err),
  });

  const handleDelete = async () => {
    if (!post) return;
    const confirmed = await confirmModal.show({
      title: '게시글 삭제',
      message: '정말로 이 게시글을 삭제하시겠습니까?\n삭제된 글은 복구할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
    });
    if (confirmed) {
      await deletePost(post.id);
    }
  };

  // 에러 발생 시 에러 화면 표시
  if (error) {
    return (
      <div className="post-error">
        <div className="container">
          <div className="error-content">
            <h2>게시글을 불러올 수 없습니다</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate(`${LINK_PREFIX}/`)}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !post) {
    return <LoadingSpinner className="post-detail-loading" />;
  }

  return (
    <article className="post-detail">
      <ReadingProgress targetSelector=".post-detail" />
      <SEOHead
        title={post.title}
        description={post.excerpt || post.meta_description || undefined}
        image={post.cover_image || undefined}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        author={post.author?.name}
        tags={post.tags?.map(t => t.name)}
      />
      <PostHeader post={post} />
      <PostContent postId={post.id} content={parsedContent} />

      {/* 시리즈 네비게이션 */}
      <div className="post-series-wrapper">
        <div className="container">
          <SeriesNavigation postId={post.id} />
        </div>
      </div>

      <PostFooter
        postSlug={post.slug}
        postId={post.id}
        postTitle={post.title}
        postExcerpt={post.excerpt}
        onDelete={handleDelete}
      />
      {/* comment */}
      <div className="post-comments-wrapper">
        <div className="container">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
