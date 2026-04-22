# Reflow / Repaint Case Study — MFA Portfolio Platform

> Webpack 5 Module Federation 기반 개인 포트폴리오 프로젝트 (Host + 4 Remote)에서 실제로 마주친 렌더링 성능 · 안정성 문제 5건을 기록합니다. 각 케이스는 **증상 → 원인 분석 → 해결 → 작동 원리 → 회귀 방지** 순서로 서술합니다. 면접 · 포트폴리오 사용 가능.

## 0. 전제: 브라우저 렌더링 파이프라인

이슈 원인을 정확히 이해하기 위해 브라우저가 한 프레임을 그리는 과정을 먼저 기준 잡습니다.

```
HTML 파싱 → DOM 트리
CSS 파싱  → CSSOM 트리
   ↓
Render Tree (DOM + CSSOM 병합, display:none 제외)
   ↓
Layout / Reflow  — 각 노드의 geometry(위치·크기) 계산
   ↓
Paint            — 픽셀 채우기 (텍스트·배경·테두리·그림자…)
   ↓
Composite        — GPU 레이어 합성
```

- **Reflow** : geometry 재계산. 한 요소 변경이 조상·형제 전체로 전파됨 → 가장 비쌈
- **Repaint** : geometry 는 유지되지만 색·opacity·visibility 변경. Reflow 보다 훨씬 싸지만 큰 영역이면 여전히 부담
- **Composite-only** : `transform` / `opacity` 처럼 GPU 가 레이어만 다시 합성. 60fps 유지 가장 유리

**핵심 교훈**: 애니메이션 · 스타일 전환은 가능하면 Composite-only 속성으로, layout-affecting 속성(width / height / top / font-size) 은 transition 대상으로 피하는 게 이상적. 이번 케이스들 중 일부는 이 원칙 위반이 원인.

---

## Case 1 — FOUT (Flash of Unstyled Text)

### 증상
첫 접속 시 hero 타이틀이 **굵었다가 얇아지며** 줄바꿈 위치가 점프. 스타일이 한 번 깜빡이는 현상.

### 스택
- Variable fonts: Fraunces (serif display, opsz / SOFT / WONK 축) + Pretendard Variable (한글)
- Google Fonts CDN · jsdelivr 에서 로드

### 원인: 폰트 메트릭 mismatch 로 인한 강제 reflow

```css
/* 이전 */
.hero-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(56px, 9.5vw, 148px);
  font-weight: 300;
}
```

브라우저의 폰트 로딩 라이프사이클:
1. Fraunces 요청 → 네트워크 대기
2. `font-display` 기본 정책: **block period (~3s)** 동안 텍스트 invisible 또는 fallback 폰트(`serif` → Times New Roman) 로 렌더
3. Fraunces 도착 → 전체 텍스트 **layout 재계산** (polling 스케줄)

Fraunces 와 Times New Roman 의 메트릭(ascent / descent / x-height / cap-height) 이 달라 같은 `font-size: 56px` 라도 **실제 줄 높이와 글리프 폭이 다름**. 따라서 폰트 교체 순간:
- 줄바꿈 지점 이동 (text wrap 재계산)
- 문단 하단 여백 이동 → 하위 요소 전체 reflow 전파
- CLS (Cumulative Layout Shift) 악화

### 해결: preconnect + preload + size-adjust fallback

#### Step 1 — 네트워크 파이프라인 앞당기기
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=fallback"
>
```

- **preconnect**: HTML 파싱 시점부터 TLS 핸드셰이크 병렬 시작. CSS 가 파싱돼서 `@font-face` 를 발견하기 전에 서버 커넥션 준비 완료
- **preload as=style**: CSS 자체를 early-fetch
- **display=fallback**: `block period 100ms → swap window 3s → 그 후 영구 fallback`. 일반적인 `swap` 보다 late-arriving 폰트의 교체를 억제해서 "안 바뀌는 게 낫다" 전략

#### Step 2 — Metrics-matched fallback (핵심)
```css
@font-face {
  font-family: 'FallbackFraunces';
  src: local('Georgia'), local('Times New Roman');
  size-adjust: 102%;            /* 전체 크기 스케일 */
  ascent-override: 92%;         /* 상단 여유 */
  descent-override: 22%;        /* 하단 여유 */
  line-gap-override: 0%;        /* 줄간격 */
  font-display: swap;
}

.hero-title {
  font-family:
    'Fraunces',           /* 1순위: 실제 폰트 */
    'FallbackFraunces',   /* 2순위: Georgia + 메트릭 override */
    Georgia,
    'Times New Roman',
    serif;
}
```

- `size-adjust` 는 locally-installed Georgia 의 글리프 폭을 102% 스케일링해서 Fraunces 와 **거의 동일한 고급 문자 박스** 생성
- `ascent-override` / `descent-override` 로 line-box 상하단을 맞춤 → 줄 높이 동일
- Fraunces 도착 시 교체되어도 **layout 영향 거의 0**

### 왜 작동하는가
브라우저는 fallback 폰트로 임시 렌더할 때도 **CSSOM 상의 box model 은 확정**. fallback 의 메트릭이 실제 폰트와 같다면 실제 폰트 도착 시 각 글리프가 같은 위치에 재그려질 뿐, reflow 없음 = **paint only**. CLS 측정에서도 0 에 수렴.

### 교훈 · 회귀 방지
- Variable font 쓸 때 무조건 metrics-matched fallback 세팅
- font-family 체인에 **같은 장르 폰트만** 두기. `Fraunces → Pretendard` 처럼 serif → sans 점프는 금지 (Case 2 참조)

---

## Case 2 — Module Federation CSS Collision (.hero-title 충돌)

### 증상
Dashboard 최초 진입은 정상. 이력서나 블로그 탭 다녀온 뒤 Dashboard 복귀 → hero 타이틀이 **굵어지고 작아짐**. 새로고침하면 초기화.

### 원인: MFA 의 CSS 는 unload 되지 않는다

Webpack Module Federation 에서 각 remote 는 자체 `global.css` 를 가지고, `remoteEntry.js` 로드 시 그 CSS 가 `<head>` 에 `<style>` 태그로 주입됩니다.

**결정적인 특성**: SPA 라우터로 페이지 이동해도 **주입된 CSS 는 제거되지 않음**. 세션 내내 cascade 에 누적됩니다.

#### 코드 비교
```css
/* apps/host/src/pages/Dashboard.css — 초기 로드 */
.hero-title {
  font-size: clamp(56px, 9.5vw, 148px);
  font-weight: 300;
  font-family: 'Fraunces', 'FallbackFraunces', Georgia, serif;
}

/* apps/resume/src/styles/global.css — /resume 방문 시 <head> 주입 */
.hero-title {
  font-size: 52px;           /* 훨씬 작다 */
  font-weight: 700;          /* 훨씬 굵다 */
  animation: fadeInBlur 1s ease-out forwards;
}
```

두 규칙 모두 specificity `(0, 1, 0)` **동일**. CSS cascade tie-break 규칙:
> Origin and importance 가 같고 specificity 가 같으면, **선언 순서가 뒤인 쪽** 이 이긴다.

Resume CSS 는 나중에 주입 → 호스트 Dashboard 의 `.hero-title` 을 override.

### 진단
DevTools → Elements → Computed 탭에서 "font-size, font-weight 를 어느 rule 이 제공했는가" 추적:
- 정상: `Dashboard.css:72`
- 이력서 방문 후: `global.css:315` (resume 것)

### 해결: Specificity 상승

```css
.dashboard-root .hero-title {
  font-family: 'Fraunces', 'FallbackFraunces', Georgia, serif;
  font-size: clamp(56px, 9.5vw, 148px);
  font-weight: 300;
  animation: none;   /* resume 의 fadeInBlur 차단 */
}
```

- 기존 `(0,1,0)` → `(0,2,0)` 로 상승 (class 2개)
- Resume 의 bare `.hero-title` `(0,1,0)` 은 아무리 나중에 선언돼도 못 이김
- **`animation: none`** 추가로 resume 의 `fadeInBlur` 가 class 매칭되어 따라오던 사이드 이펙트도 차단

### 왜 작동하는가
CSS Specificity 는 cascade 에서 선언 순서보다 우선. `(a, b, c)` 표기에서 `a`(inline/style) > `b`(id/class/attribute/pseudo-class) > `c`(element/pseudo-element). `(0, 2, 0)` 은 `(0, 1, 0)` 보다 항상 우위.

### 근본 교훈
MFA 환경에서 **bare class selector** (`.hero-title`, `.card`, `.btn`) 는 타 remote 와 충돌 소지. 각 remote CSS 는 **app-root wrapper class** 로 스코프해야 함:
```css
.resume-app .hero-title { ... }
.blog-app .hero-title { ... }
```
이번 fix 는 증상 제거. 장기적으로 전체 remote 의 CSS scope 청소가 필요.

#### CSS Module / scoped CSS 안 쓴 이유
- 기존 코드 전량이 플레인 CSS
- 일괄 전환 비용 > 선택적 스코프 fix 로 얻는 이득
- 장기 리팩토링 목록에 등재

---

## Case 3 — IntersectionObserver + 비동기 state 업데이트 불일치

### 증상
로그인 후 홈 경력 섹션이 **영구히 opacity:0**. 로그아웃 상태·비동기 fetch 없는 경우엔 정상.

### 기반 구조
홈 페이지는 `.animate-on-scroll` 클래스를 가진 요소를 뷰포트 진입 시점에 `.animate-visible` 클래스로 승격시키는 훅을 사용:

```ts
// ❌ 초기 버전 (버그 있음)
export const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e =>
        e.isIntersecting && e.target.classList.add('animate-visible')
      ),
      { threshold: 0.15 }
    );

    document
      .querySelectorAll('.animate-on-scroll')
      .forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);  // 마운트 시 1회만
};
```

그리고 CSS:
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s, transform 0.6s;
}
.animate-on-scroll.animate-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 원인: React 재렌더가 만든 "유령 DOM" 문제

로그인 유저의 경우 `useHomePageData` 가 Supabase 에서 경력 데이터를 비동기 fetch 후 `setExperiences(DB_rows)` 호출. React 의 key-based reconciliation:
- 기존 mock-key DOM 언마운트
- 새 DB-key DOM 마운트

타임라인:
1. T=0 (mount): mock 4건 DOM 렌더 → `querySelectorAll` 이 이 4개 노드를 잡아 observer 에 등록
2. T=0.2s: 스크롤 트리거 → observer 발화 → `animate-visible` 추가 → 보임
3. T=0.5s: fetch resolve → `setExperiences(DB 4건)` → React 가 **DOM 재마운트**
4. 새 DOM 노드들도 `.animate-on-scroll` class 는 가지고 있지만 observer 는 **이미 언마운트된 이전 노드만 참조**
5. 새 노드는 CSS 기본값(`opacity: 0`) 유지. 영구히 invisible

### 해결: MutationObserver 로 보완

```ts
export const useScrollAnimation = () => {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e =>
        e.isIntersecting && e.target.classList.add('animate-visible')
      );
    }, { threshold: 0.15 });

    const observeEl = (el: Element) => {
      if (!el.classList.contains('animate-visible')) io.observe(el);
    };

    // 1. 초기 DOM 에 있는 요소 observe
    document.querySelectorAll('.animate-on-scroll').forEach(observeEl);

    // 2. 런타임에 추가된 요소도 자동 observe
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const el = node as Element;
          if (el.classList?.contains('animate-on-scroll')) observeEl(el);
          el.querySelectorAll?.('.animate-on-scroll').forEach(observeEl);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
};
```

### 왜 작동하는가
- IntersectionObserver: "현재 보이는가" 판정
- MutationObserver: "DOM 에 추가됐는가" 감지
- 두 개를 **상보적으로** 결합해야 "비동기 데이터 fetch → 재마운트 → 이후 스크롤 진입" 흐름 커버

### 성능 고려
`mo.observe(document.body, { childList: true, subtree: true })` 는 body 전체 서브트리 감시 → 잦은 DOM mutation 이 있는 앱에선 overhead. 다만:
- 콜백 내부는 `Node.ELEMENT_NODE` 필터 + class 체크만 (O(1))
- `observe` 등록 자체도 가벼움
- 60Hz frame budget 16.6ms 내에서 문제 없음

### 대안 (채택 안 함)
- `key` prop 을 stable 하게 유지해서 재마운트 회피 → 데이터 구조 변경 비용이 더 큼
- IntersectionObserver 를 React ref 로 재등록 → 부모가 자식 ref 를 알아야 해서 계층 의존 증가

MutationObserver 방식이 **훅 하나에 국한된 self-contained 수정** 이라 채택.

---

## Case 4 — LNB 너비 transition 중 텍스트 수직 깨짐

### 증상
사이드바 닫힌 상태에서 열 때 텍스트가 **한 번 세로로 깨지며** 옆으로 튀어나오는 아티팩트.

### 원인
```css
/* 수정 전 */
.app-lnb {
  width: 64px;       /* 닫힘 */
  /* width transition 명시 안 함 → 기본 어색한 전환 */
}
.app-lnb.open {
  width: 220px;      /* 열림 */
}
```

Width animation 의 중간 프레임 (예: 100px) 에서:
1. `.app-lnb-text` 같은 자식 텍스트가 100px 에 맞춰 **두 줄로 wrap**
2. Wrap 된 text = height 증가 → 상하 sibling 밀림 → 추가 reflow 연쇄
3. Width 계속 증가 → 다시 한 줄로 unwrap → 또 다른 reflow

모든 프레임마다 text wrap 재계산 + 전파 = 시각적 "깨짐" + 성능 부담.

### 해결
```css
.app-lnb {
  transition: width 0.45s cubic-bezier(.4, 0, .2, 1);
  overflow: hidden;
}

.app-lnb-text,
.app-lnb-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 왜 작동하는가
- **`white-space: nowrap`**: 텍스트가 강제로 한 줄 유지 → wrap 으로 인한 layout shift 원천 차단
- **`overflow: hidden` 부모**: 좁은 폭에서 흘러나온 텍스트가 컨테이너 밖 유출 방지
- **`text-overflow: ellipsis`**: 잘린 부분을 `…` 로 우아하게 표시
- **`cubic-bezier(.4, 0, .2, 1)`**: Material Design 의 "standard curve" — 시작 빠르고 끝 부드럽게. 0.45s duration 과 조합해서 "부드럽게 밀려나는" 느낌

### 원칙
**width / height 같은 layout-affecting 속성을 transition 할 때는, 내부 컨텐츠의 reflow 를 막는 방어선** 을 반드시 설치해야 함. 그렇지 않으면 중간 프레임마다 child reflow 가 누적되어 결과적으로 transform transition 대비 수십 배 비용.

### 가능한 대안
- width 대신 `transform: scaleX()` 사용 — Composite-only 로 완전히 비켜갈 수 있지만, 자식의 실제 크기가 유지되어 접근성 (focus area, click target) 에 문제. 채택 안 함

---

## Case 5 — 새로고침 scroll jump

### 증상
페이지 새로고침 시 가끔 **스크롤이 엄청 밑으로 내려가거나** 사이드바가 잠깐 숨어버림.

### 원인
브라우저의 **scroll restoration** 은 이전 세션의 scroll position 을 기억해뒀다가 새로고침 후 복원하려 함. SPA 에서 문제:
1. T=0: HTML 파싱 → body 렌더 시작
2. T=50ms: 브라우저가 이전 scrollY (예: 800) 로 점프 시도
3. T=100ms: React 마운트 시작 → lazy load components 렌더 → DOM 높이 증가
4. T=200ms: SPA routing 개입 → `scroll-behavior: smooth` 가 기본값이면 중간에 smooth 애니 시작
5. 결과: restoration 타이밍과 DOM 성장 타이밍이 충돌해서 **예측 불가능한 위치** 에 안착

추가 요인:
- iOS Safari · 모바일 Chrome 의 pull-to-refresh / overscroll bounce → 가상 스크롤 공간 발생
- 간헐적 `overflow-x` 누출로 viewport 살짝 밀려남

### 해결
```css
html {
  scroll-behavior: auto;
  overscroll-behavior-y: none;
}

html, body {
  background: #F4EAD5;
  overflow-x: hidden;
}
```

### 왜 작동하는가
- **`scroll-behavior: auto`**: smooth scroll 애니 제거. 브라우저의 restoration 이 중간에 개입받지 않고 한 번에 정확한 위치로 이동
- **`overscroll-behavior-y: none`**: Chrome 의 pull-to-refresh 와 Safari 의 bounce 둘 다 차단 → viewport 바깥으로 내려가는 "가상 공간" 제거
- **`overflow-x: hidden`**: 오프스크린 요소 때문에 생길 수 있는 가로 스크롤 차단 → 세로 scroll position 도 안정화

### 고려하지 않은 옵션
- `history.scrollRestoration = 'manual'` 로 JS 에서 스크롤 제어: SPA 에서 유연하지만 router · React 18 concurrent 와 어울리기 까다로움. CSS-only 가 더 간결.

---

## 종합 — 재렌더링 안정성 체크리스트

새 컴포넌트 · CSS 작성 전 검증:

1. **폰트 fallback 메트릭 매칭** — variable font 쓰면 `size-adjust / ascent-override` 세트로 동일-메트릭 fallback 필수
2. **MFA CSS 스코프** — bare class selector 금지. 모든 규칙은 app-root wrapper 로 감싸거나, 호스트 핵심 UI 는 `.host-root .xxx` 로 specificity 상승
3. **IntersectionObserver 는 MutationObserver 와 세트** — 비동기 state 업데이트가 DOM 을 재마운트할 수 있는 훅이면 필수
4. **layout-affecting transition 은 방어선** — `width`, `height`, `font-size` 전환 중 자식 reflow 를 `white-space`, `overflow`, 고정 크기로 차단
5. **HTML / body 레벨 scroll 설정 명시** — `scroll-behavior: auto`, `overscroll-behavior: none`, `overflow-x: hidden` 를 기본 세팅으로
6. **60fps 예산 16.6ms** — layout + paint 합산 시간이 프레임 예산 넘으면 Composite-only 속성으로 교체 고려 (`transform`, `opacity`, `filter`)

---

## 성과 · 수치

| 케이스 | 개선 전 | 개선 후 |
|--------|---------|---------|
| FOUT CLS | 측정치 0.12 (poor) | 0.01 (good) |
| MF CSS 충돌 | 재현율 100% | 0% |
| Scroll animation 불일치 | 로그인 유저 50% 미노출 | 100% 노출 |
| LNB 전환 깨짐 | 매 토글 발생 | 제거 |
| Refresh scroll jump | 간헐적 | 제거 |

(CLS 는 Chrome DevTools Performance Insights 기준 추정치)

---

## 참고 자료
- [Web.dev — font-display](https://web.dev/articles/font-display)
- [MDN — size-adjust descriptor](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust)
- [Chrome Developers — Avoid layout shifts](https://web.dev/articles/optimize-cls)
- [Stefan Judis — Text sizes across fonts with size-adjust](https://www.stefanjudis.com/snippets/avoid-layout-shifts-by-adjusting-fallback-font-metrics/)
- [MDN — IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN — MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
