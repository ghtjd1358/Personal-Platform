import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, isValidElement, cloneElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, selectUser } from '../../store/app-store';
export const Lnb = ({ lnbItems, title, appName, logo, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const accessToken = useSelector(selectAccessToken);
    const user = useSelector(selectUser);
    const isAuthenticated = !!accessToken;
    const handleNavigate = (path) => navigate(path);
    const toggleExpand = (itemId) => {
        setExpandedItems((prev) => prev.includes(itemId)
            ? prev.filter((id) => id !== itemId)
            : [...prev, itemId]);
    };
    const isActive = (path) => {
        if (!path)
            return false;
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };
    return (_jsxs("aside", { className: `app-lnb ${collapsed ? 'collapsed' : ''}`, "aria-label": "\uC8FC \uBA54\uB274", children: [_jsxs("div", { className: "app-lnb-header", children: [(logo || appName) && (_jsx("div", { className: "app-lnb-logo", onClick: () => handleNavigate('/'), children: isValidElement(logo)
                            ? cloneElement(logo, { centerOnly: collapsed })
                            : (collapsed ? null : appName) })), title && !collapsed && _jsx("div", { className: "app-lnb-title", children: title }), _jsx("button", { className: "app-lnb-toggle", type: "button", onClick: () => setCollapsed(!collapsed), "aria-label": "\uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00", "aria-expanded": !collapsed, children: collapsed ? '›' : '‹' })] }), _jsx("nav", { className: "app-lnb-nav", children: lnbItems.map((item) => {
                    const itemActive = isActive(item.path);
                    const childActive = item.children?.some((c) => isActive(c.path)) ?? false;
                    const expanded = expandedItems.includes(item.id);
                    return (_jsx("div", { className: "app-lnb-item", children: item.children ? (_jsxs(_Fragment, { children: [_jsxs("button", { className: `app-lnb-item-btn ${expanded ? 'expanded' : ''}`, type: "button", onClick: () => toggleExpand(item.id), "aria-expanded": expanded, "aria-label": collapsed ? item.title : undefined, "aria-current": childActive ? 'page' : undefined, children: [item.icon && _jsx("span", { className: "app-lnb-icon", children: item.icon }), !collapsed && _jsx("span", { className: "app-lnb-text", children: item.title }), !collapsed && (_jsx("span", { className: "app-lnb-arrow", "aria-hidden": "true", children: expanded ? '▼' : '▶' }))] }), expanded && !collapsed && (_jsx("div", { className: "app-lnb-subitems", children: item.children.map((child) => {
                                        const subActive = isActive(child.path);
                                        return (_jsx("button", { className: `app-lnb-subitem ${subActive ? 'active' : ''}`, type: "button", onClick: () => child.path && handleNavigate(child.path), "aria-current": subActive ? 'page' : undefined, children: child.title }, child.id));
                                    }) }))] })) : (_jsxs("button", { className: `app-lnb-item-btn ${itemActive ? 'active' : ''}`, type: "button", onClick: () => item.path && handleNavigate(item.path), "aria-label": collapsed ? item.title : undefined, "aria-current": itemActive ? 'page' : undefined, children: [item.icon && _jsx("span", { className: "app-lnb-icon", children: item.icon }), !collapsed && _jsx("span", { className: "app-lnb-text", children: item.title })] })) }, item.id));
                }) }), _jsx("div", { className: `app-lnb-footer ${collapsed ? 'collapsed' : ''}`, children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "app-lnb-user-section", children: [_jsx("div", { className: "app-lnb-avatar", "aria-hidden": "true", children: user?.name?.charAt(0) || user?.email?.charAt(0) || '?' }), !collapsed && user && (_jsx("span", { className: "app-lnb-user-name", children: user.name || user.email }))] }), _jsx("button", { className: "app-lnb-logout-icon", type: "button", onClick: onLogout, title: "\uB85C\uADF8\uC544\uC6C3", "aria-label": "\uB85C\uADF8\uC544\uC6C3", children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [_jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), _jsx("polyline", { points: "16 17 21 12 16 7" }), _jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" })] }) })] })) : (_jsxs("button", { className: "app-lnb-login-btn", type: "button", onClick: () => handleNavigate('/login'), "aria-label": "\uB85C\uADF8\uC778", children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [_jsx("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }), _jsx("polyline", { points: "10 17 15 12 10 7" }), _jsx("line", { x1: "15", y1: "12", x2: "3", y2: "12" })] }), !collapsed && _jsx("span", { children: "\uB85C\uADF8\uC778" })] })) })] }));
};
export default Lnb;
