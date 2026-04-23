import { LnbItem, REMOTE_LINK_PREFIX } from '@sonhoseong/mfa-lib';

export const pathPrefix = REMOTE_LINK_PREFIX.jobtracker;

const lnbItems: LnbItem[] = [
  {
    name: '대시보드',
    path: `${pathPrefix}`,
    icon: 'dashboard'
  },
  {
    name: '채용공고 검색',
    path: `${pathPrefix}/search`,
    icon: 'search'
  },
  {
    name: '지원 현황',
    path: `${pathPrefix}/tracker`,
    icon: 'kanban'
  },
  {
    name: '일정 캘린더',
    path: `${pathPrefix}/calendar`,
    icon: 'calendar'
  }
];

export default lnbItems;
