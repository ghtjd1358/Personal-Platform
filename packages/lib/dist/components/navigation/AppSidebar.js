import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AppSidebar - KOMCA 패턴
 *
 * 사이드바 네비게이션 컴포넌트
 * Remote 앱 단독 실행 시 사용
 */
import { useState, useCallback } from 'react';
export function AppSidebar({ appName = 'MFA', isAuthenticated = false, userName, userEmail, menuItems = [], onLogout, onNavigate, currentPath = '/', logo, collapsed: controlledCollapsed, onCollapsedChange, }) {
    const [expandedMenus, setExpandedMenus] = useState(new Set());
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    // 외부 제어 또는 내부 상태 사용
    const collapsed = controlledCollapsed ?? internalCollapsed;
    const toggleCollapsed = useCallback(() => {
        const newValue = !collapsed;
        setInternalCollapsed(newValue);
        onCollapsedChange?.(newValue);
    }, [collapsed, onCollapsedChange]);
    const toggleMenu = useCallback((menuId) => {
        setExpandedMenus(prev => {
            const next = new Set(prev);
            if (next.has(menuId)) {
                next.delete(menuId);
            }
            else {
                next.add(menuId);
            }
            return next;
        });
    }, []);
    const handleNavigate = useCallback((path) => {
        onNavigate?.(path);
    }, [onNavigate]);
    const renderMenuItem = (item, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.has(item.id);
        const isActive = item.path === currentPath;
        return (_jsxs("li", { className: "sidebar-menu-item", children: [_jsxs("button", { className: `sidebar-menu-btn ${isActive ? 'active' : ''} ${depth > 0 ? 'child' : ''}`, onClick: () => {
                        if (hasChildren) {
                            toggleMenu(item.id);
                        }
                        else if (item.path) {
                            handleNavigate(item.path);
                        }
                    }, title: collapsed ? item.title : undefined, children: [item.icon && _jsx("span", { className: "sidebar-menu-icon", children: item.icon }), !collapsed && _jsx("span", { className: "sidebar-menu-title", children: item.title }), !collapsed && hasChildren && (_jsx("svg", { className: `sidebar-menu-arrow ${isExpanded ? 'expanded' : ''}`, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "m9 18 6-6-6-6" }) }))] }), !collapsed && hasChildren && isExpanded && (_jsx("ul", { className: "sidebar-submenu", children: item.children.map(child => renderMenuItem(child, depth + 1)) }))] }, item.id));
    };
    return (_jsxs("aside", { className: `app-sidebar ${collapsed ? 'collapsed' : ''}`, children: [_jsx("button", { className: "sidebar-toggle-btn", onClick: toggleCollapsed, title: collapsed ? '메뉴 열기' : '메뉴 닫기', children: _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: collapsed ? (_jsx("path", { d: "M3 12h18M3 6h18M3 18h18" })) : (_jsx("path", { d: "M18 6L6 18M6 6l12 12" })) }) }), _jsx("div", { className: "sidebar-header", children: _jsxs("button", { className: "sidebar-logo", onClick: () => handleNavigate('/'), children: [logo || (_jsxs("svg", { viewBox: "0 0 48 48", fill: "none", width: "32", height: "32", children: [_jsx("rect", { x: "20", y: "2", width: "8", height: "16", rx: "4", fill: "#0EA5E9" }), _jsx("rect", { x: "6", y: "16", width: "36", height: "6", rx: "3", fill: "#0EA5E9" }), _jsx("ellipse", { cx: "24", cy: "36", rx: "18", ry: "12", fill: "#0EA5E9" }), _jsx("ellipse", { cx: "17", cy: "36", rx: "4", ry: "6", fill: "#FFFFFF" }), _jsx("ellipse", { cx: "31", cy: "36", rx: "4", ry: "6", fill: "#FFFFFF" })] })), !collapsed && _jsx("span", { className: "sidebar-app-name", children: appName })] }) }), _jsx("nav", { className: "sidebar-nav", children: menuItems.length > 0 ? (_jsx("ul", { className: "sidebar-menu", children: menuItems.map(item => renderMenuItem(item)) })) : (_jsx("ul", { className: "sidebar-menu", children: _jsx("li", { className: "sidebar-menu-item", children: _jsxs("button", { className: `sidebar-menu-btn ${currentPath === '/' ? 'active' : ''}`, onClick: () => handleNavigate('/'), title: collapsed ? '홈' : undefined, children: [_jsx("span", { className: "sidebar-menu-icon", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), _jsx("polyline", { points: "9 22 9 12 15 12 15 22" })] }) }), !collapsed && _jsx("span", { className: "sidebar-menu-title", children: "\uD648" })] }) }) })) }), _jsx("div", { className: `sidebar-footer ${collapsed ? 'collapsed' : ''}`, children: isAuthenticated ? (collapsed ? (
                // 접힌 상태: 로그아웃 버튼만 표시
                _jsx("button", { className: "sidebar-logout-btn-collapsed", onClick: onLogout, title: "\uB85C\uADF8\uC544\uC6C3", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), _jsx("polyline", { points: "16 17 21 12 16 7" }), _jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" })] }) })) : (
                // 펼친 상태: 전체 유저 정보 표시
                _jsxs("div", { className: "sidebar-user", children: [_jsx("div", { className: "sidebar-user-avatar", children: userName?.charAt(0).toUpperCase() || 'U' }), _jsxs("div", { className: "sidebar-user-info", children: [_jsx("span", { className: "sidebar-user-name", children: userName || '사용자' }), userEmail && _jsx("span", { className: "sidebar-user-email", children: userEmail })] }), _jsx("button", { className: "sidebar-logout-btn", onClick: onLogout, title: "\uB85C\uADF8\uC544\uC6C3", children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), _jsx("polyline", { points: "16 17 21 12 16 7" }), _jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" })] }) })] }))) : (_jsxs("button", { className: `sidebar-login-btn ${collapsed ? 'collapsed' : ''}`, onClick: () => collapsed ? toggleCollapsed() : handleNavigate('/login'), title: collapsed ? '로그인' : undefined, children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }), _jsx("polyline", { points: "10 17 15 12 10 7" }), _jsx("line", { x1: "15", y1: "12", x2: "3", y2: "12" })] }), !collapsed && '로그인'] })) })] }));
}
export default AppSidebar;
