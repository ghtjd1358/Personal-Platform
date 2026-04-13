# @mfa-portfolio/lib

MFA Portfolio 공통 라이브러리 - KOMCA 패턴 기반 마이크로프론트엔드 유틸리티

## 설치

```bash
npm install @mfa-portfolio/lib
# or
yarn add @mfa-portfolio/lib
# or
pnpm add @mfa-portfolio/lib
```

## 기능

### Components

- **ScrollTopButton** - 스크롤 최상단 이동 버튼
- **GlobalLoading** - 전역 로딩 스피너
- **ToastContainer/ToastProvider** - 토스트 알림 시스템
- **ModalContainer/ModalProvider** - 모달 시스템
- **ErrorBoundary** - 에러 바운더리

### Hooks

- **useAuth** - 인증 관련 훅 (로그인, 로그아웃, 토큰 갱신)
- **useToast** - 토스트 알림 훅
- **useModalContext** - 모달 훅
- **useGlobalLoading** - 전역 로딩 상태 훅
- **useKomcaNavigate** - 네비게이션 훅

### Store

- **getHostStore** - Host Redux Store 접근
- **getAccessToken** - 액세스 토큰 조회
- **getCurrentUser** - 현재 사용자 조회
- **dispatchToHost** - Host Store에 액션 디스패치

### Network

- **AxiosClientFactory** - Axios 클라이언트 팩토리 (토큰 갱신 포함)
- **initAxiosFactory** - Axios 팩토리 초기화

### Utils

- **storage** - localStorage 유틸리티

## 사용법

### 기본 설정 (Host App)

```tsx
import { Provider } from 'react-redux';
import { ToastProvider, ModalProvider } from '@mfa-portfolio/lib';
import { store } from './store';

// Store를 전역에 노출 (MFA 패턴)
window.__REDUX_STORE__ = store;

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ModalProvider>
          <YourApp />
        </ModalProvider>
      </ToastProvider>
    </Provider>
  );
}
```

### Toast 사용

```tsx
import { useToast } from '@mfa-portfolio/lib';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleClick = () => {
    success('저장되었습니다!');
    error('오류가 발생했습니다.');
  };

  return <button onClick={handleClick}>알림</button>;
}
```

### Modal 사용

```tsx
import { useModalContext } from '@mfa-portfolio/lib';

function MyComponent() {
  const { alert, confirm } = useModalContext();

  const handleDelete = async () => {
    const result = await confirm('정말 삭제하시겠습니까?');
    if (result) {
      // 삭제 로직
    }
  };

  return <button onClick={handleDelete}>삭제</button>;
}
```

### Axios 클라이언트 설정

```tsx
import { AxiosClientFactory, initAxiosFactory, getAccessToken } from '@mfa-portfolio/lib';

// 팩토리 초기화
initAxiosFactory({
  getAccessToken: () => getAccessToken(),
  setAccessToken: (token) => store.dispatch(setAccessToken(token)),
  refreshToken: async () => {
    // 토큰 갱신 로직
    const newToken = await refreshTokenApi();
    return newToken;
  },
  onUnauthorized: () => {
    // 로그아웃 처리
    store.dispatch(logout());
  },
});

// 클라이언트 생성
const apiClient = AxiosClientFactory.createClient({
  hostUrl: 'https://api.example.com',
  basePath: '/api/v1',
});
```

### Remote App에서 Host Store 접근

```tsx
import { getHostStore, getCurrentUser, getAccessToken } from '@mfa-portfolio/lib';

function RemoteComponent() {
  const user = getCurrentUser();
  const token = getAccessToken();

  return <div>안녕하세요, {user?.name}님!</div>;
}
```

## MFA 아키텍처

이 라이브러리는 Module Federation 기반 마이크로프론트엔드 아키텍처를 위해 설계되었습니다.

```
┌─────────────────────────────────────────┐
│              Host App                    │
│  ┌─────────────────────────────────┐    │
│  │   Redux Store (전역 노출)        │    │
│  │   window.__REDUX_STORE__        │    │
│  └─────────────────────────────────┘    │
│                  │                       │
│  ┌───────────────┼───────────────┐      │
│  │               │               │      │
│  ▼               ▼               ▼      │
│ Remote1       Remote2        Remote3    │
│ (Resume)      (Blog)       (Portfolio)  │
└─────────────────────────────────────────┘
```

## License

MIT
