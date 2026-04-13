/**
 * usePostEditorData - 에디터 초기 데이터 페칭 훅
 * 태그 목록 + 시리즈 목록 + 수정 시 기존 포스트 데이터
 */

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@sonhoseong/mfa-lib';
import { getTags, getPostDetail, getSeries, getSeriesByPostId, TagDetail, PostDetail, SeriesDetail } from '@/network';

type PostStatus = 'draft' | 'published';

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  tagIds: string[];
  seriesId: string | null;
  meta_title: string;
  meta_description: string;
}

interface UsePostEditorDataReturn {
  tags: TagDetail[];
  series: SeriesDetail[];
  originalPost: PostDetail | null;
  initialFormData: PostFormData;
  isLoading: boolean;
}

const DEFAULT_FORM_DATA: PostFormData = {
  title: '',
  content: '',
  excerpt: '',
  status: 'draft',
  tagIds: [],
  seriesId: null,
  meta_title: '',
  meta_description: '',
};

export function usePostEditorData(slug: string | undefined): UsePostEditorDataReturn {
  const [tags, setTags] = useState<TagDetail[]>([]);
  const [series, setSeries] = useState<SeriesDetail[]>([]);
  const [originalPost, setOriginalPost] = useState<PostDetail | null>(null);
  const [initialFormData, setInitialFormData] = useState<PostFormData>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(slug);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // 태그 페칭
    const tagsPromise = getTags().then((res) => {
      if (res.success && res.data) {
        setTags(res.data);
      }
    });

    // 현재 사용자의 시리즈 목록 페칭
    const seriesPromise = currentUser?.id
      ? getSeries(currentUser.id).then((res) => {
          if (res.success && res.data) {
            setSeries(res.data);
          }
        })
      : Promise.resolve();

    // 수정 모드면 포스트 데이터와 시리즈 연결 정보 페칭
    const postPromise = isEditMode && slug
      ? getPostDetail(slug, true, false).then(async (res) => {
          if (res.success && res.data) {
            const post = res.data;
            setOriginalPost(post);

            // 이 포스트가 속한 시리즈 조회
            let seriesId: string | null = null;
            const seriesRes = await getSeriesByPostId(post.id);
            if (seriesRes.success && seriesRes.data && seriesRes.data.length > 0) {
              seriesId = seriesRes.data[0].series_id;
            }

            setInitialFormData({
              title: post.title,
              content: post.content || '',
              excerpt: post.excerpt || '',
              status: post.status as PostStatus,
              tagIds: post.tags?.map((t) => t.id) || [],
              seriesId,
              meta_title: post.meta_title || '',
              meta_description: post.meta_description || '',
            });
          } else {
            setError(res.error || '게시글을 불러올 수 없습니다.');
          }
        })
      : Promise.resolve();

    Promise.all([tagsPromise, seriesPromise, postPromise])
      .catch(() => setError('데이터 로딩 중 오류가 발생했습니다.'))
      .finally(() => setIsLoading(false));
  }, [slug, isEditMode, currentUser?.id]);

  // 에러가 있으면 throw → ErrorBoundary가 처리
  if (error) {
    throw new Error(error);
  }

  return { tags, series, originalPost, initialFormData, isLoading };
}
