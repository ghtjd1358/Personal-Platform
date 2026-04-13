import React from 'react';

export interface AppNavbarProps {
  /** 앱 이름/타이틀 */
  appName?: string;
  /** 로고 클릭 시 이동할 경로 */
  homePath?: string;
  /** 관리 페이지 경로 */
  adminPath?: string;
  /** 로그인 페이지 경로 */
  loginPath?: string;
  /** 인증 상태 */
  isAuthenticated: boolean;
  /** 사용자 이름 */
  userName?: string;
  /** 로그아웃 핸들러 */
  onLogout: () => void;
  /** 네비게이션 함수 */
  onNavigate: (path: string) => void;
  /** 추가 네비게이션 링크 */
  extraLinks?: Array<{
    label: string;
    path: string;
    isActive?: boolean;
  }>;
}

/**
 * 공통 네비게이션 바 - KOMCA 패턴
 * Remote 앱 단독 실행 시 사용
 */
export const AppNavbar: React.FC<AppNavbarProps> = ({
  appName = '앱',
  homePath = '/',
  adminPath = '/admin',
  loginPath = '/login',
  isAuthenticated,
  userName,
  onLogout,
  onNavigate,
  extraLinks = []
}) => {
  const styles: Record<string, React.CSSProperties> = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2E8F0',
    },
    inner: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      color: '#1E3A5F',
      fontWeight: 600,
      fontSize: '16px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    link: {
      padding: '8px 16px',
      color: '#64748B',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 500,
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
    },
    linkActive: {
      color: '#0EA5E9',
      background: 'rgba(14, 165, 233, 0.1)',
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.inner}>
        <button style={styles.logoLink} onClick={() => onNavigate(homePath)}>
          <svg viewBox="0 0 48 48" width="24" height="24" fill="none">
            <path
              d="M 8 40 L 24 8 L 40 40"
              stroke="#1E3A5F"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span>{appName}</span>
        </button>

        <div style={styles.links}>
          <button
            style={styles.link}
            onClick={() => onNavigate(homePath)}
            onMouseOver={(e) => (e.currentTarget.style.background = '#F8FAFC')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            홈
          </button>

          {extraLinks.map((link) => (
            <button
              key={link.path}
              style={{
                ...styles.link,
                ...(link.isActive ? styles.linkActive : {}),
              }}
              onClick={() => onNavigate(link.path)}
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated && (
            <button
              style={styles.link}
              onClick={() => onNavigate(adminPath)}
              onMouseOver={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              관리
            </button>
          )}

          {!isAuthenticated ? (
            <button
              style={{
                ...styles.link,
                background: '#1E3A5F',
                color: 'white',
              }}
              onClick={() => onNavigate(loginPath)}
              onMouseOver={(e) => (e.currentTarget.style.background = '#0EA5E9')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#1E3A5F')}
            >
              로그인
            </button>
          ) : (
            <button
              style={styles.link}
              onClick={onLogout}
              onMouseOver={(e) => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              로그아웃 {userName && `(${userName})`}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
