/**
 * LNB Items - Remote1 (이력서)
 * KOMCA 패턴: pathPrefix + hasPrefixList 구조
 */
import React from 'react'

// pathPrefix: Host(Container)가 라우트에 사용 - /container prefix 포함
export const pathPrefix = '/container/resume'

// Host에서 사용할 경로 PREFIX - /container prefix 포함
const HOST_PREFIX = '/container/resume'

export interface LnbItemData {
    id: string
    title: string
    path?: string
    icon?: React.ReactNode
    children?: Omit<LnbItemData, 'icon' | 'children'>[]
}

// 아이콘
const icons = {
    home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    resume: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    browse: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    mypage: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
}

// Guest용 메뉴 (비로그인) - Host에서 사용할 경로 (항상 /resume prefix)
const guestList: LnbItemData[] = [
    { id: 'resume-browse', title: '이력서 둘러보기', path: HOST_PREFIX, icon: icons.browse },
]

// Auth용 메뉴 (로그인) - Host에서 사용할 경로 (항상 /resume prefix)
const authList: LnbItemData[] = [
    { id: 'resume-browse', title: '이력서 둘러보기', path: HOST_PREFIX, icon: icons.browse },
    { id: 'resume-mypage', title: '마이페이지', path: `${HOST_PREFIX}/mypage`, icon: icons.mypage },
    { id: 'resume-admin', title: '이력서 관리', path: `${HOST_PREFIX}/admin/skills`, icon: icons.dashboard },
]

// KOMCA 패턴: hasPrefixList 구조로 export
export const lnbItems = {
    hasPrefixList: guestList,
    hasPrefixAuthList: authList,
}

export default lnbItems
