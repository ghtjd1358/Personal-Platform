import { storage, REMOTE_LINK_PREFIX, REMOTE_STANDALONE_PREFIX } from '@sonhoseong/mfa-lib';

const isHost = storage.isHostApp();

// PREFIX: 라우트 정의용 (상대 경로)
// Host에서: '' (부모 Route 가 이미 /container/jobtracker/* 소비), 단독 실행: /jobtracker
export const PREFIX = isHost ? '' : REMOTE_STANDALONE_PREFIX.jobtracker;

// LINK_PREFIX: 링크용 (절대 경로)
// Host에서: /container/jobtracker, 단독 실행: /jobtracker
export const LINK_PREFIX = isHost ? REMOTE_LINK_PREFIX.jobtracker : REMOTE_STANDALONE_PREFIX.jobtracker;
