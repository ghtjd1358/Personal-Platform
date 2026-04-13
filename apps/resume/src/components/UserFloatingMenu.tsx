import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';

const UserFloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 현재 페이지 확인
  const isHomePage = location.pathname === `${LINK_PREFIX}/` || location.pathname === `${LINK_PREFIX}` || location.pathname === '/';
  const isMyPage = location.pathname.includes('/mypage');

  return (
    <div className="user-floating-menu">
      {/* 최상단 버튼 */}
      {showScrollTop && (
        <button
          className="user-floating-btn scroll-top"
          onClick={scrollToTop}
          aria-label="맨 위로"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="17 11 12 6 7 11" />
            <polyline points="17 18 12 13 7 18" />
          </svg>
        </button>
      )}

      {/* 홈 버튼 (홈페이지가 아닐 때만) */}
      {!isHomePage && (
        <Link
          to={`${LINK_PREFIX}/`}
          className="user-floating-btn home-btn"
          aria-label="홈으로"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      )}

      {/* 사용자 메뉴 버튼 */}
      {isAuthenticated ? (
        <>
          <button
            className={`user-floating-btn ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="사용자 메뉴"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {isOpen && (
            <div className="user-floating-dropdown">
              <div className="user-floating-header">
                {currentUser?.name || 'User'}
              </div>
              <Link
                to={`${LINK_PREFIX}/mypage`}
                className={`user-floating-item ${isMyPage ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                마이페이지
              </Link>
              <Link
                to={`${LINK_PREFIX}/resumes`}
                className="user-floating-item"
                onClick={() => setIsOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                이력서 둘러보기
              </Link>
            </div>
          )}
        </>
      ) : (
        <Link
          to={`${LINK_PREFIX}/login`}
          className="user-floating-btn"
          aria-label="로그인"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export { UserFloatingMenu };
