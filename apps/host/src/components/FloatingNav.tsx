/**
 * FloatingNav — 하단 우측 4-앱 dock.
 * 어느 페이지에 있든 이력서·블로그·포트폴리오·취업관리로 1-클릭 전환.
 * 기본은 collapsed(아이콘 1개) 상태, hover 시 세로로 4 버튼 fan-up.
 * 클릭은 collapsed 상태에서도 가능하게 기본은 항상 visible 한 compact dock.
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { RoutePath } from '../pages/routes/paths';
import './FloatingNav.css';

const items = [
    { to: RoutePath.Resume, label: '이력서', abbr: '이' },
    { to: RoutePath.Blog, label: '블로그', abbr: '블' },
    { to: RoutePath.Portfolio, label: '포트폴리오', abbr: '포' },
    { to: RoutePath.JobTracker, label: '취업관리', abbr: '취' },
];

const FloatingNav: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={`host-dock${open ? ' is-open' : ''}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <nav className="host-dock-items" aria-label="주요 페이지">
                {items.map((it, i) => (
                    <NavLink
                        key={it.to}
                        to={it.to}
                        className={({ isActive }) =>
                            `host-dock-btn${isActive ? ' is-active' : ''}`
                        }
                        style={{ ['--i' as any]: i }}
                    >
                        <span className="host-dock-btn-abbr">{it.abbr}</span>
                        <span className="host-dock-btn-label">{it.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button
                type="button"
                className="host-dock-toggle"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? '메뉴 닫기' : '주요 페이지 메뉴'}
                aria-expanded={open}
            >
                <span className="host-dock-toggle-glyph" aria-hidden="true">
                    {open ? '×' : '≡'}
                </span>
            </button>
        </div>
    );
};

export default FloatingNav;
