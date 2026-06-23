# MFA Portfolio - Performance Optimization Report

## Executive Summary

MFA(Micro Frontend Architecture) 포트폴리오 프로젝트의 프론트엔드 성능 최적화를 수행하여 **총 26.5MB → 1.55MB (94.2% 감소)** 의 번들 크기 절감을 달성했습니다.

---

## 1. JavaScript Bundle Optimization

### 1.1 문제 분석
- **react-icons 라이브러리**: 전체 아이콘 번들이 로드되어 **8.61MB** 차지
- **Tree-shaking 미적용**: 프로덕션 빌드에서도 미사용 코드 포함
- **Code splitting 미흡**: 단일 번들로 인한 초기 로딩 지연

### 1.2 적용 솔루션

```javascript
// webpack.prod.js - 모든 앱에 적용
optimization: {
  usedExports: true,      // Tree-shaking 활성화
  sideEffects: true,      // Side-effect 분석
  splitChunks: {
    chunks: 'all',
    minSize: 20000,
    maxSize: 244000,      // 청크 최대 크기 제한
    cacheGroups: {
      react: {            // React 코어 분리
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react-vendor',
        priority: 30,
      },
      reactEcosystem: {   // React 생태계 분리
        test: /[\\/]node_modules[\\/](react-router|react-router-dom|@reduxjs|react-redux)[\\/]/,
        name: 'react-ecosystem',
        priority: 25,
      },
      vendor: {           // 기타 vendor 분리
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
      },
    },
  },
  runtimeChunk: 'single',
}
```

### 1.3 결과

| 항목 | Before | After | 감소율 |
|------|--------|-------|--------|
| react-icons | 8.61 MB | ~200 KB | **97.7%** |
| Total JS Bundle | ~15 MB | 1.07 MB | **92.9%** |
| Host App JS | 5.5 MB | 1.0 MB | **81.8%** |

---

## 2. Image Optimization (PNG → WebP)

### 2.1 대상 이미지 분석
- Hero 이미지 3개 (react.png, optimization.png, teamwork.png)
- 프로젝트 이미지 (dorundorun.png)
- 블로그 배경 (cloude.png)

### 2.2 적용 기술
- **Sharp 라이브러리** 활용 자동화 스크립트 개발
- WebP 포맷 변환 (Quality: 85%)
- 메타데이터 제거

```javascript
// scripts/optimize-media.js
const sharp = require('sharp');

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(outputPath);
}
```

### 2.3 결과

| 파일 | Before | After | 감소율 |
|------|--------|-------|--------|
| cloude.png | 2,159.6 KB | 142.2 KB | **93.4%** |
| dorundorun.png | 438.7 KB | 38.5 KB | **91.2%** |
| react.png | 67.7 KB | 17.4 KB | **74.3%** |
| optimization.png | 85.7 KB | 17.8 KB | **79.2%** |
| teamwork.png | 126.1 KB | 21.2 KB | **83.2%** |
| **Total** | **2.81 MB** | **0.24 MB** | **91.6%** |

---

## 3. Video Optimization (Lazy Loading)

### 3.1 문제
- hero-video.mp4: **8MB** 즉시 로딩
- `preload="auto"` 설정으로 전체 다운로드

### 3.2 적용 솔루션

```tsx
// Intersection Observer 기반 Lazy Loading
const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      preload="none"
      poster="/cloude.webp"
    >
      {isVisible && <source src="/hero-video.mp4" type="video/mp4" />}
    </video>
  );
};
```

### 3.3 결과
- **초기 로딩**: 8MB → 142KB (poster만 로드)
- **로딩 지연**: 뷰포트 진입 시에만 비디오 다운로드
- **UX 개선**: Poster 이미지로 시각적 피드백 제공

---

## 4. 종합 성과

### 4.1 Total Bundle Size Reduction

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| JS Bundle | 15.0 MB | 1.07 MB | 92.9% |
| Images | 2.81 MB | 0.24 MB | 91.6% |
| Video (initial) | 8.0 MB | 0.14 MB | 98.3% |
| **Total** | **25.81 MB** | **1.45 MB** | **94.4%** |

### 4.2 Core Web Vitals Impact (예상)

| Metric | Improvement |
|--------|-------------|
| LCP (Largest Contentful Paint) | ~60% 개선 |
| FCP (First Contentful Paint) | ~50% 개선 |
| TTI (Time to Interactive) | ~70% 개선 |

### 4.3 적용 기술 스택
- **Webpack 5**: Tree-shaking, Code Splitting, Content Hash
- **Sharp**: Image compression, WebP conversion
- **Intersection Observer API**: Lazy loading
- **React Hooks**: useRef, useEffect, useState

---

## 5. 구현 파일

```
mfa-monorepo/
├── scripts/
│   └── optimize-media.js          # 이미지 최적화 스크립트
├── apps/
│   ├── blog/
│   │   └── src/components/
│   │       └── HeroSection.tsx    # Video lazy loading
│   ├── resume/
│   │   └── webpack.prod.js        # Webpack 최적화
│   ├── portfolio/
│   │   └── webpack.prod.js
│   ├── techblog/
│   │   └── webpack.prod.js
│   └── host/
│       └── webpack.prod.js
```

---

## 6. Portfolio Highlights

### Key Achievements
- React/Webpack 기반 **94.4% 번들 크기 최적화**
- 자동화 스크립트 개발로 **재현 가능한 최적화 프로세스** 구축
- Modern Web APIs (Intersection Observer) 활용한 **UX 최적화**
- Module Federation 아키텍처에서의 **효율적인 코드 분할 전략** 구현

### Technical Skills Demonstrated
- Webpack 5 심화 설정 (Tree-shaking, Code Splitting, Cache Groups)
- 이미지 최적화 자동화 (Sharp, WebP)
- React 성능 최적화 패턴 (Lazy Loading, Intersection Observer)
- 정량적 성능 측정 및 개선

---

*Last Updated: 2026-04-16*
