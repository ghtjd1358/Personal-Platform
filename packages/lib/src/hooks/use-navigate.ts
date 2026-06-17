import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { storage } from '../utils/storage';
import {
  ServiceType,
  ServicePrefixType,
  serviceTypeToPrefix,
  prefixToServiceType,
  getServiceFromPath
} from '../types/service';

export interface MfaNavigateOptions extends NavigateOptions {
  service?: ServiceType;
}

export function useMfaNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentService = useMemo(
    () => getServiceFromPath(location.pathname),
    [location.pathname]
  );

  return useCallback((
    to: string | { pathname?: string; search?: string; hash?: string },
    options?: MfaNavigateOptions
  ) => {
    storage.isHostApp(); // 호출 시점에 host 여부 확인

    let pathname: string;
    let search: string | undefined;
    let hash: string | undefined;

    if (typeof to === 'string') {
      pathname = to;
    } else {
      pathname = to.pathname || '';
      search = to.search;
      hash = to.hash;
    }

    let targetService = options?.service || currentService;

    if (pathname.startsWith('/@')) {
      // 이미 서비스 prefix 포함 — prefix로 targetService 갱신
      const prefix = pathname.split('/')[1] as ServicePrefixType;
      if (prefixToServiceType[prefix]) targetService = prefixToServiceType[prefix];
    } else if (!pathname.startsWith('/')) {
      // 상대 경로 — 현재 서비스 prefix 자동 추가
      if (targetService) {
        const prefix = serviceTypeToPrefix[targetService];
        pathname = `/${prefix}/${pathname}`;
      }
    }
    // 절대 경로('/'로 시작)는 그대로 사용

    const { service: _, ...navOptions } = options ?? {};
    navigate({ pathname, search, hash }, navOptions as NavigateOptions);
  }, [navigate, currentService]);
}

export function useCurrentLocation() {
  const location = useLocation();

  return useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    service: getServiceFromPath(location.pathname),
    isHostApp: storage.isHostApp(),
  }), [location]);
}

export function buildPath(
  pathname: string,
  service?: ServiceType,
  params?: Record<string, string>
): string {
  let path = pathname;

  if (service) {
    const prefix = serviceTypeToPrefix[service];
    if (!pathname.startsWith(`/${prefix}`)) {
      path = `/${prefix}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    }
  }

  if (params && Object.keys(params).length > 0) {
    path += `?${new URLSearchParams(params).toString()}`;
  }

  return path;
}
