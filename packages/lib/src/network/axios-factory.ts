/**
 * Axios Factory
 * 401 에러시 자동 토큰 갱신 포함
 */

import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';

// InternalAxiosRequestConfig에 _isRetry 필드를 추가 — module augmentation으로 any cast 없이 타입 안전하게 접근
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _isRetry?: boolean;
  }
}

// 하위 호환성 유지 — 기존 consumers(supabase-axios.ts 등)는 RequestConfig 타입을 참조하므로 삭제하지 않음
// @deprecated InternalAxiosRequestConfig를 직접 사용하세요
export type RequestConfig = InternalAxiosRequestConfig;

export type Response<ResData> = AxiosResponse<ResData>;

export interface AxiosConfig extends AxiosRequestConfig {
  hostUrl?: string;
  basePath?: string;
}

// API 에러 상세 코드
export type ErrorDetailCodeType = 'TYPE_MISMATCH' | 'NotBlank' | 'NotNull' | 'Pattern' | 'Min' | 'Max' | 'Size';

// 에러 상세 정보
export interface ErrorDetail {
  code: ErrorDetailCodeType;
  field?: string;
  message?: string;
}

// API 에러 응답
export interface ApiErrorResponse {
  code: string;
  statusCode: number;
  timestamp: string;
  message?: string;
  errorDetails?: ErrorDetail[];
}

export interface ExtendedAxiosError extends AxiosError {
  response?: AxiosResponse<ApiErrorResponse>;
}

// API 에러 여부 확인
export function isApiError(error: unknown): error is ExtendedAxiosError {
  if (!isAxiosError(error)) return false;
  const data = error.response?.data as ApiErrorResponse | undefined;
  return data?.code !== undefined && data?.statusCode !== undefined;
}

// 에러 상세 정보 확인
export function hasErrorDetails(error: unknown): ErrorDetail[] | undefined {
  if (isApiError(error) && error.response?.data?.errorDetails?.length) {
    return error.response.data.errorDetails;
  }
  return undefined;
}

// Axios 에러 여부 확인
export function isAxiosError(error: unknown): error is AxiosError {
  if (!error || typeof error !== 'object') return false;
  return Boolean((error as AxiosError).isAxiosError);
}

// 서비스 설정
export interface ServiceConfig {
  hostUrl: string;
  basePath?: string;
  timeout?: number;
}

// 토큰 갱신 함수 타입
export type RefreshTokenFn = () => Promise<string | null>;

// 에러 이벤트 디스패치 함수 타입
export type DispatchErrorFn = (errorDetails: ErrorDetail[]) => void;

// ============================================
// HTTP 에러 핸들링 타입
// ============================================

/** HTTP 에러 타입 */
export type HttpErrorType = 'toast' | 'modal' | 'silent';

/** HTTP 에러 정보 */
export interface HttpErrorInfo {
  status: number;
  message: string;
  title?: string;
  type: HttpErrorType;
  /** 원본 에러 */
  error: AxiosError;
}

/** HTTP 에러 핸들러 함수 타입 */
export type HttpErrorHandler = (errorInfo: HttpErrorInfo) => void;

/** HTTP 상태 코드별 기본 메시지 */
export const HTTP_ERROR_MESSAGES: Record<number, { message: string; title?: string; type: HttpErrorType }> = {
  400: {
    message: '요청이 올바르지 않습니다. 입력값을 확인해 주세요.',
    title: '잘못된 요청',
    type: 'toast',
  },
  401: {
    message: '로그인이 필요합니다.',
    title: '인증 필요',
    type: 'silent', // 401은 토큰 갱신으로 처리
  },
  403: {
    message: '접근 권한이 없습니다.',
    title: '권한 없음',
    type: 'toast',
  },
  404: {
    message: '요청한 리소스를 찾을 수 없습니다.',
    title: '찾을 수 없음',
    type: 'toast',
  },
  408: {
    message: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
    title: '요청 시간 초과',
    type: 'toast',
  },
  409: {
    message: '요청이 현재 서버 상태와 충돌합니다.',
    title: '충돌',
    type: 'toast',
  },
  422: {
    message: '요청 데이터를 처리할 수 없습니다.',
    title: '처리 불가',
    type: 'toast',
  },
  429: {
    message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해 주세요.',
    title: '요청 제한',
    type: 'toast',
  },
  500: {
    message: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    title: '서버 오류',
    type: 'modal',
  },
  502: {
    message: '서버와 연결할 수 없습니다.',
    title: '연결 오류',
    type: 'modal',
  },
  503: {
    message: '서비스를 일시적으로 사용할 수 없습니다.',
    title: '서비스 점검 중',
    type: 'modal',
  },
  504: {
    message: '서버 응답 시간이 초과되었습니다.',
    title: '게이트웨이 시간 초과',
    type: 'modal',
  },
};

/** 네트워크 에러 메시지 */
export const NETWORK_ERROR_MESSAGE = {
  message: '네트워크 연결을 확인해 주세요.',
  title: '네트워크 오류',
  type: 'toast' as HttpErrorType,
};

// Factory 설정
export interface FactoryConfig {
  getAccessToken: () => string;
  setAccessToken: (token: string) => void;
  refreshToken?: RefreshTokenFn;
  onError?: DispatchErrorFn;
  onUnauthorized?: () => void;
  /** HTTP 에러 핸들러 (토스트/모달 표시용) */
  onHttpError?: HttpErrorHandler;
  /** 에러 핸들링 비활성화할 상태 코드 목록 */
  silentStatusCodes?: number[];
}

// MF 환경에서 lib 가 두 인스턴스로 로드될 수 있으므로 모듈 레벨 상태는 신뢰 불가.
// 모든 공유 상태를 globalThis + Symbol.for 로 관리 — cross-instance 단일 소유권 보장.
const FACTORY_INITIALIZED_KEY = Symbol.for('mfa:factoryInitialized');
const AXIOS_INSTANCE_KEY     = Symbol.for('mfa:axiosInstance');
const FACTORY_CONFIG_KEY     = Symbol.for('mfa:factoryConfig');
const REFRESH_STATE_KEY      = Symbol.for('mfa:refreshState');

type RefreshState = {
  isRefreshing: boolean;
  subscribers: Array<{ resolve: (token: string) => void; reject: (error: Error) => void }>;
};

type GlobalStore = Record<symbol, unknown>;
const _g = globalThis as unknown as GlobalStore;

const isFactoryInitialized = () => Boolean(_g[FACTORY_INITIALIZED_KEY]);
const setFactoryInitialized = () => { _g[FACTORY_INITIALIZED_KEY] = true; };

// factoryConfig — globalThis에 보관: dual-load 시 두 인스턴스가 동일 config 공유
const getFactoryConfig = () => _g[FACTORY_CONFIG_KEY] as FactoryConfig | null ?? null;
const setFactoryConfigGlobal = (c: FactoryConfig) => { _g[FACTORY_CONFIG_KEY] = c; };

// RefreshState를 모듈 로드 시 1회만 초기화 — lazy create를 금지해 concurrent 401이
// 각자 새 객체를 얻는 race(큐 분리 → 중복 갱신) 원천 차단
_g[REFRESH_STATE_KEY] ??= { isRefreshing: false, subscribers: [] as RefreshState['subscribers'] };
const getRefreshState = (): RefreshState => _g[REFRESH_STATE_KEY] as RefreshState;

// ============================================
// 토큰 갱신 큐 헬퍼 — 모듈 스코프에 정의
// createClient 클로저에 두면 미래에 인스턴스가 둘 이상 생길 때 각자 다른 함수 객체가
// 같은 globalThis subscribers 배열을 mutate해 동작은 맞지만 의도가 불명확해짐.
// 모듈 스코프 = "이 함수들은 인스턴스 생명주기가 아닌 전역 상태에 종속됨"을 구조로 표현.
// ============================================

// 토큰 갱신 대기 큐에 콜백 추가
// signal: 원본 요청 취소 시 큐에서 제거하고 reject — 대기 누수 방지
// cleanup: settle 시 abort listener 제거 — listener 누수 방지
function subscribeTokenRefresh(signal?: AbortSignal | null): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      // CanceledError: Axios.isCancel(err) === true → 하위 .catch에서 toast/retry 방지
      reject(new Axios.CanceledError('Request canceled before token refresh'));
      return;
    }

    let abortHandler: (() => void) | undefined;
    const cleanup = () => {
      if (abortHandler && signal) {
        signal.removeEventListener('abort', abortHandler);
        abortHandler = undefined;
      }
    };

    const sub = {
      resolve: (token: string) => { cleanup(); resolve(token); },
      reject: (err: Error)     => { cleanup(); reject(err); },
    };
    getRefreshState().subscribers.push(sub);

    if (signal) {
      abortHandler = () => {
        const rs = getRefreshState();
        const idx = rs.subscribers.indexOf(sub);
        if (idx !== -1) rs.subscribers.splice(idx, 1);
        reject(new Axios.CanceledError('Request canceled during token refresh'));
      };
      signal.addEventListener('abort', abortHandler, { once: true });
    }
  });
}

// 토큰 갱신 완료 시 대기 중인 모든 요청에 새 토큰 전달
function onTokenRefreshed(token: string): void {
  const rs = getRefreshState();
  rs.subscribers.forEach(({ resolve }) => resolve(token));
  rs.subscribers = [];
}

// 토큰 갱신 실패 시 대기 중인 모든 요청 거부
// Object.assign으로 cause 보존 — 스택 트레이스를 잃지 않고 호출자가 원인을 추적할 수 있게 함
function onTokenRefreshFailed(error: Error): void {
  const rs = getRefreshState();
  rs.subscribers.forEach(({ reject }) =>
    reject(Object.assign(new Error(error.message), { cause: error }))
  );
  rs.subscribers = [];
}

// ============================================
// 응답 인터셉터 핸들러 — 각 에러 케이스를 독립 함수로 분리해 인터셉터 본문을 단순하게 유지
// ============================================

/** 취소된 요청 여부 (AbortController / axios CancelToken 모두 대응) */
function isCanceledRequest(error: unknown): boolean {
  return (
    Axios.isCancel(error) ||
    (error as AxiosError)?.code === 'ERR_CANCELED' ||
    (error as AxiosError)?.name === 'CanceledError'
  );
}

/** 네트워크 에러 감지 후 onHttpError 호출 */
function handleNetworkError(error: AxiosError): Promise<never> {
  console.error('[Network Error] 네트워크 연결을 확인해주세요.');
  getFactoryConfig()?.onHttpError?.({
    status: 0,
    message: NETWORK_ERROR_MESSAGE.message,
    title: NETWORK_ERROR_MESSAGE.title,
    type: NETWORK_ERROR_MESSAGE.type,
    error,
  });
  return Promise.reject(error);
}

/**
 * 401 응답 처리 — 토큰 갱신 후 원 요청 재시도
 *
 * 동시에 여러 401이 오면 첫 번째 요청만 갱신을 수행하고
 * 나머지는 refreshSubscribers 큐에서 대기 (single-flight 패턴)
 *
 * null 반환 = 리프레시 토큰 만료 → 로그아웃
 * throw     = 네트워크/서버 일시 오류 → 세션 유지
 */
async function handle401Refresh(
  error: AxiosError,
  axiosInstance: AxiosInstance
): Promise<AxiosResponse> {
  const fc = getFactoryConfig()!;
  const originalRequest = error.config!;

  // refresh 엔드포인트 자체의 401 또는 이미 재시도한 요청 → 무한 루프 방지
  if (originalRequest.url?.endsWith('/auth/refresh') || originalRequest._isRetry) {
    return Promise.reject(error);
  }

  const rs = getRefreshState();
  if (rs.isRefreshing) {
    // 다른 요청이 이미 갱신 중 — 완료될 때까지 대기 후 재시도
    await subscribeTokenRefresh(originalRequest.signal as AbortSignal | undefined);
    originalRequest._isRetry = true;
    return axiosInstance(originalRequest);
  }

  // 갱신 소유권 획득 — await 이전에 set해 동시 401이 큐로 진입하게 함
  rs.isRefreshing = true;
  originalRequest._isRetry = true;

  try {
    const newToken = await fc.refreshToken!();

    if (newToken) {
      fc.setAccessToken(newToken);
      onTokenRefreshed(newToken);         // 큐 대기 요청 통지
      return axiosInstance(originalRequest); // 원 요청 재시도
    }

    // null = 리프레시 토큰 만료 → 로그아웃
    console.error('[Token Refresh] refreshToken returned null — session expired');
    const authFailure = new Error('Token refresh returned null');
    fc.setAccessToken('');
    fc.onUnauthorized?.();
    onTokenRefreshFailed(authFailure);
    return Promise.reject(authFailure);
  } catch (err) {
    // 일시적 오류 (5xx, 네트워크) — 로그아웃하지 않고 세션 유지
    console.warn('[Token Refresh] transient error — keeping session:', err);
    onTokenRefreshFailed(err as Error);
    return Promise.reject(err);
  } finally {
    rs.isRefreshing = false; // 반드시 해제 — 누락 시 이후 모든 요청이 큐에 영구 적체
  }
}

/** HTTP 상태 코드별 에러 핸들러 호출 (toast / modal) */
function handleHttpStatusError(error: AxiosError, status: number, silentCodes: number[]): void {
  if (!status || silentCodes.includes(status) || status === 401) return;

  const fc = getFactoryConfig();
  if (isApiError(error)) {
    const details = hasErrorDetails(error);
    if (details) fc?.onError?.(details);
  }

  if (fc?.onHttpError) {
    const cfg = HTTP_ERROR_MESSAGES[status] ?? {
      message: `알 수 없는 오류가 발생했습니다. (${status})`,
      title: '오류',
      type: 'toast' as HttpErrorType,
    };
    const serverMsg = (error.response?.data as ApiErrorResponse)?.message;
    fc.onHttpError({
      status,
      message: String(serverMsg || cfg.message).slice(0, 500), // XSS echo 방어
      title: cfg.title,
      type: cfg.type,
      error,
    });
  }
}

// Factory 초기화
// 다중 호출 시 이전 config 가 덮어쓰여진다 — 단일 인스턴스 패턴 강제 (개발 시 경고)
export function initAxiosFactory(config: FactoryConfig) {
  if (isFactoryInitialized() && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[axiosFactory] initAxiosFactory called more than once — previous config overwritten. Only one axios client instance is supported.'
    );
  }
  setFactoryInitialized();
  setFactoryConfigGlobal(config);
}

/**
 * Axios Client Factory
 */
export class AxiosClientFactory {
  /**
   * Axios 클라이언트 생성
   */
  static createClient(
    serviceConfig: AxiosConfig,
    customRequestHandler?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig
  ): AxiosInstance {
    // factoryConfig 는 모듈 전역이지만 isRefreshing/refreshSubscribers 는 createClient 클로저에 격리됨.
    // 두 client 가 생성되면 같은 refreshToken 을 사용하면서 큐가 분리되어 중복 갱신 호출이 발생하므로
    // 단일 인스턴스 패턴을 강제한다 (dev: 경고, prod: 에러).
    // globalThis에 저장된 인스턴스 직접 확인 — setFlag/getInstance 사이 throw 시 flag=true·instance=undefined
    // 가 되는 원자성 버그를 피하기 위해 단일 키로 체크+반환 처리
    const existing = _g[AXIOS_INSTANCE_KEY] as AxiosInstance | undefined;
    if (existing) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[axiosFactory] createClient 중복 호출 — 기존 인스턴스 반환');
      }
      return existing;
    }

    // hostUrl/basePath는 커스텀 필드라 Axios에 그대로 넘기면 오염됨.
    // 화이트리스트 spread: Axios 표준 필드만 전달하고 baseURL/timeout은 명시적으로 설정.
    const { hostUrl: _h, basePath: _b, timeout: _t, ...axiosRest } = serviceConfig;
    const axiosInstance = Axios.create({
      ...axiosRest,
      baseURL: `${serviceConfig.hostUrl || ''}${serviceConfig.basePath || ''}`,
      timeout: serviceConfig.timeout || 60000,
    });

    // 요청 인터셉터
    // Axios 1.x의 config.headers는 AxiosHeaders 인스턴스 — 절대 { }로 덮어쓰지 않음
    // 덮어쓰면 Axios 내부의 헤더 정규화(Content-Type 협상, default headers merge 등)가 깨짐
    axiosInstance.interceptors.request.use(async (config) => {
      const fc = getFactoryConfig();
      if (fc) {
        const token = fc.getAccessToken();
        if (token) {
          // AxiosHeaders.set() — 타입 안전한 헤더 설정 (bracket 할당과 달리 헤더 정규화 보장)
          config.headers.set('Authorization', `Bearer ${token}`);
        }
      }

      // 재시도 요청은 원본 ID 유지 — 서버 측 idempotency 추적/중복 제거에 필요
      if (!config.headers.has('X-Request-ID')) {
        config.headers.set('X-Request-ID', uuid());
      }

      if (config.params) {
        config.params = Object.entries(config.params as Record<string, unknown>).reduce(
          (acc, [key, value]) => {
            if (value !== '' && value != null) acc[key] = value;
            return acc;
          },
          {} as Record<string, unknown>
        );
      }

      if (customRequestHandler) {
        return await customRequestHandler(config);
      }

      return config;
    });

    // 응답 인터셉터 — 각 케이스는 위의 named handler 함수로 위임
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (isCanceledRequest(error)) return Promise.reject(error);
        if (error.message === 'Network Error' || !error.response) return handleNetworkError(error);

        const status = error.response?.status;
        const fc = getFactoryConfig();

        if (status === 401 && fc?.refreshToken) {
          return handle401Refresh(error, axiosInstance);
        }

        handleHttpStatusError(error, status ?? 0, fc?.silentStatusCodes ?? []);
        return Promise.reject(error);
      }
    );

    // globalThis에 캐시 — lib가 두 번 로드되는 MF 환경에서도 두 번째 호출이 같은 인스턴스를 반환함
    _g[AXIOS_INSTANCE_KEY] = axiosInstance;
    return axiosInstance;
  }
}