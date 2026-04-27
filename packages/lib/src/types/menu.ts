/**
 * 메뉴 타입 (LNB / Remote LNB Items)
 */

import { ReactNode } from 'react';
import { MenuPermission } from './permission';

/** LNB 메뉴 아이템 (기본) */
export interface LnbMenuItem {
  id: string;
  title: string;
  path?: string;
  /** 아이콘 (ReactNode 또는 문자열) */
  icon?: ReactNode | string;
  /** 하위 메뉴 */
  children?: LnbMenuItem[];
  /** 권한 요구사항 (없으면 모두 접근 가능) */
  permission?: MenuPermission;
  /** 메뉴 숨김 여부 */
  hidden?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 뱃지 */
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
}

/** MenuItem은 LnbMenuItem의 별칭 (하위 호환) */
export type MenuItem = LnbMenuItem;

/** Remote에서 export하는 LnbItems 구조 (KOMCA 패턴) */
export interface RemoteLnbItems {
  /** 경로 prefix */
  pathPrefix?: string;
  /** Guest용 메뉴 (비로그인) */
  hasPrefixList?: LnbMenuItem[];
  /** Auth용 메뉴 (로그인) */
  hasPrefixAuthList?: LnbMenuItem[];
}
