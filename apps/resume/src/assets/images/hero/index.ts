/**
 * Feature 카드용 정적 이미지 매핑.
 * order_index → webp asset. 홈/어드민 list/editor 모두 동일 소스 사용 → 이미지 일치 보장.
 * image_url(DB) 보다 이 매핑이 우선. 매핑 없으면 image_url 로 fallback.
 */
import reactImg from './react.webp';
import optimizationImg from './optimization.webp';
import teamworkImg from './teamwork.webp';

export const FEATURE_IMAGE_BY_ORDER: Record<number, string> = {
  1: reactImg,
  2: optimizationImg,
  3: teamworkImg,
};

export const resolveFeatureImage = (
  orderIndex?: number | null,
  imageUrl?: string | null,
): string | undefined => {
  const mapped = orderIndex ? FEATURE_IMAGE_BY_ORDER[orderIndex] : undefined;
  return mapped ?? imageUrl ?? undefined;
};
