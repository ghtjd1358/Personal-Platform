import { storage, REMOTE_LINK_PREFIX, REMOTE_STANDALONE_PREFIX } from '@sonhoseong/mfa-lib';

const isHost = storage.isHostApp();

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (부모 Route 가 이미 /container/blog/* 소비), 단독 실행: /blog
export const PREFIX = isHost ? '' : REMOTE_STANDALONE_PREFIX.blog;

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/blog, 단독 실행: /blog
export const LINK_PREFIX = isHost ? REMOTE_LINK_PREFIX.blog : REMOTE_STANDALONE_PREFIX.blog;

/** 파일 업로드 설정 */
export const UPLOAD_CONFIG = {
  /** 이미지 최대 크기 (바이트) */
  maxImageSize: 10 * 1024 * 1024, // 10MB
  /** 시리즈 커버 최대 크기 (바이트) */
  maxSeriesCoverSize: 5 * 1024 * 1024, // 5MB
  /** 허용 이미지 타입 */
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
} as const;

/** 블로그 설정 */
export const BLOG_CONFIG = {
  /** 블로그 시작일 (운영일수 계산용) */
  startDate: new Date('2026-02-09'),
  /** 기본 포스트 상태 */
  defaultStatus: 'published' as const,
  /** 페이지당 포스트 수 */
  postsPerPage: 20,
} as const;

/** 시간 관련 상수 (밀리초) */
export const TIME = {
  /** 1분 */
  MINUTE: 60 * 1000,
  /** 1시간 */
  HOUR: 60 * 60 * 1000,
  /** 1일 */
  DAY: 24 * 60 * 60 * 1000,
  /** 1주일 */
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;
