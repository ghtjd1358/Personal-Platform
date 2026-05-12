import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 공통 네비게이션 바 - KOMCA 패턴
 * Remote 앱 단독 실행 시 사용
 */
export const AppNavbar = ({ appName = '앱', homePath = '/', adminPath = '/admin', loginPath = '/login', isAuthenticated, userName, onLogout, onNavigate, extraLinks = [] }) => {
    const styles = {
        navbar: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #E2E8F0',
        },
        inner: {
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        logoLink: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#1E3A5F',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
        },
        links: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        link: {
            padding: '8px 16px',
            color: '#64748B',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
        },
        linkActive: {
            color: '#0EA5E9',
            background: 'rgba(14, 165, 233, 0.1)',
        },
    };
    return (_jsx("nav", { style: styles.navbar, children: _jsxs("div", { style: styles.inner, children: [_jsxs("button", { style: styles.logoLink, onClick: () => onNavigate(homePath), children: [_jsx("svg", { viewBox: "0 0 48 48", width: "24", height: "24", fill: "none", children: _jsx("path", { d: "M 8 40 L 24 8 L 40 40", stroke: "#1E3A5F", strokeWidth: "8", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }) }), _jsx("span", { children: appName })] }), _jsxs("div", { style: styles.links, children: [_jsx("button", { style: styles.link, onClick: () => onNavigate(homePath), onMouseOver: (e) => (e.currentTarget.style.background = '#F8FAFC'), onMouseOut: (e) => (e.currentTarget.style.background = 'transparent'), children: "\uD648" }), extraLinks.map((link) => (_jsx("button", { style: {
                                ...styles.link,
                                ...(link.isActive ? styles.linkActive : {}),
                            }, onClick: () => onNavigate(link.path), children: link.label }, link.path))), isAuthenticated && (_jsx("button", { style: styles.link, onClick: () => onNavigate(adminPath), onMouseOver: (e) => (e.currentTarget.style.background = '#F8FAFC'), onMouseOut: (e) => (e.currentTarget.style.background = 'transparent'), children: "\uAD00\uB9AC" })), !isAuthenticated ? (_jsx("button", { style: {
                                ...styles.link,
                                background: '#1E3A5F',
                                color: 'white',
                            }, onClick: () => onNavigate(loginPath), onMouseOver: (e) => (e.currentTarget.style.background = '#0EA5E9'), onMouseOut: (e) => (e.currentTarget.style.background = '#1E3A5F'), children: "\uB85C\uADF8\uC778" })) : (_jsxs("button", { style: styles.link, onClick: onLogout, onMouseOver: (e) => (e.currentTarget.style.background = '#F8FAFC'), onMouseOut: (e) => (e.currentTarget.style.background = 'transparent'), children: ["\uB85C\uADF8\uC544\uC6C3 ", userName && `(${userName})`] }))] })] }) }));
};
export default AppNavbar;
