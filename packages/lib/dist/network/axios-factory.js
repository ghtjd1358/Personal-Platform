/**
 * Axios Factory
 * 401 에러시 자동 토큰 갱신 포함
 */
import Axios from 'axios';
import { v4 as uuid } from 'uuid';
// API 에러 여부 확인
export function isApiError(error) {
    if (!isAxiosError(error))
        return false;
    const data = error.response?.data;
    return data?.code !== undefined && data?.statusCode !== undefined;
}
// 에러 상세 정보 확인
export function hasErrorDetails(error) {
    if (isApiError(error) && error.response?.data?.errorDetails?.length) {
        return error.response.data.errorDetails;
    }
    return undefined;
}
// Axios 에러 여부 확인
export function isAxiosError(error) {
    if (!error || typeof error !== 'object')
        return false;
    return Boolean(error.isAxiosError);
}
/** HTTP 상태 코드별 기본 메시지 */
export const HTTP_ERROR_MESSAGES = {
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
    type: 'toast',
};
let _factoryInitialized = false;
let _factoryConfig = null;
let _axiosInstance;
const isFactoryInitialized = () => _factoryInitialized;
const setFactoryInitialized = () => { _factoryInitialized = true; };
const getFactoryConfig = () => _factoryConfig;
const setFactoryConfigGlobal = (c) => { _factoryConfig = c; };
// RefreshState를 모듈 로드 시 1회만 초기화 — lazy create를 금지해 concurrent 401이
// 각자 새 객체를 얻는 race(큐 분리 → 중복 갱신) 원천 차단
const _refreshState = { isRefreshing: false, subscribers: [] };
const getRefreshState = () => _refreshState;
// ============================================
// 토큰 갱신 큐 헬퍼 — 모듈 스코프에 정의
// 모듈 스코프 = "이 함수들은 인스턴스 생명주기가 아닌 전역 상태에 종속됨"을 구조로 표현.
// ============================================
// 토큰 갱신 대기 큐에 콜백 추가
// signal: 원본 요청 취소 시 큐에서 제거하고 reject — 대기 누수 방지
// cleanup: settle 시 abort listener 제거 — listener 누수 방지
function subscribeTokenRefresh(signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            // CanceledError: Axios.isCancel(err) === true → 하위 .catch에서 toast/retry 방지
            reject(new Axios.CanceledError('Request canceled before token refresh'));
            return;
        }
        let abortHandler;
        const cleanup = () => {
            if (abortHandler && signal) {
                signal.removeEventListener('abort', abortHandler);
                abortHandler = undefined;
            }
        };
        const sub = {
            resolve: (token) => { cleanup(); resolve(token); },
            reject: (err) => { cleanup(); reject(err); },
        };
        getRefreshState().subscribers.push(sub);
        if (signal) {
            abortHandler = () => {
                const rs = getRefreshState();
                const idx = rs.subscribers.indexOf(sub);
                if (idx !== -1)
                    rs.subscribers.splice(idx, 1);
                reject(new Axios.CanceledError('Request canceled during token refresh'));
            };
            signal.addEventListener('abort', abortHandler, { once: true });
        }
    });
}
// 토큰 갱신 완료 시 대기 중인 모든 요청에 새 토큰 전달
function onTokenRefreshed(token) {
    const rs = getRefreshState();
    rs.subscribers.forEach(({ resolve }) => resolve(token));
    rs.subscribers = [];
}
// 토큰 갱신 실패 시 대기 중인 모든 요청 거부
// Object.assign으로 cause 보존 — 스택 트레이스를 잃지 않고 호출자가 원인을 추적할 수 있게 함
function onTokenRefreshFailed(error) {
    const rs = getRefreshState();
    rs.subscribers.forEach(({ reject }) => reject(Object.assign(new Error(error.message), { cause: error })));
    rs.subscribers = [];
}
// ============================================
// 응답 인터셉터 핸들러 — 각 에러 케이스를 독립 함수로 분리해 인터셉터 본문을 단순하게 유지
// ============================================
/** 취소된 요청 여부 (AbortController / axios CancelToken 모두 대응) */
function isCanceledRequest(error) {
    return (Axios.isCancel(error) ||
        error?.code === 'ERR_CANCELED' ||
        error?.name === 'CanceledError');
}
/** 네트워크 에러 감지 후 onHttpError 호출 */
function handleNetworkError(error) {
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
async function handle401Refresh(error, axiosInstance) {
    const fc = getFactoryConfig();
    const originalRequest = error.config;
    // refresh 엔드포인트 자체의 401 또는 이미 재시도한 요청 → 무한 루프 방지
    if (originalRequest.url?.endsWith('/auth/refresh') || originalRequest._isRetry) {
        return Promise.reject(error);
    }
    const rs = getRefreshState();
    if (rs.isRefreshing) {
        // 다른 요청이 이미 갱신 중 — 완료될 때까지 대기 후 재시도
        await subscribeTokenRefresh(originalRequest.signal);
        originalRequest._isRetry = true;
        return axiosInstance(originalRequest);
    }
    // 갱신 소유권 획득 — await 이전에 set해 동시 401이 큐로 진입하게 함
    rs.isRefreshing = true;
    originalRequest._isRetry = true;
    try {
        const newToken = await fc.refreshToken();
        if (newToken) {
            fc.setAccessToken(newToken);
            onTokenRefreshed(newToken); // 큐 대기 요청 통지
            return axiosInstance(originalRequest); // 원 요청 재시도
        }
        // null = 리프레시 토큰 만료 → 로그아웃
        console.error('[Token Refresh] refreshToken returned null — session expired');
        const authFailure = new Error('Token refresh returned null');
        fc.setAccessToken('');
        fc.onUnauthorized?.();
        onTokenRefreshFailed(authFailure);
        return Promise.reject(authFailure);
    }
    catch (err) {
        // 일시적 오류 (5xx, 네트워크) — 로그아웃하지 않고 세션 유지
        console.warn('[Token Refresh] transient error — keeping session:', err);
        onTokenRefreshFailed(err);
        return Promise.reject(err);
    }
    finally {
        rs.isRefreshing = false; // 반드시 해제 — 누락 시 이후 모든 요청이 큐에 영구 적체
    }
}
/** HTTP 상태 코드별 에러 핸들러 호출 (toast / modal) */
function handleHttpStatusError(error, status, silentCodes) {
    if (!status || silentCodes.includes(status) || status === 401)
        return;
    const fc = getFactoryConfig();
    if (isApiError(error)) {
        const details = hasErrorDetails(error);
        if (details)
            fc?.onError?.(details);
    }
    if (fc?.onHttpError) {
        const cfg = HTTP_ERROR_MESSAGES[status] ?? {
            message: `알 수 없는 오류가 발생했습니다. (${status})`,
            title: '오류',
            type: 'toast',
        };
        const serverMsg = error.response?.data?.message;
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
export function initAxiosFactory(config) {
    if (isFactoryInitialized() && process.env.NODE_ENV !== 'production') {
        console.warn('[axiosFactory] initAxiosFactory called more than once — previous config overwritten. Only one axios client instance is supported.');
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
    static createClient(serviceConfig, customRequestHandler) {
        // factoryConfig 는 모듈 전역이지만 isRefreshing/refreshSubscribers 는 createClient 클로저에 격리됨.
        // 두 client 가 생성되면 같은 refreshToken 을 사용하면서 큐가 분리되어 중복 갱신 호출이 발생하므로
        // 단일 인스턴스 패턴을 강제한다 (dev: 경고, prod: 에러).
        if (_axiosInstance) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[axiosFactory] createClient 중복 호출 — 기존 인스턴스 반환');
            }
            return _axiosInstance;
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
                config.params = Object.entries(config.params).reduce((acc, [key, value]) => {
                    if (value !== '' && value != null)
                        acc[key] = value;
                    return acc;
                }, {});
            }
            if (customRequestHandler) {
                return await customRequestHandler(config);
            }
            return config;
        });
        // 응답 인터셉터 — 각 케이스는 위의 named handler 함수로 위임
        axiosInstance.interceptors.response.use((response) => response, async (error) => {
            if (isCanceledRequest(error))
                return Promise.reject(error);
            if (error.message === 'Network Error' || !error.response)
                return handleNetworkError(error);
            const status = error.response?.status;
            const fc = getFactoryConfig();
            if (status === 401 && fc?.refreshToken) {
                return handle401Refresh(error, axiosInstance);
            }
            handleHttpStatusError(error, status ?? 0, fc?.silentStatusCodes ?? []);
            return Promise.reject(error);
        });
        // 인스턴스 캐시 — 중복 createClient 호출 시 같은 인스턴스 반환
        _axiosInstance = axiosInstance;
        return axiosInstance;
    }
}
