/**
 * ClassName 유틸리티
 * 조건부 클래스 이름 결합 (clsx/classnames 대체)
 * 외부 의존성 없이 구현
 */
export type ClassValue = string | number | boolean | null | undefined | ClassValue[] | Record<string, boolean | null | undefined>;
/**
 * 여러 클래스 이름을 조건부로 결합
 *
 * @example
 * // 기본 사용
 * cn('foo', 'bar') // 'foo bar'
 *
 * @example
 * // 조건부 클래스
 * cn('btn', { 'btn-primary': isPrimary, 'btn-disabled': isDisabled })
 * // isPrimary=true, isDisabled=false -> 'btn btn-primary'
 *
 * @example
 * // 배열 사용
 * cn(['foo', 'bar'], 'baz') // 'foo bar baz'
 *
 * @example
 * // falsy 값 무시
 * cn('foo', null, undefined, false, 'bar') // 'foo bar'
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * cn의 별칭 (classNames)
 */
export declare const classNames: typeof cn;
/**
 * cn의 별칭 (clsx 호환)
 */
export declare const clsx: typeof cn;
/**
 * 조건부 클래스 생성 헬퍼
 *
 * @example
 * const buttonClass = createClassVariants({
 *   base: 'btn',
 *   variants: {
 *     variant: {
 *       primary: 'btn-primary',
 *       secondary: 'btn-secondary',
 *     },
 *     size: {
 *       sm: 'btn-sm',
 *       md: 'btn-md',
 *       lg: 'btn-lg',
 *     },
 *   },
 * });
 *
 * buttonClass({ variant: 'primary', size: 'lg' })
 * // 'btn btn-primary btn-lg'
 */
export declare function createClassVariants<T extends Record<string, Record<string, string>>>(config: {
    base?: string;
    variants: T;
}): (options: Partial<{
    [K in keyof T]: keyof T[K];
}>) => string;
export default cn;
//# sourceMappingURL=classnames.d.ts.map