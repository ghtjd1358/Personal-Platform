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
export declare function parseQueryString(searchStr?: string): Record<string, string | undefined>;
/**
 * 객체를 쿼리 스트링으로 변환
 * @example
 * createQueryString({ name: '홍길동', age: 30 })
 * // 'name=%ED%99%8D%EA%B8%B8%EB%8F%99&age=30'
 */
export declare function createQueryString(params: QueryParams): string;
/**
 * 현재 URL에 쿼리 파라미터 추가/업데이트
 * @example
 * updateQueryParams({ page: 2, sort: 'name' })
 * // 현재 URL에 ?page=2&sort=name 추가
 */
export declare function updateQueryParams(params: QueryParams, options?: {
    replace?: boolean;
}): void;
/**
 * 특정 쿼리 파라미터 값 가져오기
 * @example
 * getQueryParam('page') // '1'
 * getQueryParam('page', '1') // 기본값 '1'
 */
export declare function getQueryParam(key: string, defaultValue?: string): string | undefined;
/**
 * 특정 쿼리 파라미터 삭제
 * @example removeQueryParam('page')
 */
export declare function removeQueryParam(key: string, options?: {
    replace?: boolean;
}): void;
/**
 * 모든 쿼리 파라미터 삭제
 */
export declare function clearQueryParams(options?: {
    replace?: boolean;
}): void;
/**
 * URL에 쿼리 스트링 추가
 * @example
 * appendQueryString('/users', { page: 1, size: 10 })
 * // '/users?page=1&size=10'
 */
export declare function appendQueryString(url: string, params: QueryParams): string;
/**
 * 쿼리 파라미터를 숫자로 파싱
 * @example getQueryParamAsNumber('page', 1) // 1
 */
export declare function getQueryParamAsNumber(key: string, defaultValue?: number): number;
/**
 * 쿼리 파라미터를 boolean으로 파싱
 * @example getQueryParamAsBoolean('active', false) // true
 */
export declare function getQueryParamAsBoolean(key: string, defaultValue?: boolean): boolean;
//# sourceMappingURL=query-string.d.ts.map