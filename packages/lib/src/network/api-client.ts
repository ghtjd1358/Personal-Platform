import Axios from 'axios';
import { AxiosClientFactory, initAxiosFactory } from './axios-factory';
import { getStore } from '../store/app-store';
import { setAccessToken } from '../store/app-slice';

let _apiClient: ReturnType<typeof AxiosClientFactory.createClient> | undefined;

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/api';

const refreshAxios = Axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await refreshAxios.post<{ data: { accessToken: string } }>('/auth/refresh');
    return res.data?.data?.accessToken ?? null;
  } catch (err) {
    if (Axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
      return null;
    }
    throw err;
  }
}

export function initApiClient(options: { onUnauthorized?: () => void } = {}) {
  if (_apiClient) return;

  const store = getStore();

  initAxiosFactory({
    getAccessToken: () => store.getState().app.accessToken,
    setAccessToken: (token) => store.dispatch(setAccessToken(token)),
    refreshToken: refreshAccessToken,
    onUnauthorized: () => {
      store.dispatch(setAccessToken(''));
      options.onUnauthorized?.();
    },
  });

  _apiClient = AxiosClientFactory.createClient({
    hostUrl: API_BASE,
    withCredentials: true,
  });
}

type AxiosClientInstance = ReturnType<typeof AxiosClientFactory.createClient>;

export function getApiClient(): AxiosClientInstance {
  if (!_apiClient) throw new Error('[apiClient] initApiClient()가 먼저 호출되어야 합니다.');
  return _apiClient;
}
