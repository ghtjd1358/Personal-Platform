/**
 * App Slice 파생 셀렉터 — createSelector 로 메모이제이션
 *
 * 단일 필드 조회는 app-slice.ts 의 기본 셀렉터, 파생/계산형은 여기.
 */

import { createSelector } from '@reduxjs/toolkit';
import { selectAccessToken, selectUser } from './app-slice';

/** 인증 여부 */
export const selectIsAuthenticated = createSelector(
    [selectAccessToken],
    (token) => !!token
);

/** 사용자 역할 */
export const selectUserRole = createSelector(
    [selectUser],
    (user) => user?.role || 'guest'
);

/** 관리자 여부 */
export const selectIsAdmin = createSelector(
    [selectUser],
    (user) => user?.role === 'admin'
);

/** 사용자 권한 목록 */
export const selectUserPermissions = createSelector(
    [selectUser],
    (user) => user?.permissions || []
);
