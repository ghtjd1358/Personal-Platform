/**
 * QueryString 유틸리티
 * URL 쿼리 파라미터 파싱 및 생성
 * KOMCA 패턴 업그레이드 버전 (lodash 의존성 제거)
 */

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

/**
 * URL 쿼리 스트링을 객체로 파싱
 * @example
 * parseQueryString('?name=홍길동&age=30')
 * // { name: '홍길동', age: '30' }
 */
export function parseQueryString(searchStr?: string): Record<string, string | undefined> {
  const search = searchStr
    ? searchStr.replace(/^\?/, '')
    : (typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '');

  if (!search) {
    return {};
  }

  return search.split('&').reduce((acc, token) => {
    const [key, value] = token.split('=');
    if (key) {
      acc[decodeURIComponent(key)] = value !== undefined
        ? decodeURIComponent(value)
        : undefined;
    }
    return acc;
  }, {} as Record<string, string | undefined>);
}

/**
 * 객체를 쿼리 스트링으로 변환
 * @example
 * createQueryString({ name: '홍길동', age: 30 })
 * // 'name=%ED%99%8D%EA%B8%B8%EB%8F%99&age=30'
 */
export function createQueryString(params: QueryParams): string {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return entries.join('&');
}

/**
 * 현재 URL에 쿼리 파라미터 추가/업데이트
 * @example
 * updateQueryParams({ page: 2, sort: 'name' })
 * // 현재 URL에 ?page=2&sort=name 추가
 */
export function updateQueryParams(
  params: QueryParams,
  options?: { replace?: boolean }
): void {
  if (typeof window === 'undefined') return;

  const currentParams = parseQueryString();
  const newParams = { ...currentParams };

  // 새 파라미터 추가/업데이트
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete newParams[key];
    } else {
      newParams[key] = String(value);
    }
  });

  const queryString = createQueryString(newParams);
  const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;

  if (options?.replace) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.history.pushState(null, '', newUrl);
  }
}

/**
 * 특정 쿼리 파라미터 값 가져오기
 * @example
 * getQueryParam('page') // '1'
 * getQueryParam('page', '1') // 기본값 '1'
 */
export function getQueryParam(key: string, defaultValue?: string): string | undefined {
  const params = parseQueryString();
  return params[key] ?? defaultValue;
}

/**
 * 특정 쿼리 파라미터 삭제
 * @example removeQueryParam('page')
 */
export function removeQueryParam(key: string, options?: { replace?: boolean }): void {
  updateQueryParams({ [key]: undefined }, options);
}

/**
 * 모든 쿼리 파라미터 삭제
 */
export function clearQueryParams(options?: { replace?: boolean }): void {
  if (typeof window === 'undefined') return;

  const newUrl = window.location.pathname;

  if (options?.replace) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.history.pushState(null, '', newUrl);
  }
}

/**
 * URL에 쿼리 스트링 추가
 * @example
 * appendQueryString('/users', { page: 1, size: 10 })
 * // '/users?page=1&size=10'
 */
export function appendQueryString(url: string, params: QueryParams): string {
  const queryString = createQueryString(params);
  if (!queryString) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
}

/**
 * 쿼리 파라미터를 숫자로 파싱
 * @example getQueryParamAsNumber('page', 1) // 1
 */
export function getQueryParamAsNumber(key: string, defaultValue: number = 0): number {
  const value = getQueryParam(key);
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 쿼리 파라미터를 boolean으로 파싱
 * @example getQueryParamAsBoolean('active', false) // true
 */
export function getQueryParamAsBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getQueryParam(key);
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}
