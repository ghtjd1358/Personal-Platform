import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken, getCurrentUser } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';

interface UseUserFloatingMenuReturn {
  /** 메뉴 드롭다운 열림 여부 */
  isOpen: boolean;
  /** 메뉴 열림 토글 */
  toggleOpen: () => void;
  /** 메뉴 강제 닫기 (item 클릭 후 호출) */
  close: () => void;
  /** 스크롤 위치가 100px 초과인지 — top 버튼 노출 분기 */
  showScrollTop: boolean;
  /** 페이지 최상단 부드러운 스크롤 */
  scrollToTop: () => void;
  /** 로그인 여부 */
  isAuthenticated: boolean;
  /** 현재 로그인 유저 — 메뉴 헤더 username */
  currentUser: ReturnType<typeof getCurrentUser>;
  /** 현재 경로가 홈인지 — 홈 버튼 노출 분기 */
  isHomePage: boolean;
  /** 현재 경로가 mypage 인지 — 메뉴 active 상태 */
  isMyPage: boolean;
}

/**
 * UserFloatingMenu 비즈니스 로직 hook.
 *
 * - 스크롤 감지 (showScrollTop)
 * - 메뉴 열림/닫힘 상태
 * - 인증 상태 (Redux selector)
 * - 현재 경로 기반 분기 (isHomePage / isMyPage)
 *
 * UI 컴포넌트는 본 hook 반환값을 받아 렌더링만 한다.
 */
export function useUserFloatingMenu(): UseUserFloatingMenuReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;
  const currentUser = getCurrentUser();

  // 스크롤 감지 — 100px 초과 시 top 버튼 노출
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기값 동기화
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 현재 페이지 분기
  const isHomePage =
    location.pathname === `${LINK_PREFIX}/` ||
    location.pathname === `${LINK_PREFIX}` ||
    location.pathname === '/';
  const isMyPage = location.pathname.includes('/mypage');

  return {
    isOpen,
    toggleOpen,
    close,
    showScrollTop,
    scrollToTop,
    isAuthenticated,
    currentUser,
    isHomePage,
    isMyPage,
  };
}
