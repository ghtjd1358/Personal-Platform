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
    return (_jsxs("aside", { className: `app-lnb ${collapsed ? 'collapsed' : ''}`, children: [_jsxs("div", { className: "app-lnb-header", children: [(logo || appName) && (_jsx("div", { className: "app-lnb-logo", onClick: () => handleNavigate('/'), children: isValidElement(logo)
                            ? cloneElement(logo, { centerOnly: collapsed })
                            : (collapsed ? null : appName) })), title && !collapsed && _jsx("div", { className: "app-lnb-title", children: title }), _jsx("button", { className: "app-lnb-toggle", onClick: () => setCollapsed(!collapsed), children: collapsed ? '›' : '‹' })] }), _jsx("nav", { className: "app-lnb-nav", children: lnbItems.map((item) => (_jsx("div", { className: "app-lnb-item", children: item.children ? (_jsxs(_Fragment, { children: [_jsxs("button", { className: `app-lnb-item-btn ${expandedItems.includes(item.id) ? 'expanded' : ''}`, onClick: () => toggleExpand(item.id), children: [item.icon && _jsx("span", { className: "app-lnb-icon", children: item.icon }), !collapsed && _jsx("span", { className: "app-lnb-text", children: item.title }), !collapsed && (_jsx("span", { className: "app-lnb-arrow", children: expandedItems.includes(item.id) ? '▼' : '▶' }))] }), expandedItems.includes(item.id) && !collapsed && (_jsx("div", { className: "app-lnb-subitems", children: item.children.map((child) => (_jsx("button", { className: `app-lnb-subitem ${isActive(child.path) ? 'active' : ''}`, onClick: () => child.path && handleNavigate(child.path), children: child.title }, child.id))) }))] })) : (_jsxs("button", { className: `app-lnb-item-btn ${isActive(item.path) ? 'active' : ''}`, onClick: () => item.path && handleNavigate(item.path), children: [item.icon && _jsx("span", { className: "app-lnb-icon", children: item.icon }), !collapsed && _jsx("span", { className: "app-lnb-text", children: item.title })] })) }, item.id))) }), _jsx("div", { className: `app-lnb-footer ${collapsed ? 'collapsed' : ''}`, children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "app-lnb-user-section", children: [_jsx("div", { className: "app-lnb-avatar", children: user?.name?.charAt(0) || user?.email?.charAt(0) || '?' }), !collapsed && user && (_jsx("span", { className: "app-lnb-user-name", children: user.name || user.email }))] }), _jsx("button", { className: "app-lnb-logout-icon", onClick: onLogout, title: "\uB85C\uADF8\uC544\uC6C3", children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), _jsx("polyline", { points: "16 17 21 12 16 7" }), _jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" })] }) })] })) : (_jsxs("button", { className: "app-lnb-login-btn", onClick: () => handleNavigate('/login'), children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }), _jsx("polyline", { points: "10 17 15 12 10 7" }), _jsx("line", { x1: "15", y1: "12", x2: "3", y2: "12" })] }), !collapsed && _jsx("span", { children: "\uB85C\uADF8\uC778" })] })) })] }));
};
export default Lnb;
