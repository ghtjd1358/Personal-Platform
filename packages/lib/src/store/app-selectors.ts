import { createSelector } from '@reduxjs/toolkit';
import { selectAccessToken, selectUser } from './app-slice';

export const selectIsAuthenticated = createSelector(
    [selectAccessToken],
    (token) => !!token
);

export const selectUserRole = createSelector(
    [selectUser],
    (user) => user?.role || 'guest'
);

export const selectIsAdmin = createSelector(
    [selectUser],
    (user) => user?.role === 'admin'
);

export const selectUserPermissions = createSelector(
    [selectUser],
    (user) => user?.permissions || []
);
