/**
 * Node.js API Client
 * - baseURL: REACT_APP_API_URL (개발: http://localhost:4000/api)
 * - Authorization: Bearer {accessToken} (Redux store에서 주입)
 * - 401 → /api/auth/refresh → retry (AxiosClientFactory 내장)
 */

import Axios from 'axios';
import { AxiosClientFactory, initAxiosFactory } from './axios-factory';
import { getStore } from '../store/app-store';
import { setAccessToken } from '../store/app-slice';

const API_BASE = (
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:4000'
) + '/api';

// refresh 전용 인스턴스 — apiClient 자체를 사용하면 순환 참조 발생
const refreshAxios = Axios.create({ baseURL: API_BASE, withCredentials: true });

/** HttpOnly Cookie → 새 AccessToken 발급 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await refreshAxios.post<{ data: { accessToken: string } }>('/auth/refresh');
    return res.data.data.accessToken ?? null;
  } catch {
    return null;
  }
}

// AxiosClientFactory 전역 설정 — 앱 부트 시 한 번만 실행
export function initApiClient() {
  const store = getStore();

  initAxiosFactory({
    getAccessToken: () => store.getState().app.accessToken,
    setAccessToken: (token) => store.dispatch(setAccessToken(token)),
    refreshToken: refreshAccessToken,
    onUnauthorized: () => {
      store.dispatch(setAccessToken(''));
      window.location.href = '/login';
    },
  });
}

/** 모든 remote에서 공유하는 Node.js API Axios 인스턴스 */
export const apiClient = AxiosClientFactory.createClient({ hostUrl: API_BASE });
