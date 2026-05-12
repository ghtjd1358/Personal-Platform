import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectAccessToken, selectUser } from '../../store/app-store';
import { getSupabase } from '../../network/supabase-client';
export const Header = ({ gnbItems, appName = '앱', logo }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = useSelector(selectAccessToken);
    const user = useSelector(selectUser);
    const isAuthenticated = !!accessToken;
    const handleNavigate = (path) => {
        navigate(path);
    };
    const handleLogout = async () => {
        // Supabase 자체 session 까지 제거 — 우리 storage 만 비우면 새로고침 시 sb-*-auth-token 으로 자동 hydrate 됨.
        try {
            await getSupabase().auth.signOut();
        }
        catch (err) {
            console.warn('supabase signOut failed:', err);
        }
        dispatch(logout());
        navigate('/');
    };
    return (_jsx("header", { className: "app-header", children: _jsxs("div", { className: "app-header-inner", children: [_jsx("div", { className: "app-header-logo", onClick: () => handleNavigate('/'), children: logo || appName }), _jsx("nav", { className: "app-header-nav", children: gnbItems.map((item) => (_jsx("button", { className: "app-header-nav-item", onClick: () => handleNavigate(item.path), children: item.title }, item.id))) }), _jsx("div", { className: "app-header-user", children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "app-header-user-name", children: user?.name || user?.email }), _jsx("button", { className: "app-header-logout", onClick: handleLogout, children: "\uB85C\uADF8\uC544\uC6C3" })] })) : (_jsx("button", { className: "app-header-login", onClick: () => handleNavigate('/login'), children: "\uB85C\uADF8\uC778" })) })] }) }));
};
export default Header;
