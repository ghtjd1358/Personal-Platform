import Axios from 'axios';
import { AxiosClientFactory } from './axios-factory';

const API_BASE = (
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:4000'
) + '/api';

// refresh 전용 인스턴스 — apiClient 자체를 쓰면 401 순환 참조 발생
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

export const apiClient = AxiosClientFactory.createClient({
  hostUrl: API_BASE,
  withCredentials: true,
  refreshToken: refreshAccessToken,
});
