/**
 * RemoteErrorFallback
 * Remote 앱 로드 실패 시 표시되는 Fallback UI
 */
import React from 'react';

export interface RemoteErrorFallbackProps {
  /** Remote 앱 이름 (예: "이력서", "블로그") */
  remoteName: string;
  /** 재시도 콜백 */
  onRetry?: () => void;
  /** 에러 메시지 (개발 환경에서만 표시) */
  error?: Error | null;
}

export function RemoteErrorFallback({
  remoteName,
  onRetry,
  error
}: RemoteErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        minHeight: '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '24px',
      }}
    >
      {/* 아이콘 */}
      <div
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          opacity: 0.5,
        }}
      >
        ⚠️
      </div>

      {/* 제목 */}
      <h2
        style={{
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: 600,
          color: '#343a40',
        }}
      >
        {remoteName} 앱을 불러올 수 없습니다
      </h2>

      {/* 설명 */}
      <p
        style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          color: '#6c757d',
          maxWidth: '400px',
        }}
      >
        서비스에 일시적인 문제가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>

      {/* 재시도 버튼 */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          다시 시도
        </button>
      )}

      {/* 개발 환경에서만 에러 상세 표시 */}
      {isDev && error && (
        <details
          style={{
            marginTop: '24px',
            padding: '12px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#856404',
            maxWidth: '500px',
            textAlign: 'left',
          }}
        >
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            개발자 정보 (개발 환경에서만 표시)
          </summary>
          <pre
            style={{
              marginTop: '8px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}

export default RemoteErrorFallback;