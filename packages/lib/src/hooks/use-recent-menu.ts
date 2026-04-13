/**
 * useRecentMenu Hook
 * 최근 방문 메뉴 상태 저장/복구
 */

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  addRecentMenu,
  removeRecentMenu,
  setCurrentRecentMenu,
  updateRecentMenuState,
  clearRecentMenu,
  closeOtherMenus,
  setRecentMenuList,
  selectRecentMenuList,
  selectCurrentRecentMenu,
  selectCurrentRecentMenuId,
} from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
import { RecentMenu } from '../types';

export interface UseRecentMenuOptions {
  /** 자동으로 현재 경로를 최근 메뉴에 추가할지 여부 */
  autoTrack?: boolean;
  /** 제외할 경로 패턴 */
  excludePaths?: (string | RegExp)[];
  /** 메뉴 제목 생성 함수 */
  getTitleFromPath?: (pathname: string) => string;
}

/**
 * useRecentMenu Hook
 */
export function useRecentMenu(options: UseRecentMenuOptions = {}) {
  const {
    autoTrack = false,
    excludePaths = ['/login', '/error'],
    getTitleFromPath = (pathname) => pathname.split('/').pop() || 'Home',
  } = options;

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const recentMenuList = useSelector(selectRecentMenuList);
  const currentMenu = useSelector(selectCurrentRecentMenu);
  const currentMenuId = useSelector(selectCurrentRecentMenuId);

  // 이전 위치 저장 (상태 저장용)
  const prevLocationRef = useRef(location);

  /**
   * 초기화: localStorage에서 복구
   */
  useEffect(() => {
    const saved = storage.getRecentMenu();
    if (saved && saved.length > 0) {
      dispatch(setRecentMenuList(saved));
    }
  }, [dispatch]);

  /**
   * 자동 추적 모드: 경로 변경 시 자동으로 추가
   */
  useEffect(() => {
    if (!autoTrack) return;

    // 제외 경로 체크
    const isExcluded = excludePaths.some((pattern) => {
      if (typeof pattern === 'string') {
        return location.pathname === pattern || location.pathname.startsWith(pattern);
      }
      return pattern.test(location.pathname);
    });

    if (isExcluded) return;

    // 메뉴 ID 생성 (pathname + search 기반)
    const menuId = `${location.pathname}${location.search}`;

    // 현재 경로를 최근 메뉴에 추가
    dispatch(
      addRecentMenu({
        id: menuId,
        pathname: location.pathname,
        search: location.search,
        title: getTitleFromPath(location.pathname),
      })
    );
  }, [autoTrack, location.pathname, location.search, dispatch, excludePaths, getTitleFromPath]);

  /**
   * 이전 페이지 상태 저장 (페이지 이탈 시)
   */
  useEffect(() => {
    const prevLocation = prevLocationRef.current;

    if (prevLocation.pathname !== location.pathname) {
      // 이전 페이지의 스크롤 위치 저장
      const prevMenuId = `${prevLocation.pathname}${prevLocation.search}`;
      dispatch(
        updateRecentMenuState({
          id: prevMenuId,
          state: {
            scrollY: window.scrollY,
            scrollX: window.scrollX,
          },
        })
      );
    }

    prevLocationRef.current = location;
  }, [location, dispatch]);

  /**
   * 메뉴 추가
   */
  const add = useCallback(
    (menu: Omit<RecentMenu, 'id'> & { id?: string }) => {
      const id = menu.id || `${menu.pathname}${menu.search || ''}`;
      dispatch(addRecentMenu({ ...menu, id }));
    },
    [dispatch]
  );

  /**
   * 메뉴 제거
   */
  const remove = useCallback(
    (id: string) => {
      dispatch(removeRecentMenu(id));
    },
    [dispatch]
  );

  /**
   * 현재 메뉴 변경
   */
  const setCurrent = useCallback(
    (id: string) => {
      dispatch(setCurrentRecentMenu(id));
    },
    [dispatch]
  );

  /**
   * 메뉴로 이동
   */
  const goTo = useCallback(
    (id: string) => {
      const menu = recentMenuList.find((m) => m.id === id);
      if (menu) {
        dispatch(setCurrentRecentMenu(id));
        navigate(`${menu.pathname}${menu.search || ''}`);

        // 저장된 스크롤 위치 복구
        if (menu.state?.scrollY !== undefined) {
          setTimeout(() => {
            window.scrollTo(menu.state.scrollX || 0, menu.state.scrollY);
          }, 100);
        }
      }
    },
    [recentMenuList, dispatch, navigate]
  );

  /**
   * 메뉴 상태 업데이트 (검색 조건, 선택된 항목 등)
   */
  const updateState = useCallback(
    (id: string, state: any) => {
      dispatch(updateRecentMenuState({ id, state }));
    },
    [dispatch]
  );

  /**
   * 메뉴 데이터 업데이트
   */
  const updateData = useCallback(
    (id: string, data: any) => {
      dispatch(updateRecentMenuState({ id, data }));
    },
    [dispatch]
  );

  /**
   * 현재 메뉴 상태 업데이트
   */
  const updateCurrentState = useCallback(
    (state: any) => {
      if (currentMenuId) {
        dispatch(updateRecentMenuState({ id: currentMenuId, state }));
      }
    },
    [currentMenuId, dispatch]
  );

  /**
   * 모든 메뉴 닫기
   */
  const closeAll = useCallback(() => {
    dispatch(clearRecentMenu());
  }, [dispatch]);

  /**
   * 다른 메뉴 모두 닫기
   */
  const closeOthers = useCallback(() => {
    dispatch(closeOtherMenus());
  }, [dispatch]);

  return {
    /** 최근 메뉴 목록 */
    list: recentMenuList,
    /** 현재 활성 메뉴 */
    current: currentMenu,
    /** 현재 활성 메뉴 ID */
    currentId: currentMenuId,
    /** 메뉴 추가 */
    add,
    /** 메뉴 제거 */
    remove,
    /** 현재 메뉴 설정 */
    setCurrent,
    /** 메뉴로 이동 */
    goTo,
    /** 메뉴 상태 업데이트 */
    updateState,
    /** 메뉴 데이터 업데이트 */
    updateData,
    /** 현재 메뉴 상태 업데이트 */
    updateCurrentState,
    /** 모든 메뉴 닫기 */
    closeAll,
    /** 다른 메뉴 모두 닫기 */
    closeOthers,
  };
}

export default useRecentMenu;
