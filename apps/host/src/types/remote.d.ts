/**
 * Remote Module 타입 선언
 * Module Federation으로 로드되는 Remote 앱 타입 정의
 */
import { LnbMenuItem } from '@sonhoseong/mfa-lib';

// Remote App 모듈 선언
declare module '@resume/App' {
  import { ComponentType } from 'react';
  const App: ComponentType<Record<string, never>>;
  export default App;
}

declare module '@blog/App' {
  import { ComponentType } from 'react';
  const App: ComponentType<Record<string, never>>;
  export default App;
}

// KOMCA 패턴: Remote LnbItems 모듈 선언
interface RemoteLnbItems {
  hasPrefixList: LnbMenuItem[];
  hasPrefixAuthList?: LnbMenuItem[];
}

declare module '@resume/LnbItems' {
  export const pathPrefix: string;
  export const lnbItems: RemoteLnbItems;
  export default lnbItems;
}

declare module '@blog/LnbItems' {
  export const pathPrefix: string;
  export const lnbItems: RemoteLnbItems;
  export default lnbItems;
}

// Remote3: Portfolio 모듈 선언
declare module '@portfolio/App' {
  import { ComponentType } from 'react';
  const App: ComponentType<Record<string, never>>;
  export default App;
}

declare module '@portfolio/LnbItems' {
  export const pathPrefix: string;
  export const lnbItems: RemoteLnbItems;
  export default lnbItems;
}

// Remote4: JobTracker 모듈 선언
declare module '@jobtracker/App' {
  import { ComponentType } from 'react';
  const App: ComponentType<Record<string, never>>;
  export default App;
}

declare module '@jobtracker/LnbItems' {
  export const pathPrefix: string;
  export const lnbItems: RemoteLnbItems;
  export default lnbItems;
}
