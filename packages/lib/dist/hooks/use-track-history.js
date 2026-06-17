import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { dispatchToHost, getHostStore } from '../store/store-access';
import { setService } from '../store/ui-slice';
import { setRecentMenuList, addRecentMenu, setCurrentRecentMenu, updateRecentMenuState, } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
import { getServiceFromPath } from '../types/service';
function findTitleByPath(pathname, lnbItems) {
    for (const item of lnbItems) {
        // 정확한 세그먼트 경계 prefix 매칭 — '/blog'.includes('/') 같은 false positive 방지
        const normalizedLink = item.link.endsWith('/') ? item.link : item.link + '/';
        if (pathname === item.link || pathname.startsWith(normalizedLink)) {
            return item.title;
        }
        if (item.children) {
            const childTitle = findTitleByPath(pathname, item.children);
            if (childTitle)
                return childTitle;
        }
    }
    return '';
}
export function useTrackHistory(options) {
    const location = useLocation();
    const { lnbItems, excludePaths = [], onPageView } = options;
    const [loaded, setLoaded] = useState(false);
    const isInitRef = useRef(false);
    const prevLocationRef = useRef(null);
    // 페이지 정보 추가
    const addPageInfo = useCallback((pathname, search, state) => {
        const store = getHostStore();
        if (!store)
            return;
        const recentMenuState = store.getState().recentMenu;
        const list = recentMenuState?.list || [];
        // 이미 존재하는 메뉴인지 확인
        const existingIndex = list.findIndex((item) => item.pathname === pathname);
        const service = getServiceFromPath(pathname);
        if (existingIndex === -1) {
            const id = uuid();
            const title = findTitleByPath(pathname, lnbItems) || pathname.split('/').pop() || '페이지';
            dispatchToHost(addRecentMenu({ id, pathname, search, title, service: service ?? undefined, data: state }));
        }
        else {
            const existingMenu = list[existingIndex];
            dispatchToHost(setCurrentRecentMenu(existingMenu.id));
            if (search !== existingMenu.search) {
                dispatchToHost(updateRecentMenuState({ id: existingMenu.id, search }));
            }
            if (state) {
                dispatchToHost(updateRecentMenuState({ id: existingMenu.id, data: state }));
            }
        }
        if (service) {
            dispatchToHost(setService(service));
        }
    }, [lnbItems]);
    // 초기화
    useEffect(() => {
        if (isInitRef.current)
            return;
        isInitRef.current = true;
        // Storage에서 Recent Menu 복구
        const savedList = storage.getRecentMenu();
        if (savedList.length > 0) {
            dispatchToHost(setRecentMenuList(savedList));
        }
        // 현재 페이지 추가
        const { pathname, search } = window.location;
        if (!excludePaths.some(path => pathname.startsWith(path))) {
            addPageInfo(pathname, search);
        }
        prevLocationRef.current = { pathname, search };
        setLoaded(true);
    }, [addPageInfo, excludePaths]);
    // 라우팅 변경 감지
    useEffect(() => {
        if (!loaded)
            return;
        const { pathname, search, state } = location;
        const prev = prevLocationRef.current;
        // 같은 페이지면 무시
        if (prev && prev.pathname === pathname && prev.search === search) {
            return;
        }
        // 제외 경로면 무시
        if (excludePaths.some(path => pathname.startsWith(path))) {
            prevLocationRef.current = { pathname, search };
            return;
        }
        // 모달 상태면 무시
        if (state === 'modal') {
            prevLocationRef.current = { pathname, search };
            return;
        }
        addPageInfo(pathname, search, state);
        onPageView?.(pathname);
        prevLocationRef.current = { pathname, search };
    }, [location, loaded, addPageInfo, excludePaths, onPageView]);
    return { loaded };
}
export function useRecentMenuState() {
    const store = getHostStore();
    const subscribe = useCallback((cb) => store?.subscribe(cb) ?? (() => { }), [store]);
    const getSnapshot = useCallback(() => store?.getState().recentMenu ?? null, [store]);
    const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const currentMenu = state?.list?.find((menu) => menu.id === state?.currentId);
    return {
        list: state?.list ?? [],
        currentId: state?.currentId ?? '',
        currentMenu,
        data: currentMenu?.data,
        state: currentMenu?.state,
    };
}
