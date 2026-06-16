/**
 * CSS Module Augmentation
 *
 * React 의 CSSProperties 타입을 확장해서 `--foo` 형태의
 * CSS custom property 를 인라인 style 로 자연스럽게 쓸 수 있게 한다.
 *
 * 예) style={{ '--i': i }}  ←  더 이상 `as any` 가 필요 없음
 */
import 'react';

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number | undefined;
    }
}
