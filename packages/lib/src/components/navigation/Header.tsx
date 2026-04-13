/**
 * Header Component - KOMCA 패턴
 *
 * gnbItems만 받고 내부에서 navigate, logout 처리
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectAccessToken, selectUser } from '../../store/app-store';

export interface GnbItem {
  id: string;
  title: string;
  path: string;
}

export interface HeaderProps {
  gnbItems: GnbItem[];
  appName?: string;
  logo?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ gnbItems, appName = '앱', logo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);
  const user = useSelector(selectUser);
  const isAuthenticated = !!accessToken;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-logo" onClick={() => handleNavigate('/')}>
          {logo || appName}
        </div>
        <nav className="app-header-nav">
          {gnbItems.map((item) => (
            <button
              key={item.id}
              className="app-header-nav-item"
              onClick={() => handleNavigate(item.path)}
            >
              {item.title}
            </button>
          ))}
        </nav>
        <div className="app-header-user">
          {isAuthenticated ? (
            <>
              <span className="app-header-user-name">{user?.name || user?.email}</span>
              <button className="app-header-logout" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="app-header-login" onClick={() => handleNavigate('/login')}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
