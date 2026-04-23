/**
 * Portfolio remote — API hook barrel.
 * 모든 API 호출은 여기 훅을 통해서. portfolio API 는 ApiResponse<T> 래핑 shape.
 */

// portfolio
export { useFetchPortfolios } from './useFetchPortfolios';
export { useFetchPortfolioDetail } from './useFetchPortfolioDetail';
export { useFetchPortfolioById } from './useFetchPortfolioById';
export { useFetchMyPortfolios } from './useFetchMyPortfolios';
export { useIncrementViewCount } from './useIncrementViewCount';
export { useCreatePortfolio } from './useCreatePortfolio';
export { useUpdatePortfolio } from './useUpdatePortfolio';
export { useDeletePortfolio } from './useDeletePortfolio';

// comments
export { useFetchComments } from './useFetchComments';
export { useCreateComment } from './useCreateComment';
export { useUpdateComment } from './useUpdateComment';
export { useDeleteComment } from './useDeleteComment';
export { useFetchCommentCount } from './useFetchCommentCount';

// likes
export { useFetchLikeStatus } from './useFetchLikeStatus';
export { useToggleLike } from './useToggleLike';

// upload
export { useUploadImage } from './useUploadImage';
export { useUploadImages } from './useUploadImages';
export { useDeleteImage } from './useDeleteImage';
