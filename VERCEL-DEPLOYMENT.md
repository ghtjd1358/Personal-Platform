# 🚀 Vercel 배포 가이드

> **Last Updated**: 2026-04-21

## 📋 배포 전 체크리스트

### ✅ 1. TechBlog vercel.json 추가됨
- 이전에 누락되었던 `apps/techblog/vercel.json` 생성 완료

### ✅ 2. Webpack PublicPath 수정
모든 remote 앱의 `publicPath`를 `'auto'` → `'/'`로 변경
- ✅ apps/resume/webpack.common.js
- ✅ apps/blog/webpack.common.js
- ✅ apps/portfolio/webpack.common.js
- ✅ apps/techblog/webpack.common.js

**이유**: Vercel 프로덕션 환경에서 Module Federation이 정확한 경로로 remoteEntry.js를 로드하기 위함

### ✅ 3. Host 앱 mfa-lib 버전 동기화
- `apps/host/webpack.common.js`의 `@sonhoseong/mfa-lib` 버전을 `^1.3.9` → `^1.3.10`으로 업데이트

---

## 🎯 Vercel 프로젝트 설정

각 앱을 개별 Vercel 프로젝트로 배포:

| App | Root Directory | Output Directory | Build Command |
|-----|---------------|------------------|---------------|
| **host** | `apps/host` | `dist` | `npm run build` |
| **resume** | `apps/resume` | `dist` | `npm run build` |
| **blog** | `apps/blog` | `dist` | `npm run build` |
| **portfolio** | `apps/portfolio` | `dist` | `npm run build` |
| **techblog** | `apps/techblog` | `dist` | `npm run build` |

---

## 🔐 환경 변수 설정

### Host App 환경변수
Vercel Dashboard → Settings → Environment Variables에서 설정:

```bash
# Supabase
REACT_APP_SUPABASE_URL=https://ujhlgylnauzluttvmcrz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>

# Firebase
FIREBASE_API_KEY=<your-api-key>
FIREBASE_AUTH_DOMAIN=<your-domain>
FIREBASE_PROJECT_ID=<your-project-id>
FIREBASE_STORAGE_BUCKET=<your-bucket>
FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
FIREBASE_APP_ID=<your-app-id>

# Remote URLs (배포 후 각 앱의 Vercel URL로 업데이트)
REMOTE1_URL=https://<resume-app>.vercel.app
REMOTE2_URL=https://<blog-app>.vercel.app
REMOTE3_URL=https://<portfolio-app>.vercel.app
REMOTE4_URL=https://<techblog-app>.vercel.app
```

### Remote Apps 환경변수
각 remote 앱 (resume, blog, portfolio, techblog):

```bash
# Supabase
REACT_APP_SUPABASE_URL=https://ujhlgylnauzluttvmcrz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 📦 배포 순서

**중요**: Remote 앱을 먼저 배포한 후 Host 앱 배포!

### 1단계: Remote 앱 배포 (병렬 가능)
```bash
# 각 앱별로 Vercel 프로젝트 생성 및 배포
vercel --cwd apps/resume
vercel --cwd apps/blog
vercel --cwd apps/portfolio
vercel --cwd apps/techblog
```

배포 후 각 앱의 Production URL 기록:
- Resume: `https://resume-app.vercel.app`
- Blog: `https://blog-app.vercel.app`
- Portfolio: `https://portfolio-app.vercel.app`
- TechBlog: `https://techblog-app.vercel.app`

### 2단계: Host 앱 환경변수 업데이트
Host 프로젝트의 환경변수에 Remote URL들을 설정:
```bash
REMOTE1_URL=https://resume-app.vercel.app
REMOTE2_URL=https://blog-app.vercel.app
REMOTE3_URL=https://portfolio-app.vercel.app
REMOTE4_URL=https://techblog-app.vercel.app
```

### 3단계: Host 앱 배포
```bash
vercel --cwd apps/host
```

---

## 🐛 트러블슈팅

### 문제 1: Module Federation 로딩 실패
**증상**: "Failed to load remote entry"

**원인**:
- Remote URL이 잘못 설정됨
- publicPath가 'auto'로 되어 있음 (✅ 이미 수정됨)
- CORS 헤더 누락

**해결**:
1. Vercel 환경변수에서 `REMOTE*_URL` 확인
2. Remote 앱의 `vercel.json`에 CORS 헤더 있는지 확인:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" }
      ]
    }
  ]
}
```

### 문제 2: Build 실패 - "Cannot find module '@sonhoseong/mfa-lib'"
**증상**: Build 시 공유 라이브러리 찾을 수 없음

**원인**:
- Workspace 구조에서 `@sonhoseong/mfa-lib`을 찾지 못함
- `node_modules`에 설치되지 않음

**해결**:
1. Root 레벨에서 `npm install` 실행 (workspace 설치)
2. 또는 각 앱에 `@sonhoseong/mfa-lib` 의존성 추가

### 문제 3: Build 실패 - Memory 부족
**증상**: "JavaScript heap out of memory"

**원인**: Webpack 빌드 시 메모리 부족

**해결**: (✅ 이미 적용됨)
- `package.json`의 build 스크립트에 `NODE_OPTIONS=--max_old_space_size=4096` 추가
```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--max_old_space_size=4096 webpack --config webpack.prod.js"
  }
}
```

### 문제 4: Supabase 연결 실패
**증상**: "Invalid API key" 또는 CORS 에러

**원인**:
- 환경변수 미설정 또는 잘못 설정
- Supabase URL/Key 오타

**해결**:
1. Vercel 환경변수 다시 확인
2. Supabase Dashboard에서 정확한 URL과 anon key 복사
3. 환경변수 변경 후 **재배포** 필수

### 문제 5: rewrites로 인한 라우팅 충돌
**증상**: 404 또는 index.html이 항상 로드됨

**원인**: 잘못된 rewrites 설정

**해결**: Remote 앱의 `vercel.json` 확인:
```json
{
  "rewrites": [
    {
      "source": "/((?!remoteEntry|.*\\.js|.*\\.css|.*\\.map).*)",
      "destination": "/index.html"
    }
  ]
}
```
- `remoteEntry`를 제외해야 Module Federation이 작동함

---

## 📊 배포 확인

### 1. Remote Entry 로드 확인
각 remote 앱의 URL에서 `/remoteEntry.js` 접근 테스트:
```bash
curl https://resume-app.vercel.app/remoteEntry.js
curl https://blog-app.vercel.app/remoteEntry.js
curl https://portfolio-app.vercel.app/remoteEntry.js
curl https://techblog-app.vercel.app/remoteEntry.js
```

### 2. CORS 헤더 확인
```bash
curl -I https://resume-app.vercel.app/remoteEntry.js | grep -i "access-control"
```

예상 결과:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
```

### 3. Host 앱에서 Remote 로딩 확인
Host 앱 접속 후 브라우저 콘솔 확인:
```
[MFA] remote1 loaded successfully
[MFA] blog loaded successfully
[MFA] portfolio loaded successfully
[MFA] jobtracker loaded successfully
```

에러 발생 시:
```
[MFA] Failed to load remote1: [error details]
```

---

## 🔄 재배포 워크플로우

### Remote 앱만 수정한 경우
1. 해당 remote 앱만 재배포
2. Host는 동적으로 최신 버전 로드 (캐시 무효화 1분 단위)

### Host 앱 수정한 경우
1. Host 앱만 재배포

### 공유 라이브러리 (@sonhoseong/mfa-lib) 수정한 경우
1. 라이브러리 버전 업데이트
2. 모든 앱 재배포 (lib → remotes → host 순서)

---

## 📚 참고 자료

- [Vercel 환경변수 문서](https://vercel.com/docs/environment-variables)
- [Module Federation 배포 가이드](https://webpack.js.org/concepts/module-federation/)
- [Vercel rewrites 설정](https://vercel.com/docs/projects/project-configuration#rewrites)

---

*Generated: 2026-04-21 by Claude Code*
