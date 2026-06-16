import { LnbMenuItem, DashboardIcon, ResumeIcon, BlogIcon, PortfolioIcon, JobTrackerIcon, MyPageIcon } from '@sonhoseong/mfa-lib';
import { RoutePath } from './pages/routes/paths';
import { User } from '@sonhoseong/mfa-lib';

const staticItems: LnbMenuItem[] = [
    { id: 'dashboard', title: '대시보드', path: RoutePath.Dashboard, icon: DashboardIcon },
    { id: 'resume',    title: '이력서',   path: RoutePath.Resume,    icon: ResumeIcon    },
    { id: 'blog',      title: '블로그',   path: RoutePath.Blog,      icon: BlogIcon      },
    { id: 'portfolio', title: '포트폴리오', path: RoutePath.Portfolio, icon: PortfolioIcon },
    { id: 'jobtracker', title: '취업관리', path: RoutePath.JobTracker, icon: JobTrackerIcon },
];

export function buildLnbItems(user: User | null, isOwner: boolean): LnbMenuItem[] {
    if (user && isOwner) {
        return [...staticItems, { id: 'mypage', title: '마이페이지', path: `/container/user/${user.id}`, icon: MyPageIcon }];
    }
    return staticItems;
}
