import React from 'react'
import { REMOTE_LINK_PREFIX, LnbMenuItem } from '@sonhoseong/mfa-lib'
import { RoutePath } from '@/pages/routes/paths'

export const pathPrefix = REMOTE_LINK_PREFIX.blog

const icons = {
    blog: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="m2 2 7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    ),
    write: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
}

const guestList: LnbMenuItem[] = [
    { id: 'blog-home', title: '블로그', path: RoutePath.Blog, icon: icons.blog },
]

const authList: LnbMenuItem[] = [
    { id: 'blog-home', title: '블로그', path: RoutePath.Blog, icon: icons.blog },
    { id: 'blog-write', title: '글쓰기', path: RoutePath.Write, icon: icons.write },
]

export const lnbItems = {
    hasPrefixList: guestList,
    hasPrefixAuthList: authList,
}

export default lnbItems
