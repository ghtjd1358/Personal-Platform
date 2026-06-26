import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { getStore } from '../store/app-store';
import { setAccessToken, setUser, setSessionRestoring } from '../store/app-slice';
import { getApiClient, initApiClient } from '../network/api-client';
import { User } from '../types';

const API_BASE = (process.env.REACT_APP_API_URL ?? 'http://localhost:4000') + '/api';

// 초기화 전용 plain axios — 인터셉터 없이 refresh를 호출해 401 retry 루프 차단
const initAxios = Axios.create({ baseURL: API_BASE, withCredentials: true, timeout: 3000 });

async function restoreSession(signal: AbortSignal) {
  initApiClient();
  const store = getStore();

  try {
    // 1. HttpOnly 쿠키의 refresh token → 새 access token 요청
    const { data: refreshData } = await initAxios.post<{ data: { accessToken: string } }>(
      '/auth/refresh', undefined, { signal }
    );
    const accessToken = refreshData?.data?.accessToken;
    if (!accessToken) return;

    // 2. access token은 메모리(Redux)에만 저장 — localStorage 사용 안 함
    store.dispatch(setAccessToken(accessToken));

    // 3. 내 정보 조회 → Redux에 저장
    const { data: meData } = await getApiClient().get<{ data: User }>('/auth/me', { signal });
    const user = meData?.data;
    if (user) {
      store.dispatch(setUser(user));
    }
  } catch (err) {
    if (Axios.isCancel(err)) return; // 컴포넌트 언마운트 시 취소
    if (Axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) return; // 비로그인 정상
    console.warn('[NodeInitialize] 세션 복구 실패:', err);
  } finally {
    store.dispatch(setSessionRestoring(false));
  }
}

export function useNodeInitialize() {
  const ranRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const controller = new AbortController();
    restoreSession(controller.signal).finally(() => setInitialized(true));
    return () => controller.abort();
  }, []);

  return { initialized };
}

