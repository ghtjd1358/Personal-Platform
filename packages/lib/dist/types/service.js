/**
 * Service Type 정의
 * 각 Remote 앱을 구분하는 타입
 */
// Service Type → Prefix 매핑
export const serviceTypeToPrefix = {
    resume: '@resume',
    blog: '@blog',
    portfolio: '@portfolio',
};
// Prefix → Service Type 매핑
export const prefixToServiceType = {
    '@resume': 'resume',
    '@blog': 'blog',
    '@portfolio': 'portfolio',
};
// 서비스 목록
export const services = [
    { type: 'resume', prefix: '@resume', name: '이력서', port: 5001 },
    { type: 'blog', prefix: '@blog', name: '블로그', port: 5002 },
    { type: 'portfolio', prefix: '@portfolio', name: '포트폴리오', port: 5003 },
];
// 경로에서 서비스 타입 추출
export const getServiceFromPath = (pathname) => {
    for (const service of services) {
        if (pathname.startsWith(`/${service.prefix}`) || pathname.startsWith(service.prefix)) {
            return service.type;
        }
    }
    return null;
};
