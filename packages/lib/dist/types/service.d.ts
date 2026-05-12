/**
 * Service Type 정의
 * 각 Remote 앱을 구분하는 타입
 */
export type ServiceType = 'resume' | 'blog' | 'portfolio';
export type ServicePrefixType = '@resume' | '@blog' | '@portfolio';
export declare const serviceTypeToPrefix: Record<ServiceType, ServicePrefixType>;
export declare const prefixToServiceType: Record<ServicePrefixType, ServiceType>;
export interface ServiceMeta {
    type: ServiceType;
    prefix: ServicePrefixType;
    name: string;
    port: number;
}
export declare const services: ServiceMeta[];
export declare const getServiceFromPath: (pathname: string) => ServiceType | null;
//# sourceMappingURL=service.d.ts.map