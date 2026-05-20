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

// TODO(human): Props 인터페이스 정의
//
// 두 가지 valid 접근:
//
// 1. 명시적 props (단순 / 호출부에서 책임)
//    interface HeroBackdropProps {
//      idPrefix: string;
//      fiberSeed: number;
//    }
//    → 호출: <HeroBackdrop idPrefix="resume-hero" fiberSeed={3} />
//
// 2. variant preset (중앙 집중 / lib 가 4개 매핑 보유)
//    type Variant = 'resume' | 'blog' | 'portfolio' | 'techblog';
//    interface HeroBackdropProps {
//      variant: Variant;
//    }
//    + lib 안에 PRESETS 맵 보유
//    → 호출: <HeroBackdrop variant="resume" />
//
// trade-off:
// - 1번: lib 는 dumb, app 이 자기 seed 값을 안다 (decentralized)
// - 2번: lib 가 4개 앱 알아야 함 (lib → app 역의존성 느낌), 호출은 한 단어
//
// 양치기 시점 기준 어느 게 맞을지 결정해서 interface HeroBackdropProps 와
// (variant 방식이면) PRESETS 상수까지 작성.

export const HeroBackdrop: React.FC<HeroBackdropProps> = (props) => {
    // TODO(human) 의 결정에 따라 아래 두 변수를 props 에서 추출
    // const { idPrefix, fiberSeed } = props;  // 1번 방식
    // const { idPrefix, fiberSeed } = PRESETS[props.variant];  // 2번 방식
    const idPrefix = '';  // 임시 — TODO 해결 후 위 둘 중 하나로 교체
    const fiberSeed = 0;  // 임시 — TODO 해결 후 위 둘 중 하나로 교체

    return (
        <>
            <svg
                className="editorial-grain"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                aria-hidden
                focusable="false"
            >
                <filter id={`${idPrefix}-grain`}>
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.92"
                        numOctaves={2}
                        stitchTiles="stitch"
                    />
                    <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#${idPrefix}-grain)`} />
            </svg>
            <svg
                className="editorial-fiber"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                aria-hidden
                focusable="false"
            >
                <filter id={`${idPrefix}-fiber`}>
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.012 0.85"
                        numOctaves={2}
                        seed={fiberSeed}
                        stitchTiles="stitch"
                    />
                    <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.4 0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#${idPrefix}-fiber)`} />
            </svg>
        </>
    );
};
