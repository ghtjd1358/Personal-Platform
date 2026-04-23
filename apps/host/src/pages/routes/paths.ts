/**
 * Host Route Paths - 단일 소스 오브 트루스
 * 모든 경로는 이 파일에서 정의하고 다른 곳에서 import하여 사용
 */

import { REMOTE_LINK_PREFIX } from '@sonhoseong/mfa-lib';

/** 경로 상수 — remote 경로는 lib 의 REMOTE_LINK_PREFIX 단일 소스에서 가져옴 */
export const RoutePath = {
  // Container 경로 (Remote 앱들)
  Dashboard: '/container/dashboard',
  Resume: REMOTE_LINK_PREFIX.resume,
  Blog: REMOTE_LINK_PREFIX.blog,
  Portfolio: REMOTE_LINK_PREFIX.portfolio,
  JobTracker: REMOTE_LINK_PREFIX.jobtracker,

  // Auth 경로
  Login: '/login',
} as const;

/** 경로 타입 */
export type RoutePathType = (typeof RoutePath)[keyof typeof RoutePath];
