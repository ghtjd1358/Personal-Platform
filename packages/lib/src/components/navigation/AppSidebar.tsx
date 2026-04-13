/**
 * AppSidebar - KOMCA 패턴
 *
 * 사이드바 네비게이션 컴포넌트
 * Remote 앱 단독 실행 시 사용
 */

import React, { useState, useCallback } from 'react';

export interface SidebarMenuItem {
    id: string;
    title: string;
    path?: string;
    icon?: React.ReactNode;
    children?: SidebarMenuItem[];
}

export interface AppSidebarProps {
    /** 앱 이름 */
    appName?: string;
    /** 로그인 여부 */
    isAuthenticated?: boolean;
    /** 사용자 이름 */
    userName?: string;
    /** 사용자 이메일 */
    userEmail?: string;
    /** 메뉴 아이템 */
    menuItems?: SidebarMenuItem[];
    /** 로그아웃 핸들러 */
    onLogout?: () => void;
    /** 네비게이션 핸들러 */
    onNavigate?: (path: string) => void;
    /** 현재 경로 */
    currentPath?: string;
    /** 커스텀 로고 */
    logo?: React.ReactNode;
    /** 접힌 상태 (외부 제어) */
    collapsed?: boolean;
    /** 접힘 상태 변경 콜백 */
    onCollapsedChange?: (collapsed: boolean) => void;
}

export function AppSidebar({
    appName = 'MFA',
    isAuthenticated = false,
    userName,
    userEmail,
    menuItems = [],
    onLogout,
    onNavigate,
    currentPath = '/',
    logo,
    collapsed: controlledCollapsed,
    onCollapsedChange,
}: AppSidebarProps) {
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
    const [internalCollapsed, setInternalCollapsed] = useState(false);

    // 외부 제어 또는 내부 상태 사용
    const collapsed = controlledCollapsed ?? internalCollapsed;

    const toggleCollapsed = useCallback(() => {
        const newValue = !collapsed;
        setInternalCollapsed(newValue);
        onCollapsedChange?.(newValue);
    }, [collapsed, onCollapsedChange]);

    const toggleMenu = useCallback((menuId: string) => {
        setExpandedMenus(prev => {
            const next = new Set(prev);
            if (next.has(menuId)) {
                next.delete(menuId);
            } else {
                next.add(menuId);
            }
            return next;
        });
    }, []);

    const handleNavigate = useCallback((path: string) => {
        onNavigate?.(path);
    }, [onNavigate]);

    const renderMenuItem = (item: SidebarMenuItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.has(item.id);
        const isActive = item.path === currentPath;

        return (
            <li key={item.id} className="sidebar-menu-item">
                <button
                    className={`sidebar-menu-btn ${isActive ? 'active' : ''} ${depth > 0 ? 'child' : ''}`}
                    onClick={() => {
                        if (hasChildren) {
                            toggleMenu(item.id);
                        } else if (item.path) {
                            handleNavigate(item.path);
                        }
                    }}
                    title={collapsed ? item.title : undefined}
                >
                    {item.icon && <span className="sidebar-menu-icon">{item.icon}</span>}
                    {!collapsed && <span className="sidebar-menu-title">{item.title}</span>}
                    {!collapsed && hasChildren && (
                        <svg
                            className={`sidebar-menu-arrow ${isExpanded ? 'expanded' : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    )}
                </button>
                {!collapsed && hasChildren && isExpanded && (
                    <ul className="sidebar-submenu">
                        {item.children!.map(child => renderMenuItem(child, depth + 1))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Toggle Button - 우측 상단 고정 */}
            <button
                className="sidebar-toggle-btn"
                onClick={toggleCollapsed}
                title={collapsed ? '메뉴 열기' : '메뉴 닫기'}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {collapsed ? (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    ) : (
                        <path d="M18 6L6 18M6 6l12 12" />
                    )}
                </svg>
            </button>

            {/* Header */}
            <div className="sidebar-header">
                <button className="sidebar-logo" onClick={() => handleNavigate('/')}>
                    {logo || (
                        <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
                            <rect x="20" y="2" width="8" height="16" rx="4" fill="#0EA5E9"/>
                            <rect x="6" y="16" width="36" height="6" rx="3" fill="#0EA5E9"/>
                            <ellipse cx="24" cy="36" rx="18" ry="12" fill="#0EA5E9"/>
                            <ellipse cx="17" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
                            <ellipse cx="31" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
                        </svg>
                    )}
                    {!collapsed && <span className="sidebar-app-name">{appName}</span>}
                </button>
            </div>

            {/* Menu */}
            <nav className="sidebar-nav">
                {menuItems.length > 0 ? (
                    <ul className="sidebar-menu">
                        {menuItems.map(item => renderMenuItem(item))}
                    </ul>
                ) : (
                    <ul className="sidebar-menu">
                        <li className="sidebar-menu-item">
                            <button
                                className={`sidebar-menu-btn ${currentPath === '/' ? 'active' : ''}`}
                                onClick={() => handleNavigate('/')}
                                title={collapsed ? '홈' : undefined}
                            >
                                <span className="sidebar-menu-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </span>
                                {!collapsed && <span className="sidebar-menu-title">홈</span>}
                            </button>
                        </li>
                    </ul>
                )}
            </nav>

            {/* Footer - User Info */}
            <div className={`sidebar-footer ${collapsed ? 'collapsed' : ''}`}>
                {isAuthenticated ? (
                    collapsed ? (
                        // 접힌 상태: 로그아웃 버튼만 표시
                        <button
                            className="sidebar-logout-btn-collapsed"
                            onClick={onLogout}
                            title="로그아웃"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    ) : (
                        // 펼친 상태: 전체 유저 정보 표시
                        <div className="sidebar-user">
                            <div className="sidebar-user-avatar">
                                {userName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="sidebar-user-info">
                                <span className="sidebar-user-name">{userName || '사용자'}</span>
                                {userEmail && <span className="sidebar-user-email">{userEmail}</span>}
                            </div>
                            <button className="sidebar-logout-btn" onClick={onLogout} title="로그아웃">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    )
                ) : (
                    <button
                        className={`sidebar-login-btn ${collapsed ? 'collapsed' : ''}`}
                        onClick={() => collapsed ? toggleCollapsed() : handleNavigate('/login')}
                        title={collapsed ? '로그인' : undefined}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        {!collapsed && '로그인'}
                    </button>
                )}
            </div>
        </aside>
    );
}

export default AppSidebar;
