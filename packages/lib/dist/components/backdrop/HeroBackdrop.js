import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export const HeroBackdrop = (props) => {
    // TODO(human) 의 결정에 따라 아래 두 변수를 props 에서 추출
    // const { idPrefix, fiberSeed } = props;  // 1번 방식
    // const { idPrefix, fiberSeed } = PRESETS[props.variant];  // 2번 방식
    const idPrefix = ''; // 임시 — TODO 해결 후 위 둘 중 하나로 교체
    const fiberSeed = 0; // 임시 — TODO 해결 후 위 둘 중 하나로 교체
    return (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "editorial-grain", xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", preserveAspectRatio: "none", "aria-hidden": true, focusable: "false", children: [_jsxs("filter", { id: `${idPrefix}-grain`, children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.92", numOctaves: 2, stitchTiles: "stitch" }), _jsx("feColorMatrix", { values: "0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" })] }), _jsx("rect", { width: "100%", height: "100%", filter: `url(#${idPrefix}-grain)` })] }), _jsxs("svg", { className: "editorial-fiber", xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", preserveAspectRatio: "none", "aria-hidden": true, focusable: "false", children: [_jsxs("filter", { id: `${idPrefix}-fiber`, children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.012 0.85", numOctaves: 2, seed: fiberSeed, stitchTiles: "stitch" }), _jsx("feColorMatrix", { values: "0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.4 0" })] }), _jsx("rect", { width: "100%", height: "100%", filter: `url(#${idPrefix}-fiber)` })] })] }));
};
