/**
 * Dashboard - Editorial Developer Magazine (A안)
 * 4 remote 앱을 매거진 목차 스타일로 소개하는 host 랜딩.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from './routes/paths';
import './Dashboard.css';

type IconProps = { className?: string };

const ResumeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const BlogIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
    </svg>
);

const PortfolioIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const JobTrackerIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
);

type Channel = {
    num: string;
    ko: string;
    en: string;
    desc: string;
    tags: string[];
    path: string;
    Icon: React.FC<IconProps>;
};

const channels: Channel[] = [
    {
        num: '/01',
        ko: '이력서',
        en: 'Résumé',
        desc: '경력과 프로젝트를 정리한 이력서. Supabase 기반으로 내용이 실시간 반영됩니다.',
        tags: ['React 19', 'Supabase', 'TypeScript'],
        path: RoutePath.Resume,
        Icon: ResumeIcon,
    },
    {
        num: '/02',
        ko: '블로그',
        en: 'Journal',
        desc: 'Tiptap 에디터와 Shiki 코드 하이라이팅을 갖춘 개인 블로그. 마크다운 CRUD와 시리즈 기능.',
        tags: ['Tiptap', 'Shiki', 'Markdown'],
        path: RoutePath.Blog,
        Icon: BlogIcon,
    },
    {
        num: '/03',
        ko: '포트폴리오',
        en: 'Works',
        desc: 'AOS 스크롤 애니메이션으로 연출한 프로젝트 쇼케이스. 카드 그리드와 상세 모달.',
        tags: ['AOS', 'Scroll Anim', 'Modal'],
        path: RoutePath.Portfolio,
        Icon: PortfolioIcon,
    },
    {
        num: '/04',
        ko: '취업관리',
        en: 'Tracker',
        desc: '지원 현황과 일정을 캘린더로 관리하는 트래커. 기술 블로그 포스팅도 함께 운영.',
        tags: ['Calendar', 'Tracker', 'Tech Blog'],
        path: RoutePath.JobTracker,
        Icon: JobTrackerIcon,
    },
];

const kstFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

const useClock = () => {
    const [time, setTime] = useState(() => kstFormatter.format(new Date()));
    useEffect(() => {
        const tick = () => setTime(kstFormatter.format(new Date()));
        const id = window.setInterval(tick, 15_000); // 15s는 분단위 표기엔 충분
        return () => window.clearInterval(id);
    }, []);
    return time;
};

const Grain: React.FC = () => (
    <svg className="dashboard-grain" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
        <filter id="dash-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch" />
            {/* 먹 먼지 noise (warm R>G>B), 한지 bg에 올라타는 파본 질감 */}
            <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dash-grain)" />
    </svg>
);

const Dashboard: React.FC = () => {
    const clock = useClock();
    const date = dateFormatter.format(new Date()).toUpperCase();

    return (
        <div className="dashboard-root">
            <Grain />

            <section className="dashboard-hero" style={{ animationDelay: '0.1s' }}>
                <div>
                    <span className="hero-eyebrow">MFA // Portfolio // 2026</span>
                    <h1 className="hero-title">
                        Four Apps,<br />
                        <em>One Shell.</em>
                    </h1>
                    <p className="hero-sub">
                        Webpack Module Federation으로 독립 배포된 네 개의 remote를 하나의 host에 묶은 포트폴리오 플랫폼.
                    </p>
                </div>
                <div className="hero-meta">
                    <div className="meta-row">
                        <span className="meta-label">NOW</span>
                        <span className="meta-value">{clock} KST</span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">DATE</span>
                        <span className="meta-value">{date}</span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">LIB</span>
                        <span className="meta-value">mfa-lib v1.3.10</span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">HOST</span>
                        <span className="meta-value">:5000 / container</span>
                    </div>
                </div>
            </section>

            <section className="dashboard-intro" style={{ animationDelay: '0.3s' }}>
                <p>
                    네 개의 <em>독립 앱</em>이 하나의 컨테이너로 엮인 마이크로 프론트엔드 포트폴리오.
                    각 remote는 자체 도메인과 배포 파이프라인을 가지며, <em>공유되는 인증과 상태</em>로
                    단일한 사용자 경험을 이어갑니다.
                </p>
            </section>

            <section>
                <header className="channels-header" style={{ animationDelay: '0.5s' }}>
                    <span className="channels-label">INDEX · REMOTE APPLICATIONS</span>
                    <h2 className="channels-title">
                        4<em> channels</em>
                    </h2>
                </header>

                {channels.map((ch, i) => (
                    <Link
                        to={ch.path}
                        key={ch.num}
                        className="channel"
                        style={{ animationDelay: `${0.7 + i * 0.15}s` }}
                        aria-label={`${ch.ko} (${ch.en})`}
                    >
                        <span className="channel-num">{ch.num}</span>
                        <div className="channel-meta">
                            <h3 className="channel-title">{ch.ko}</h3>
                            <span className="channel-sub">{ch.en}</span>
                        </div>
                        <div className="channel-body">
                            <p className="channel-desc">{ch.desc}</p>
                            <div className="channel-tags">
                                {ch.tags.map((t) => (
                                    <span key={t} className="channel-tag">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <span className="channel-arrow" aria-hidden>→</span>
                        <ch.Icon className="channel-icon" />
                    </Link>
                ))}
            </section>

            <footer className="stack-strip" style={{ animationDelay: '1.5s' }}>
                <span>REACT 19</span><span className="stack-dot">·</span>
                <span>MODULE FEDERATION</span><span className="stack-dot">·</span>
                <span>WEBPACK 5</span><span className="stack-dot">·</span>
                <span>REDUX TOOLKIT</span><span className="stack-dot">·</span>
                <span>SUPABASE</span><span className="stack-dot">·</span>
                <span>VERCEL</span>
                <span className="stack-strip-end">— SON / HOSEONG</span>
            </footer>
        </div>
    );
};

export default Dashboard;
