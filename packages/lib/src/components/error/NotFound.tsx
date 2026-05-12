/**
 * 404 NotFound 컴포넌트
 * 존재하지 않는 페이지 접근 시 표시
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface NotFoundProps {
  /** 커스텀 타이틀 */
  title?: string;
  /** 커스텀 메시지 */
  message?: string;
  /** 홈 경로 */
  homePath?: string;
  /** 뒤로가기 버튼 표시 여부 */
  showBackButton?: boolean;
  /** 홈 버튼 표시 여부 */
  showHomeButton?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = '페이지를 찾을 수 없습니다',
  message = '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
  homePath = '/',
  showBackButton = true,
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(homePath);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.eyebrow}>404 · NOT FOUND</div>
        <div style={styles.errorCode}>四〇四</div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonContainer}>
          {showBackButton && (
            <button
              onClick={handleGoBack}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2B1E14';
                e.currentTarget.style.color = '#FBF5E3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2B1E14';
              }}
            >
              이전 페이지
            </button>
          )}
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              style={{ ...styles.button, ...styles.primaryButton }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6E1614';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8C1E1A';
              }}
            >
              홈으로
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F4EAD5',
    padding: '24px',
    fontFamily: '"Iowan Old Style", "Nanum Myeongjo", "Apple SD Gothic Neo", serif',
  },
  content: {
    textAlign: 'center',
    maxWidth: '520px',
  },
  eyebrow: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8C1E1A',
    letterSpacing: '0.24em',
    marginBottom: '24px',
    fontFamily: '"SF Mono", "Menlo", monospace',
  },
  errorCode: {
    fontSize: '96px',
    fontWeight: 700,
    color: '#2B1E14',
    lineHeight: 1,
    marginBottom: '24px',
    letterSpacing: '-0.02em',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#2B1E14',
    marginBottom: '14px',
    letterSpacing: '-0.01em',
  },
  message: {
    fontSize: '15px',
    color: '#6E5E4E',
    marginBottom: '40px',
    lineHeight: 1.7,
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  button: {
    padding: '12px 28px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1.5px solid #2B1E14',
    borderRadius: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#2B1E14',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    fontFamily: '"SF Mono", "Menlo", monospace',
  },
  primaryButton: {
    backgroundColor: '#8C1E1A',
    borderColor: '#8C1E1A',
    color: '#FBF5E3',
  },
};

export default NotFound;
