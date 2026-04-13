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
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonContainer}>
          {showBackButton && (
            <button
              onClick={handleGoBack}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5a6268';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6c757d';
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
                e.currentTarget.style.backgroundColor = '#0056b3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
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
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#dee2e6',
    lineHeight: 1,
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#343a40',
    marginBottom: '12px',
  },
  message: {
    fontSize: '16px',
    color: '#6c757d',
    marginBottom: '32px',
    lineHeight: 1.5,
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  button: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#6c757d',
    color: '#fff',
    transition: 'background-color 0.2s',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
};

export default NotFound;
