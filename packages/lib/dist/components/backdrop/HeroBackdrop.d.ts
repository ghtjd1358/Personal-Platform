import React from 'react';
/**
 * HeroBackdrop — 4 remote (resume/blog/portfolio/techblog) Hero 공통 노이즈 배경.
 *
 * Grain (밀도 0.92, 검정 톤) + Fiber (가로 비대칭 0.012×0.85, 갈색 톤) 2-layer overlay.
 * 한지 질감 ed itorial 룩의 시그니처. 4 remote 가 같은 host 에 mount 되므로
 * SVG `<filter id>` 충돌 회피 위해 `idPrefix` 로 scope 분리.
 *
 * Fiber `seed` 는 remote 별로 다르게 줘서 미묘한 variation (같은 알고리즘, 다른 패턴).
 * blog=11, portfolio=23, techblog=37, resume=3 — 기존 값 유지.
 *
 * SVG width/height/preserveAspectRatio 속성은 CSS 도착 전 default 300×150 으로
 * 렌더돼 발생하는 FOUC layout shift 회피용. resume 에서만 있던 것을 전체 적용.
 */
interface HeroBackdropProps {
    idPrefix?: string;
    fiberSeed?: number;
}
export declare const HeroBackdrop: React.FC<HeroBackdropProps>;
export {};
//# sourceMappingURL=HeroBackdrop.d.ts.map