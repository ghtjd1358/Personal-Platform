/**
 * Host Route Paths - 단일 소스 오브 트루스
 * 모든 경로는 이 파일에서 정의하고 다른 곳에서 import하여 사용
 */

/** 경로 상수 */
export const RoutePath = {
  // Container 경로 (Remote 앱들)
  Dashboard: '/container/dashboard',
  Resume: '/container/resume',
  Blog: '/container/blog',
  Portfolio: '/container/portfolio',
  JobTracker: '/container/jobtracker',

  // Auth 경로
  Login: '/login',
} as const;

/** 경로 타입 */
export type RoutePathType = (typeof RoutePath)[keyof typeof RoutePath];
