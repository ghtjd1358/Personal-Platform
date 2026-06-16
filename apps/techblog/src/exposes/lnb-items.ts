import { REMOTE_LINK_PREFIX } from '@sonhoseong/mfa-lib';

export const pathPrefix = REMOTE_LINK_PREFIX.jobtracker;

const guestList = [
    { id: 'tracker-dashboard', title: '대시보드', path: `${pathPrefix}` },
    { id: 'tracker-search', title: '채용공고 검색', path: `${pathPrefix}/search` },
    { id: 'tracker-kanban', title: '지원 현황', path: `${pathPrefix}/tracker` },
    { id: 'tracker-calendar', title: '일정 캘린더', path: `${pathPrefix}/calendar` },
];

const authList = [
    { id: 'tracker-dashboard', title: '대시보드', path: `${pathPrefix}` },
    { id: 'tracker-search', title: '채용공고 검색', path: `${pathPrefix}/search` },
    { id: 'tracker-kanban', title: '지원 현황', path: `${pathPrefix}/tracker` },
    { id: 'tracker-calendar', title: '일정 캘린더', path: `${pathPrefix}/calendar` },
];

export const lnbItems = {
    hasPrefixList: guestList,
    hasPrefixAuthList: authList,
};

export default lnbItems;
