# TechBlog App (Remote)

기술 블로그 & 취업 트래커 마이크로 프론트엔드.

## 개발 서버
- **Port:** 5004
- **실행:** `npm run dev:techblog` (루트) 또는 `npm start` (앱 내)

## Module Federation
- **Name (webpack):** `jobtracker` (`apps/techblog/webpack.common.js`) — 앱 이름은 techblog지만 MF 레벨에서는 `jobtracker`
- **Host import alias:** `@jobtracker` → `jobtracker/remoteEntry.js`
- **Exposes:** `./App` (`src/App.tsx`), `./LnbItems` (`src/exposes/lnb-items.ts`)

## 주요 기능
- 기술 블로그 포스팅
- Job Tracker (취업 관리)
- Supabase 데이터 연동

## 주요 의존성
- Axios (API 호출)
- UUID (고유 ID 생성)
