import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import { getPosts, PostSummary } from '@/network';

const UserFloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PostSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();

  // 현재 페이지 확인
  const isHomePage = location.pathname === `${LINK_PREFIX}/` || location.pathname === `${LINK_PREFIX}`;
  const isWritePage = location.pathname.includes('/write');
  const isMyPage = location.pathname.includes('/user/');

  // 검색창 열릴 때 포커스
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // 검색 디바운스
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const debounce = setTimeout(async () => {
      try {
        const res = await getPosts({ search: searchTerm, limit: 5 });
        if (res.success && res.data) {
          setSearchResults(res.data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsOpen(false);
    if (isSearchOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const handleResultClick = (slug: string) => {
    navigate(`${LINK_PREFIX}/post/${slug}`);
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };


  return (
    <>
      {/* 상단 검색바 */}
      <div className={`top-search-bar ${isSearchOpen ? 'open' : ''}`}>
        <div className="top-search-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="블로그 글 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="top-search-close"
            onClick={handleSearchToggle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 검색 결과 */}
        {searchTerm && (
          <div className="top-search-results">
            {searching ? (
              <div className="top-search-loading">검색 중...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((post) => (
                <button
                  key={post.id}
                  className="top-search-item"
                  onClick={() => handleResultClick(post.slug || post.id)}
                >
                  <span className="top-search-title">{post.title}</span>
                </button>
              ))
            ) : (
              <div className="top-search-empty">검색 결과가 없습니다</div>
            )}
          </div>
        )}
      </div>

      <div className="user-floating-menu">
        {/* 홈 버튼 (홈페이지가 아닐 때만) */}
        {!isHomePage && (
          <Link
            to={`${LINK_PREFIX}/`}
            className="user-floating-btn home-btn"
            aria-label="블로그 홈"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        )}

        {/* 검색 버튼 */}
        <button
          className={`user-floating-btn search-btn ${isSearchOpen ? 'active' : ''}`}
          onClick={handleSearchToggle}
          aria-label="검색"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* 사용자 메뉴 버튼 */}
        {isAuthenticated ? (
          <>
            <button
              className={`user-floating-btn ${isOpen ? 'active' : ''}`}
              onClick={() => {
                setIsOpen(!isOpen);
                setIsSearchOpen(false);
              }}
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
                  to={`${LINK_PREFIX}/user/${currentUser?.id}`}
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
                  to={`${LINK_PREFIX}/write`}
                  className={`user-floating-item ${isWritePage ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  글쓰기
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
    </>
  );
};

export { UserFloatingMenu };
