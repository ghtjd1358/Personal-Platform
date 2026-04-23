import { storage, REMOTE_LINK_PREFIX, REMOTE_STANDALONE_PREFIX } from '@sonhoseong/mfa-lib';

const isHost = storage.isHostApp();

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (부모 Route 가 이미 /container/resume/* 소비), 단독 실행: /resume
export const PREFIX = isHost ? '' : REMOTE_STANDALONE_PREFIX.resume;

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/resume, 단독 실행: /resume
export const LINK_PREFIX = isHost ? REMOTE_LINK_PREFIX.resume : REMOTE_STANDALONE_PREFIX.resume;
