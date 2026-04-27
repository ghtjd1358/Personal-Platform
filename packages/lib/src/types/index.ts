/**
 * MFA 공통 타입 — 도메인별 모듈 re-export 허브
 *
 * 외부에서는 `import { User, LnbMenuItem, ... } from '@sonhoseong/mfa-lib'` 그대로 사용.
 * 도메인이 늘어나면 새 파일을 만들고 여기서 re-export 만 추가.
 */

export * from './service';
export * from './permission';
export * from './menu';
export * from './app-state';
