/**
 * Validation 유틸리티
 * 이메일, 비밀번호, 전화번호 등 검증 함수
 * KOMCA 패턴 업그레이드 버전
 */

// ============================================
// 이메일 검증
// ============================================

/**
 * 이메일 형식 검증
 * @example isValidEmail('test@example.com') // true
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// ============================================
// 비밀번호 검증
// ============================================

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

const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  minLength: 8,
  maxLength: 50,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

/**
 * 비밀번호 검증 (상세 결과)
 * @example
 * const result = validatePassword('Test1234!');
 * // { isValid: true, errors: [], strength: 'strong' }
 */
export function validatePassword(
  password: string,
  options: PasswordOptions = {}
): PasswordValidationResult {
  const opts = { ...DEFAULT_PASSWORD_OPTIONS, ...options };
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['비밀번호를 입력해주세요.'], strength: 'weak' };
  }

  // 길이 검증
  if (opts.minLength && password.length < opts.minLength) {
    errors.push(`비밀번호는 ${opts.minLength}자 이상이어야 합니다.`);
  }
  if (opts.maxLength && password.length > opts.maxLength) {
    errors.push(`비밀번호는 ${opts.maxLength}자 이하여야 합니다.`);
  }

  // 대문자 검증
  if (opts.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }

  // 소문자 검증
  if (opts.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }

  // 숫자 검증
  if (opts.requireNumber && !/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }

  // 특수문자 검증
  if (opts.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  // 강도 계산
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * 비밀번호 형식 검증 (간단)
 * @example isValidPassword('Test1234!') // true
 */
export function isValidPassword(password: string, options?: PasswordOptions): boolean {
  return validatePassword(password, options).isValid;
}

// ============================================
// 전화번호 검증
// ============================================

/**
 * 한국 전화번호 검증
 * @example isValidPhone('010-1234-5678') // true
 * @example isValidPhone('01012345678') // true
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[^0-9]/g, '');

  // 휴대폰 (010, 011, 016, 017, 018, 019)
  if (/^01[0-9]\d{7,8}$/.test(cleaned)) return true;

  // 서울 지역번호
  if (/^02\d{7,8}$/.test(cleaned)) return true;

  // 기타 지역번호
  if (/^0[3-6][0-9]\d{7,8}$/.test(cleaned)) return true;

  return false;
}

/**
 * 휴대폰 번호만 검증
 * @example isValidMobile('010-1234-5678') // true
 */
export function isValidMobile(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return /^01[016789]\d{7,8}$/.test(cleaned);
}

// ============================================
// URL 검증
// ============================================

/**
 * URL 형식 검증
 * @example isValidUrl('https://example.com') // true
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// IP 주소 검증
// ============================================

/**
 * IPv4 주소 검증
 * @example isValidIPv4('192.168.0.1') // true
 */
export function isValidIPv4(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

// ============================================
// 사업자등록번호 검증
// ============================================

/**
 * 사업자등록번호 검증 (한국)
 * @example isValidBusinessNumber('123-45-67890') // true
 */
export function isValidBusinessNumber(number: string): boolean {
  if (!number || typeof number !== 'string') return false;
  const cleaned = number.replace(/[^0-9]/g, '');

  if (cleaned.length !== 10) return false;

  const checkSum = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * checkSum[i];
  }

  sum += Math.floor((parseInt(cleaned[8]) * 5) / 10);
  const remainder = (10 - (sum % 10)) % 10;

  return remainder === parseInt(cleaned[9]);
}

// ============================================
// 주민등록번호 검증
// ============================================

/**
 * 주민등록번호 형식 검증 (실제 유효성은 검증하지 않음)
 * @example isValidResidentNumber('900101-1234567') // 형식만 검증
 */
export function isValidResidentNumberFormat(number: string): boolean {
  if (!number || typeof number !== 'string') return false;
  const cleaned = number.replace(/[^0-9]/g, '');
  if (cleaned.length !== 13) return false;

  // 성별 코드 검증 (1~4)
  const genderCode = parseInt(cleaned[6]);
  if (genderCode < 1 || genderCode > 4) return false;

  return true;
}

// ============================================
// 공통 유틸리티
// ============================================

/**
 * 빈 값 검증
 * @example isEmpty('') // true
 * @example isEmpty(null) // true
 * @example isEmpty([]) // true
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 빈 값이 아닌지 검증
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

/**
 * 숫자만 포함하는지 검증
 * @example isNumericOnly('12345') // true
 */
export function isNumericOnly(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return /^\d+$/.test(value);
}

/**
 * 한글만 포함하는지 검증
 * @example isKoreanOnly('홍길동') // true
 */
export function isKoreanOnly(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return /^[가-힣]+$/.test(value);
}

/**
 * 영문만 포함하는지 검증
 * @example isAlphaOnly('abc') // true
 */
export function isAlphaOnly(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * 영문+숫자만 포함하는지 검증
 * @example isAlphanumeric('abc123') // true
 */
export function isAlphanumeric(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return /^[a-zA-Z0-9]+$/.test(value);
}
