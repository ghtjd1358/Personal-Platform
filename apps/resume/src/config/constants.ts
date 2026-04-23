import { storage, REMOTE_LINK_PREFIX, REMOTE_STANDALONE_PREFIX } from '@sonhoseong/mfa-lib';

const isHost = storage.isHostApp();

// 사이트 owner user_id — 비로그인 방문자가 볼 "이 사이트의 주인" 의 데이터를 fetch 할 때 사용.
// 이 포트폴리오/이력서 사이트는 본질적으로 공개 뷰이므로 방문자가 로그인 없이도 owner 데이터를 봐야 함.
export const OWNER_USER_ID = '4d1541e8-0064-489a-9837-0af833db8232';

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (부모 Route 가 이미 /container/resume/* 소비), 단독 실행: /resume
export const PREFIX = isHost ? '' : REMOTE_STANDALONE_PREFIX.resume;

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/resume, 단독 실행: /resume
export const LINK_PREFIX = isHost ? REMOTE_LINK_PREFIX.resume : REMOTE_STANDALONE_PREFIX.resume;
