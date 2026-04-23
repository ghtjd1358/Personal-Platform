import { storage, REMOTE_LINK_PREFIX, REMOTE_STANDALONE_PREFIX } from '@sonhoseong/mfa-lib';

const isHost = storage.isHostApp();

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (부모 Route 가 이미 /container/portfolio/* 소비), 단독 실행: /portfolio
export const PREFIX = isHost ? '' : REMOTE_STANDALONE_PREFIX.portfolio;

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/portfolio, 단독 실행: /portfolio
export const LINK_PREFIX = isHost ? REMOTE_LINK_PREFIX.portfolio : REMOTE_STANDALONE_PREFIX.portfolio;

/** 파일 업로드 설정 */
export const UPLOAD_CONFIG = {
  /** 이미지 최대 크기 (바이트) */
  maxImageSize: 5 * 1024 * 1024, // 5MB
  /** 허용 이미지 타입 */
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
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
