/**
 * Validation 유틸리티
 * 이메일, 비밀번호, 전화번호 등 검증 함수
 * KOMCA 패턴 업그레이드 버전
 */
/**
 * 이메일 형식 검증
 * @example isValidEmail('test@example.com') // true
 */
export declare function isValidEmail(email: string): boolean;
export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
}
export interface PasswordOptions {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
}
/**
 * 비밀번호 검증 (상세 결과)
 * @example
 * const result = validatePassword('Test1234!');
 * // { isValid: true, errors: [], strength: 'strong' }
 */
export declare function validatePassword(password: string, options?: PasswordOptions): PasswordValidationResult;
/**
 * 비밀번호 형식 검증 (간단)
 * @example isValidPassword('Test1234!') // true
 */
export declare function isValidPassword(password: string, options?: PasswordOptions): boolean;
/**
 * 한국 전화번호 검증
 * @example isValidPhone('010-1234-5678') // true
 * @example isValidPhone('01012345678') // true
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * 휴대폰 번호만 검증
 * @example isValidMobile('010-1234-5678') // true
 */
export declare function isValidMobile(phone: string): boolean;
/**
 * URL 형식 검증
 * @example isValidUrl('https://example.com') // true
 */
export declare function isValidUrl(url: string): boolean;
/**
 * IPv4 주소 검증
 * @example isValidIPv4('192.168.0.1') // true
 */
export declare function isValidIPv4(ip: string): boolean;
/**
 * 사업자등록번호 검증 (한국)
 * @example isValidBusinessNumber('123-45-67890') // true
 */
export declare function isValidBusinessNumber(number: string): boolean;
/**
 * 주민등록번호 형식 검증 (실제 유효성은 검증하지 않음)
 * @example isValidResidentNumber('900101-1234567') // 형식만 검증
 */
export declare function isValidResidentNumberFormat(number: string): boolean;
/**
 * 빈 값 검증
 * @example isEmpty('') // true
 * @example isEmpty(null) // true
 * @example isEmpty([]) // true
 */
export declare function isEmpty(value: any): boolean;
/**
 * 빈 값이 아닌지 검증
 */
export declare function isNotEmpty(value: any): boolean;
/**
 * 숫자만 포함하는지 검증
 * @example isNumericOnly('12345') // true
 */
export declare function isNumericOnly(value: string): boolean;
/**
 * 한글만 포함하는지 검증
 * @example isKoreanOnly('홍길동') // true
 */
export declare function isKoreanOnly(value: string): boolean;
/**
 * 영문만 포함하는지 검증
 * @example isAlphaOnly('abc') // true
 */
export declare function isAlphaOnly(value: string): boolean;
/**
 * 영문+숫자만 포함하는지 검증
 * @example isAlphanumeric('abc123') // true
 */
export declare function isAlphanumeric(value: string): boolean;
//# sourceMappingURL=validation.d.ts.map