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

type AxiosClientInstance = ReturnType<typeof AxiosClientFactory.createClient>;

/**
 * apiClient — 앱 어디서나 import할 수 있는 전역 HTTP 클라이언트
 *
 * 왜 Proxy를 쓰나?
 *  앱이 시작되면 각 Remote 앱의 모듈이 먼저 import되고, initApiClient()는 그 다음에 호출된다.
 *  즉, import 시점에는 _apiClient가 아직 undefined다.
 *  Proxy는 실제 메서드 호출이 일어나는 순간에만 _apiClient를 조회하므로
 *  "import는 먼저, 초기화는 나중에" 패턴이 가능해진다.
 *
 * 왜 빈 객체 {}를 타겟으로 쓰나?
 *  Proxy의 첫 번째 인수는 get 트랩이 없을 때 사용하는 기본 타겟이다.
 *  여기서는 모든 get을 트랩으로 직접 처리하므로 타겟 자체는 쓰이지 않는다.
 *  `{} as AxiosClientInstance`는 TypeScript에게 타입을 알려주기 위한 캐스팅일 뿐.
 */
export const apiClient = new Proxy({} as AxiosClientInstance, {
    get(_target, prop) {
        // Symbol 키는 JS 내부에서 쓰는 시스템 키다 (예: Symbol.toPrimitive).
        // 'then'은 Promise가 "thenable인지 확인"할 때 쓰는 키다.
        // 둘 다 undefined를 반환해야 Proxy가 Promise나 DevTools에서 오작동하지 않는다.
        if (typeof prop === 'symbol' || prop === 'then') return undefined;

        // 이 시점에도 _apiClient가 없다면, initApiClient()가 아직 안 불린 것이다.
        // 조용히 undefined를 반환하면 나중에 어디서 터지는지 찾기 어렵기 때문에 바로 throw한다.
        if (!_apiClient) {
            throw new Error('[apiClient] initApiClient()가 먼저 호출되어야 합니다.');
        }

        // 실제 axios 인스턴스에서 해당 속성(get/post/interceptors 등)을 가져온다.
        const value = Reflect.get(_apiClient, prop);

        // axios 메서드(get, post 등)는 함수다.
        // bind(_apiClient)를 하지 않으면 함수 안에서 this가 Proxy를 가리켜 axios 내부 로직이 깨진다.
        // 함수가 아닌 속성(baseURL 등)은 그대로 반환한다.
        return typeof value === 'function'
            ? (value as Function).bind(_apiClient)
            : value;
    },
});
