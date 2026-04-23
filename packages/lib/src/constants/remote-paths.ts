/**
 * Remote URL prefix — host 가 각 remote 를 mount 하는 절대 경로.
 * host + remote 모두 이 단일 소스에서 import → 하드코딩 중복 제거.
 *
 * 구조:
 *   host : /container/{remoteName}/*  (host 가 Route 로 wrap 하는 path)
 *   standalone : /{remoteName}        (각 remote 단독 실행 시 base)
 *
 * 이후 React Router basename 패턴으로 B 단계 리팩터 시 이 상수들은 점진 축소/소멸 예정.
 */

export const REMOTE_BASE = {
    resume: 'resume',
    blog: 'blog',
    portfolio: 'portfolio',
    jobtracker: 'jobtracker',
} as const;

export const REMOTE_LINK_PREFIX = {
    resume: `/container/${REMOTE_BASE.resume}`,
    blog: `/container/${REMOTE_BASE.blog}`,
    portfolio: `/container/${REMOTE_BASE.portfolio}`,
    jobtracker: `/container/${REMOTE_BASE.jobtracker}`,
} as const;

export const REMOTE_STANDALONE_PREFIX = {
    resume: `/${REMOTE_BASE.resume}`,
    blog: `/${REMOTE_BASE.blog}`,
    portfolio: `/${REMOTE_BASE.portfolio}`,
    jobtracker: `/${REMOTE_BASE.jobtracker}`,
} as const;

export type RemoteName = keyof typeof REMOTE_BASE;
