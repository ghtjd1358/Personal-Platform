/**
 * ClassName 유틸리티
 * 조건부 클래스 이름 결합 (clsx/classnames 대체)
 * 외부 의존성 없이 구현
 */

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

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
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

/**
 * cn의 별칭 (classNames)
 */
export const classNames = cn;

/**
 * cn의 별칭 (clsx 호환)
 */
export const clsx = cn;

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
export function createClassVariants<
  T extends Record<string, Record<string, string>>
>(config: {
  base?: string;
  variants: T;
}): (options: Partial<{ [K in keyof T]: keyof T[K] }>) => string {
  const { base, variants } = config;

  return (options) => {
    const classes: string[] = [];

    if (base) classes.push(base);

    for (const [variantKey, variantValue] of Object.entries(options)) {
      const variantConfig = variants[variantKey as keyof T];
      if (variantConfig && variantValue) {
        const className = variantConfig[variantValue as string];
        if (className) classes.push(className);
      }
    }

    return classes.join(' ');
  };
}

export default cn;
