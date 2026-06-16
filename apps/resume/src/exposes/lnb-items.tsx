import React from 'react'
import { REMOTE_LINK_PREFIX, LnbMenuItem } from '@sonhoseong/mfa-lib'

export const pathPrefix = REMOTE_LINK_PREFIX.resume

const icons = {
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

const guestList: LnbMenuItem[] = [
    { id: 'resume-browse', title: '이력서 둘러보기', path: pathPrefix, icon: icons.browse },
]

const authList: LnbMenuItem[] = [
    { id: 'resume-browse', title: '이력서 둘러보기', path: pathPrefix, icon: icons.browse },
    { id: 'resume-mypage', title: '마이페이지', path: `${pathPrefix}/mypage`, icon: icons.mypage },
    { id: 'resume-admin', title: '이력서 관리', path: `${pathPrefix}/admin/skills`, icon: icons.dashboard },
]

export const lnbItems = {
    hasPrefixList: guestList,
    hasPrefixAuthList: authList,
}

export default lnbItems
