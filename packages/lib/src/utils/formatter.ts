/**
 * Formatter 유틸리티 (KOMCA 패턴)
 * 전화번호, 날짜, 숫자 등의 포맷팅 함수 제공
 */

/**
 * 전화번호 포맷팅
 * @example phoneFormatter('01012345678') // '010-1234-5678'
 * @example phoneFormatter('0212345678') // '02-1234-5678'
 */
export function phoneFormatter(value: string | null | undefined): string {
  if (!value) return '';

  // 숫자만 추출
  const numbers = value.replace(/[^0-9]/g, '');

  // 휴대폰 번호 (010, 011, 016, 017, 018, 019)
  if (numbers.match(/^01[0-9]/)) {
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }

  // 서울 지역번호 (02)
  if (numbers.startsWith('02')) {
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (numbers.length === 9) {
      return numbers.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }

  // 기타 지역번호 (031, 032, ...)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return numbers;
}

/**
 * 날짜 포맷팅 (YYYYMMDD → YYYY.MM.DD 또는 YYYY-MM-DD)
 * @example dateFormatter('20240315') // '2024.03.15'
 * @example dateFormatter('20240315', '-') // '2024-03-15'
 */
export function dateFormatter(
  value: string | null | undefined,
  separator: string = '.'
): string {
  if (!value) return '';

  const numbers = value.replace(/[^0-9]/g, '');

  if (numbers.length === 8) {
    const year = numbers.substring(0, 4);
    const month = numbers.substring(4, 6);
    const day = numbers.substring(6, 8);
    return `${year}${separator}${month}${separator}${day}`;
  }

  return value;
}

/**
 * 날짜/시간 포맷팅 (Date 객체 → 문자열)
 * @example dateTimeFormatter(new Date()) // '2024.03.15 14:30:00'
 */
export function dateTimeFormatter(
  date: Date | null | undefined,
  options?: {
    dateOnly?: boolean;
    timeOnly?: boolean;
    separator?: string;
  }
): string {
  if (!date) return '';

  const { dateOnly = false, timeOnly = false, separator = '.' } = options || {};

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (timeOnly) {
    return `${hours}:${minutes}:${seconds}`;
  }

  const dateStr = `${year}${separator}${month}${separator}${day}`;

  if (dateOnly) {
    return dateStr;
  }

  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

/**
 * 숫자 콤마 포맷팅
 * @example numberFormatter(1234567) // '1,234,567'
 * @example numberFormatter(1234567.89) // '1,234,567.89'
 */
export function numberFormatter(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '';

  return num.toLocaleString('ko-KR');
}

/**
 * 통화 포맷팅 (원화)
 * @example currencyFormatter(1234567) // '1,234,567원'
 * @example currencyFormatter(1234567, { prefix: '₩' }) // '₩1,234,567'
 */
export function currencyFormatter(
  value: number | string | null | undefined,
  options?: { prefix?: string; suffix?: string }
): string {
  const { prefix = '', suffix = '원' } = options || {};
  const formatted = numberFormatter(value);

  if (!formatted) return '';

  return `${prefix}${formatted}${suffix}`;
}

/**
 * 바이트 사이즈 포맷팅
 * @example byteSizeFormatter(1024) // '1 KB'
 * @example byteSizeFormatter(1048576) // '1 MB'
 */
export function byteSizeFormatter(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return '';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

/**
 * 마스킹 포맷팅 (개인정보 보호)
 * @example maskEmail('test@example.com') // 'te**@example.com'
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return '';

  const [localPart, domain] = email.split('@');
  if (!domain) return email;

  const maskedLocal = localPart.length > 2
    ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
    : localPart;

  return `${maskedLocal}@${domain}`;
}

/**
 * 이름 마스킹
 * @example maskName('홍길동') // '홍*동'
 */
export function maskName(name: string | null | undefined): string {
  if (!name) return '';

  if (name.length === 2) {
    return name.charAt(0) + '*';
  }

  if (name.length > 2) {
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }

  return name;
}

/**
 * 전화번호 마스킹
 * @example maskPhone('010-1234-5678') // '010-****-5678'
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';

  const formatted = phoneFormatter(phone);
  const parts = formatted.split('-');

  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }

  return formatted;
}

/**
 * 상대 시간 포맷팅
 * @example relativeTimeFormatter(new Date(Date.now() - 60000)) // '1분 전'
 */
export function relativeTimeFormatter(date: Date | string | null | undefined): string {
  if (!date) return '';

  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 30) return `${diffDay}일 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${diffYear}년 전`;
}

/**
 * 퍼센트 포맷팅
 * @example percentFormatter(0.1234) // '12.34%'
 * @example percentFormatter(0.1234, 0) // '12%'
 */
export function percentFormatter(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined) return '';

  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 문자열 자르기 (말줄임)
 * @example truncate('안녕하세요 반갑습니다', 5) // '안녕하세...'
 */
export function truncate(
  str: string | null | undefined,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!str) return '';

  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength) + suffix;
}
