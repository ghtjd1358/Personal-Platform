/**
 * Formatter 유틸리티 (KOMCA 패턴)
 * 전화번호, 날짜, 숫자 등의 포맷팅 함수 제공
 */
/**
 * 전화번호 포맷팅
 * @example phoneFormatter('01012345678') // '010-1234-5678'
 * @example phoneFormatter('0212345678') // '02-1234-5678'
 */
export declare function phoneFormatter(value: string | null | undefined): string;
/**
 * 날짜 포맷팅 (YYYYMMDD → YYYY.MM.DD 또는 YYYY-MM-DD)
 * @example dateFormatter('20240315') // '2024.03.15'
 * @example dateFormatter('20240315', '-') // '2024-03-15'
 */
export declare function dateFormatter(value: string | null | undefined, separator?: string): string;
/**
 * 날짜/시간 포맷팅 (Date 객체 → 문자열)
 * @example dateTimeFormatter(new Date()) // '2024.03.15 14:30:00'
 */
export declare function dateTimeFormatter(date: Date | null | undefined, options?: {
    dateOnly?: boolean;
    timeOnly?: boolean;
    separator?: string;
}): string;
/**
 * 숫자 콤마 포맷팅
 * @example numberFormatter(1234567) // '1,234,567'
 * @example numberFormatter(1234567.89) // '1,234,567.89'
 */
export declare function numberFormatter(value: number | string | null | undefined): string;
/**
 * 통화 포맷팅 (원화)
 * @example currencyFormatter(1234567) // '1,234,567원'
 * @example currencyFormatter(1234567, { prefix: '₩' }) // '₩1,234,567'
 */
export declare function currencyFormatter(value: number | string | null | undefined, options?: {
    prefix?: string;
    suffix?: string;
}): string;
/**
 * 바이트 사이즈 포맷팅
 * @example byteSizeFormatter(1024) // '1 KB'
 * @example byteSizeFormatter(1048576) // '1 MB'
 */
export declare function byteSizeFormatter(bytes: number | null | undefined): string;
/**
 * 마스킹 포맷팅 (개인정보 보호)
 * @example maskEmail('test@example.com') // 'te**@example.com'
 */
export declare function maskEmail(email: string | null | undefined): string;
/**
 * 이름 마스킹
 * @example maskName('홍길동') // '홍*동'
 */
export declare function maskName(name: string | null | undefined): string;
/**
 * 전화번호 마스킹
 * @example maskPhone('010-1234-5678') // '010-****-5678'
 */
export declare function maskPhone(phone: string | null | undefined): string;
/**
 * 상대 시간 포맷팅
 * @example relativeTimeFormatter(new Date(Date.now() - 60000)) // '1분 전'
 */
export declare function relativeTimeFormatter(date: Date | string | null | undefined): string;
/**
 * 퍼센트 포맷팅
 * @example percentFormatter(0.1234) // '12.34%'
 * @example percentFormatter(0.1234, 0) // '12%'
 */
export declare function percentFormatter(value: number | null | undefined, decimals?: number): string;
/**
 * 문자열 자르기 (말줄임)
 * @example truncate('안녕하세요 반갑습니다', 5) // '안녕하세...'
 */
export declare function truncate(str: string | null | undefined, maxLength: number, suffix?: string): string;
//# sourceMappingURL=formatter.d.ts.map