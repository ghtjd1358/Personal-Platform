/**
 * Blog remote — API hook barrel.
 * 모든 API 호출은 여기 훅을 통해서. 페이지는 직접 api 함수 호출 금지.
 * blog API 는 ApiResponse<T> 래핑 shape — 훅 내부에서 언래핑.
 */

// category
export { useFetchCategories } from './useFetchCategories';

// comment
export { useFetchComments } from './useFetchComments';
export { useCreateComment } from './useCreateComment';
export { useUpdateComment } from './useUpdateComment';
export { useDeleteComment } from './useDeleteComment';

// like
export { useToggleLike } from './useToggleLike';
export { useCheckLiked } from './useCheckLiked';

// post
export { useFetchPosts } from './useFetchPosts';
export { useFetchPostDetail } from './useFetchPostDetail';
export { useCreatePost } from './useCreatePost';
export { useUpdatePost } from './useUpdatePost';
export { useDeletePost } from './useDeletePost';

// profile
export { useFetchProfile } from './useFetchProfile';
export { useFetchUserStats } from './useFetchUserStats';
export { useUpdateProfile } from './useUpdateProfile';

// series
export { useFetchSeries } from './useFetchSeries';
export { useFetchSeriesDetail } from './useFetchSeriesDetail';
export { useCreateSeries } from './useCreateSeries';
export { useUpdateSeries } from './useUpdateSeries';
export { useDeleteSeries } from './useDeleteSeries';
export { useAddPostToSeries } from './useAddPostToSeries';
export { useRemovePostFromSeries } from './useRemovePostFromSeries';
export { useReorderSeriesPosts } from './useReorderSeriesPosts';
export { useFetchSeriesByPostId } from './useFetchSeriesByPostId';

// tag
export { useFetchTags } from './useFetchTags';
export { useCreateTag } from './useCreateTag';

// upload
export { useUploadImage } from './useUploadImage';
