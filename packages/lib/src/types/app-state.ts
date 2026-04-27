/**
 * Redux Root State / 앱 상태 / RecentMenu / Reducer 주입 타입
 *
 * Window 전역 타입 (`__REDUX_STORE__`) 은 store/app-store.ts 에서 정의
 * — `typeof store` 로 실제 store 와 정합 유지.
 */

import { Reducer } from '@reduxjs/toolkit';
import { User } from './permission';
import { LnbMenuItem } from './menu';

/** App Slice 상태 */
export interface AppState {
  accessToken: string;
  user: User | null;
  globalLoadingTitle: string;
  service: string;
  selectedGnb: string;
}

/** 최근 본 메뉴 (탭) */
export interface RecentMenu {
  id: string;
  pathname: string;
  search: string;
  title: string;
  service?: string;
  /** router location.state — caller 가 알아서 narrow (스크롤 복원 등 자유로운 shape) */
  state?: any;
  /** 메뉴 부가 데이터 — 자유로운 shape */
  data?: any;
}

/** Host Root State */
export interface HostRootState {
  app: AppState;
  recentMenu: {
    list: RecentMenu[];
    currentId: string;
    maxTabs?: number;
  };
  menu?: {
    gnbItems: LnbMenuItem[];
    lnbItems: LnbMenuItem[];
    selectedGnbId: string;
    selectedLnbId: string;
    expandedIds: string[];
    isLoading: boolean;
  };
  [key: string]: unknown;
}

/** 동적 Reducer 주입 함수 시그니처 */
export type InjectReducerFn = (key: string, reducer: Reducer) => void;
