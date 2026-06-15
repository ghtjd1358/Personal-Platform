import { usePermission } from '@sonhoseong/mfa-lib';
import { PostSummary } from '@/network';
import { LINK_PREFIX } from '@/config/constants';
import { formatDateShort } from '@/utils';

export function usePostCard(post: PostSummary, animationDelay: number) {
  const { isAdmin } = usePermission();
  const delay = Math.min(animationDelay, 5);
  const imageLoading: 'eager' | 'lazy' = animationDelay <= 8 ? 'eager' : 'lazy';
  const fetchPriority: 'high' | 'auto' = animationDelay <= 4 ? 'high' : 'auto';
  const editLink = `${LINK_PREFIX}/edit/${post.slug || post.id}`;
  const postLink = `${LINK_PREFIX}/post/${post.slug || post.id}`;
  const formattedDate = formatDateShort(post.published_at);
  const firstLetter = post.title.charAt(0);
  const excerpt = post.excerpt || '내용 미리보기가 없습니다.';

  return { isAdmin, delay, imageLoading, fetchPriority, editLink, postLink, formattedDate, firstLetter, excerpt };
}
