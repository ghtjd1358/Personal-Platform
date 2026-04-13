import { storage } from '@sonhoseong/mfa-lib';

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (빈 문자열), 단독 실행: /resume
export const PREFIX = storage.isHostApp() ? '' : '/resume';

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/resume, 단독 실행: /resume
export const LINK_PREFIX = storage.isHostApp() ? '/container/resume' : '/resume';

// Home path: Host에서는 '/', 단독에서는 '/resume'
export const HOME_PATH = PREFIX || '/';
