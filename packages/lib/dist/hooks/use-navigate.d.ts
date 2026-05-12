/**
 * MFA Navigate Hook
 * 서비스 인식 네비게이션
 */
import { NavigateOptions } from 'react-router-dom';
import { ServiceType } from '../types/service';
export interface MfaNavigateOptions extends NavigateOptions {
    service?: ServiceType;
}
/**
 * MFA Navigate Hook
 * 서비스 prefix를 자동으로 처리하는 네비게이션
 */
export declare function useMfaNavigate(): (to: string | {
    pathname?: string;
    search?: string;
    hash?: string;
}, options?: MfaNavigateOptions) => void;
/**
 * 현재 위치 정보 Hook
 */
export declare function useCurrentLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    service: ServiceType | null;
    isHostApp: boolean;
};
/**
 * 경로 빌더
 */
export declare function buildPath(pathname: string, service?: ServiceType, params?: Record<string, string>): string;
//# sourceMappingURL=use-navigate.d.ts.map