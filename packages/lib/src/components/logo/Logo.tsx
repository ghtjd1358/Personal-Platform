import React, { useState } from 'react';

export interface LogoProps {
  /** 크기 프리셋 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 커스텀 크기 (중앙 아이콘 기준 px) */
  customSize?: number;
  /** ㅅ 색상 */
  sideColor?: string;
  /** ㅎ 색상 */
  centerColor?: string;
  /** 눈 색상 */
  eyeColor?: string;
  /** 호버 효과 활성화 */
  interactive?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 커스텀 클래스 */
  className?: string;
  /** 중앙 ㅎ만 표시 (사이드바 축소 모드용) */
  centerOnly?: boolean;
}

const sizeMap = {
  sm: { main: 24, side: 14 },
  md: { main: 40, side: 22 },
  lg: { main: 56, side: 32 },
  xl: { main: 72, side: 42 },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  customSize,
  sideColor = '#1E3A5F',
  centerColor = '#0EA5E9',
  eyeColor = '#FFFFFF',
  interactive = true,
  onClick,
  className = '',
  centerOnly = false,
}) => {
  const [sideHover, setSideHover] = useState(false);
  const [centerHover, setCenterHover] = useState(false);

  const dimensions = customSize
    ? { main: customSize, side: Math.round(customSize * 0.58) }
    : sizeMap[size];

  const styles = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Math.round(dimensions.main * 0.2),
      cursor: onClick ? 'pointer' : 'default',
    },
    side: {
      cursor: interactive ? 'pointer' : 'default',
      transition: 'transform 0.2s ease',
    },
    center: {
      cursor: interactive ? 'pointer' : 'default',
    },
  };

  // 눈 위치 (호버시 위로 이동)
  const eyeY = sideHover && interactive ? 33 : 36;

  // 콧구멍 크기 (호버시 커짐)
  const noseRx = centerHover && interactive ? 5.5 : 4;
  const noseRy = centerHover && interactive ? 8 : 6;

  return (
    <div
      style={styles.container}
      className={`logo ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* 왼쪽 ㅅ */}
      {!centerOnly && (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={dimensions.side}
          height={dimensions.side}
          style={styles.side}
          onMouseEnter={() => setSideHover(true)}
          onMouseLeave={() => setSideHover(false)}
        >
          <path
            d="M 8 40 L 24 8 L 40 40"
            stroke={sideColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}

      {/* 중앙 ㅎ */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={dimensions.main}
        height={dimensions.main}
        style={styles.center}
        onMouseEnter={() => setCenterHover(true)}
        onMouseLeave={() => setCenterHover(false)}
      >
        {/* ㅎ 윗부분 */}
        <rect x="20" y="2" width="8" height="16" rx="4" fill={centerColor} />
        {/* ㅎ 가로줄 */}
        <rect x="6" y="16" width="36" height="6" rx="3" fill={centerColor} />
        {/* ㅎ 아랫부분 (얼굴) */}
        <ellipse cx="24" cy="36" rx="18" ry="12" fill={centerColor} />
        {/* 눈 (왼쪽) */}
        <ellipse
          cx="17"
          cy={eyeY}
          rx={noseRx}
          ry={noseRy}
          fill={eyeColor}
          style={{ transition: 'all 0.2s ease' }}
        />
        {/* 눈 (오른쪽) */}
        <ellipse
          cx="31"
          cy={eyeY}
          rx={noseRx}
          ry={noseRy}
          fill={eyeColor}
          style={{ transition: 'all 0.2s ease' }}
        />
      </svg>

      {/* 오른쪽 ㅅ */}
      {!centerOnly && (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={dimensions.side}
          height={dimensions.side}
          style={styles.side}
          onMouseEnter={() => setSideHover(true)}
          onMouseLeave={() => setSideHover(false)}
        >
          <path
            d="M 8 40 L 24 8 L 40 40"
            stroke={sideColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
};

export default Logo;
