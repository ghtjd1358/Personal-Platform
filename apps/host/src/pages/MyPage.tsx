/**
 * MyPage (Host-level) — 4개 remote 도메인 통합 마이페이지.
 *
 * 아키텍처 (옵션 A):
 * - 각 remote 가 `./MyPageData` 를 expose → data hook (예: useMyResumeSummary)
 * - host 가 React.lazy 로 dynamic import + Suspense 로 rendering
 * - 각 remote 는 자기 domain 지식을 내부에 유지, host 는 **composition** 만 담당
 *
 * Stage 1 (현재): 쉘 + 4 domain 카드 (placeholder). data hook expose 는 Stage 2.
 *
 * 라우트: /container/user/:userId (LNB 에서 진입)
 */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCurrentUser } from '@sonhoseong/mfa-lib';
import { RoutePath } from './routes/paths';
import './MyPage.css';

// ============================================================
// Stage 2 지점 — 각 remote 가 MyPageData 를 expose 하면 활성화
// ============================================================
// const ResumeSummary = React.lazy(() =>
//   import('@resume/MyPageData').then(m => ({ default: m.ResumeSummaryCard }))
// );
// const BlogSummary = React.lazy(() =>
//   import('@blog/MyPageData').then(m => ({ default: m.BlogSummaryCard }))
// );
// const PortfolioSummary = React.lazy(() =>
//   import('@portfolio/MyPageData').then(m => ({ default: m.PortfolioSummaryCard }))
// );
// const JobTrackerSummary = React.lazy(() =>
//   import('@jobtracker/MyPageData').then(m => ({ default: m.JobTrackerSummaryCard }))
// );

interface DomainCard {
    key: string;
    eyebrow: string;
    title: string;
    sub: string;
    viewHref: string;        // "열기" — domain 메인 진입
    createHref: string;      // primary action — 새 항목 추가/작성
    createLabel: string;
    hint: string;
}

const DOMAIN_CARDS: DomainCard[] = [
    {
        key: 'resume',
        eyebrow: 'DOMAIN · RESUME',
        title: '이력서',
        sub: '경력 · 프로젝트 · 기술 스택을 한 장에',
        viewHref: RoutePath.Resume,
        createHref: '/container/resume/admin/experience/new',
        createLabel: '+ 경력 추가',
        hint: '커리어의 긴 흐름',
    },
    {
        key: 'blog',
        eyebrow: 'DOMAIN · BLOG',
        title: '블로그',
        sub: '쓴 글 · 시리즈 · 통계를 기록',
        viewHref: RoutePath.Blog,
        createHref: '/container/blog/write',
        createLabel: '+ 글쓰기',
        hint: '생각의 축적',
    },
    {
        key: 'portfolio',
        eyebrow: 'DOMAIN · PORTFOLIO',
        title: '포트폴리오',
        sub: '대표작 · 상세 카드 · 방문 통계',
        viewHref: RoutePath.Portfolio,
        createHref: '/container/resume/admin/portfolio/new',
        createLabel: '+ 포트폴리오 추가',
        hint: '작업물의 진열',
    },
    {
        key: 'jobtracker',
        eyebrow: 'DOMAIN · JOB TRACKER',
        title: '취업관리',
        sub: '지원 현황 · 면접 일정 · 칸반',
        viewHref: RoutePath.JobTracker,
        createHref: RoutePath.JobTracker, // jobtracker 는 내부 kanban 에서 직접 추가 → 일단 홈 진입
        createLabel: '취업관리 열기',
        hint: '다음 문을 여는 메모',
    },
];

const MyPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const currentUser = getCurrentUser();
    const isSelf = currentUser?.id === userId;
    const displayName = currentUser?.name || currentUser?.email || '방문자';

    return (
        <div className="host-mypage">
            {/* ===== Hero ===== */}
            <header className="host-mypage-hero">
                <span className="host-mypage-eyebrow">MYPAGE · FOUR DOMAINS, ONE AUTHOR</span>
                <h1 className="host-mypage-title">
                    <em>{displayName}</em> 님의 방
                </h1>
                <p className="host-mypage-sub">
                    이력서 · 블로그 · 포트폴리오 · 취업관리 네 도메인을 한 눈에 모아봅니다.
                    각 카드를 클릭하면 해당 섹션으로 이동해 자세히 편집할 수 있어요.
                </p>
                {!isSelf && (
                    <div className="host-mypage-notice">
                        다른 사용자의 페이지를 보고 있어요 · 편집은 불가합니다.
                    </div>
                )}
            </header>

            {/* ===== 4 domain cards ===== */}
            <section className="host-mypage-grid">
                {DOMAIN_CARDS.map((card, i) => (
                    <article
                        key={card.key}
                        className="host-mypage-card"
                        style={{ ['--i' as any]: i }}
                    >
                        <div className="host-mypage-card-tape" aria-hidden="true"></div>
                        <span className="host-mypage-card-eyebrow">{card.eyebrow}</span>
                        <h2 className="host-mypage-card-title">{card.title}</h2>
                        <p className="host-mypage-card-sub">{card.sub}</p>
                        <div className="host-mypage-card-divider" aria-hidden="true"></div>
                        <div className="host-mypage-card-footer">
                            <span className="host-mypage-card-hint">{card.hint}</span>
                            <div className="host-mypage-card-actions">
                                <Link
                                    to={card.viewHref}
                                    className="host-mypage-card-cta host-mypage-card-cta--ghost"
                                >
                                    열기 →
                                </Link>
                                <Link
                                    to={card.createHref}
                                    className="host-mypage-card-cta host-mypage-card-cta--primary"
                                >
                                    {card.createLabel}
                                </Link>
                            </div>
                        </div>

                        {/* Stage 2: lazy-loaded data slot */}
                        {/*
                        <Suspense fallback="">
                          {card.key === 'resume' && <ResumeSummary userId={userId} />}
                          {card.key === 'blog' && <BlogSummary userId={userId} />}
                          ...
                        </Suspense>
                        */}
                    </article>
                ))}
            </section>

            {/* ===== Footer note ===== */}
            <footer className="host-mypage-footer">
                <span className="host-mypage-footer-label">STAGE</span>
                <span>
                    현재 Stage 1 (쉘 + 라우팅). 각 remote 의 <code>./MyPageData</code> expose 가 완료되면
                    카드마다 실시간 요약 데이터가 들어갑니다.
                </span>
            </footer>
        </div>
    );
};

export default MyPage;
