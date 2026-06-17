import { NavigateOptions } from 'react-router-dom';
import { ServiceType } from '../types/service';
export interface MfaNavigateOptions extends NavigateOptions {
    service?: ServiceType;
}
export declare function useMfaNavigate(): (to: string | {
    pathname?: string;
    search?: string;
    hash?: string;
}, options?: MfaNavigateOptions) => void;
export declare function useCurrentLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    service: ServiceType | null;
    isHostApp: boolean;
};
export declare function buildPath(pathname: string, service?: ServiceType, params?: Record<string, string>): string;
//# sourceMappingURL=use-navigate.d.ts.map