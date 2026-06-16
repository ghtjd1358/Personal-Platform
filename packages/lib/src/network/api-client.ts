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

// Webpack MF의 shared: { singleton: true } 가 lib을 1회만 로드함 → 모듈 레벨 변수로 충분
let _apiClient: ReturnType<typeof AxiosClientFactory.createClient> | undefined;
const getApiClientInstance = () => _apiClient;

const API_BASE = (
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:4000'
) + '/api';

// refresh 전용 인스턴스 — apiClient 자체를 사용하면 순환 참조 발생
// timeout: refresh 응답이 hang 되면 isRefreshing=true 가 영구 박혀 모든 후속 요청이 큐에 무한 적체.
// 10초 안에 응답 없으면 일시적 실패로 reject → finally 가 isRefreshing 해제하도록 한다.
const refreshAxios = Axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

/** HttpOnly Cookie → 새 AccessToken 발급 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await refreshAxios.post<{ data: { accessToken: string } }>('/auth/refresh');
    // optional chaining — refresh 응답 shape 가 깨졌어도 throw 대신 null 반환 (정상 로그아웃 흐름)
    return res.data?.data?.accessToken ?? null;
  } catch (err) {
    // 401 (만료) / 403 (서버에서 폐기) → 둘 다 로그아웃 흐름
    if (Axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
      return null; // 인증 만료 또는 토큰 폐기 → 로그아웃 흐름
    }
    // 그 외 (네트워크 오류, 서버 오류 등) → 일시적 오류, 로그아웃 하지 않음
    console.warn('[apiClient] 토큰 갱신 실패 (일시적 오류):', err);
    throw err;
  }
}

// AxiosClientFactory 전역 설정 — 앱 부트 시 한 번만 실행
// onUnauthorized: 401 최종 실패 시 호출. 라우팅은 host가 결정한다.
export function initApiClient(options: { onUnauthorized?: () => void } = {}) {
  // 멱등성 보장 — 중복 호출 시에도 한 번만 초기화
  if (getApiClientInstance()) return;

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

  // factory 초기화 이후에 client 생성 — 인터셉터가 factoryConfig 를 정상 참조할 수 있는 시점.
  _apiClient = AxiosClientFactory.createClient({
      hostUrl: API_BASE,
      withCredentials: true, // refresh cookie 전송을 위해 필요
  });
}

/**
 * Lazy Axios Proxy 팩토리
 *
 * `initApiClient()` 호출 전에도 import할 수 있게 해주는 Proxy 래퍼.
 * 실제 axios 인스턴스는 첫 번째 메서드 호출 시점에 `getInstance()`로 가져옴.
 *
 * - get:   bound function 캐시로 reference equality 보장 (useCallback dep 안전)
 * - apply: `apiClient(config)` 직접 호출 패턴 지원
 * - set:   axios.defaults 등 외부에서 인스턴스 프로퍼티 수정 가능
 */
type AxiosClientInstance = ReturnType<typeof AxiosClientFactory.createClient>;
const _boundCache = new WeakMap<object, Map<string | symbol, Function>>();

function createLazyAxiosProxy(getInstance: () => AxiosClientInstance | undefined): AxiosClientInstance {
    return new Proxy(function(){} as unknown as AxiosClientInstance, {
        get(_target, prop) {
            const instance = getInstance();
            // Symbol / thenable 키는 Promise.resolve / DevTools 탐색 시 throw 방지
            if (typeof prop === 'symbol' || prop === 'then' || prop === 'catch' || prop === 'finally') {
                return instance ? Reflect.get(instance, prop, instance) : undefined;
            }
            if (!instance) throw new Error('[apiClient] initApiClient()가 호출되지 않았습니다. bootstrap.tsx를 확인하세요.');
            const val = Reflect.get(instance, prop, instance);
            if (typeof val !== 'function') return val;
            // 매 get마다 새 bind() 생성 방지 — WeakMap 캐시로 재사용
            let cache = _boundCache.get(instance);
            if (!cache) { cache = new Map(); _boundCache.set(instance, cache); }
            if (!cache.has(prop)) cache.set(prop, (val as Function).bind(instance));
            return cache.get(prop);
        },
        apply(_target, _thisArg, args) {
            const instance = getInstance();
            if (!instance) throw new Error('[apiClient] initApiClient()가 호출되지 않았습니다.');
            return (instance as unknown as Function).apply(instance, args);
        },
        set(_target, prop, value) {
            const instance = getInstance();
            if (!instance) throw new Error('[apiClient] initApiClient()가 호출되지 않았습니다.');
            (instance as unknown as Record<string | symbol, unknown>)[prop as string] = value;
            return true;
        },
    });
}

/** 모든 remote에서 공유하는 Node.js API Axios 인스턴스 (initApiClient() 이후 사용 가능) */
export const apiClient = createLazyAxiosProxy(getApiClientInstance);
