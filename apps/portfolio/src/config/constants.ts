import { storage } from '@sonhoseong/mfa-lib';

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (빈 문자열), 단독 실행: /portfolio
export const PREFIX = storage.isHostApp() ? '' : '/portfolio';

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/portfolio, 단독 실행: /portfolio
export const LINK_PREFIX = storage.isHostApp() ? '/container/portfolio' : '/portfolio';

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
