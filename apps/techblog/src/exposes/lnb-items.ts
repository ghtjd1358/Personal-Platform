import { LnbItem } from '@sonhoseong/mfa-lib';

export const pathPrefix = '/container/jobtracker';

const lnbItems: LnbItem[] = [
  {
    name: '대시보드',
    path: '/container/jobtracker',
    icon: 'dashboard'
  },
  {
    name: '채용공고 검색',
    path: '/container/jobtracker/search',
    icon: 'search'
  },
  {
    name: '지원 현황',
    path: '/container/jobtracker/tracker',
    icon: 'kanban'
  },
  {
    name: '일정 캘린더',
    path: '/container/jobtracker/calendar',
    icon: 'calendar'
  }
];

export default lnbItems;
