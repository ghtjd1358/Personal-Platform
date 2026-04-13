import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser, logout } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';

const BlogHeader: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 시 헤더 배경 변경
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(`${LINK_PREFIX}/`);
  };

  return (
    <header className={`blog-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="blog-header-inner">
        {/* Logo */}
        <Link to={`${LINK_PREFIX}/`} className="blog-header-logo">
          Blog
        </Link>

        {/* Auth Area */}
        <div className="blog-header-auth">
          {isAuthenticated ? (
            <>
              <Link to={`${LINK_PREFIX}/my`} className="blog-header-user">
                {currentUser?.name || 'User'}
              </Link>
              <button className="blog-header-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="blog-header-btn">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export { BlogHeader };
